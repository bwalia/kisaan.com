//! Shop catalogue: seller sub-shops, products, variants, inventory.

use chrono::{DateTime, Utc};
use kisaan_common::{normalize_country_code, ProductId, ShopId, UserId, VariantId};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ShopError {
    #[error("shop not found")]
    NotFound,
    #[error("product not found")]
    ProductNotFound,
    #[error("forbidden")]
    Forbidden,
    #[error("invalid country")]
    InvalidCountry,
    #[error("invalid currency for country")]
    InvalidCurrency,
    #[error("slug already taken in this country")]
    SlugTaken,
    #[error("shop must be DRAFT to update")]
    NotDraft,
    #[error("shop must be DRAFT to publish")]
    CannotPublish,
    #[error("sku already exists in this shop")]
    SkuTaken,
    #[error("amount_minor_units must be >= 0")]
    InvalidAmount,
    #[error(transparent)]
    Db(#[from] sqlx::Error),
}

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
pub struct Shop {
    pub id: ShopId,
    pub farmer_user_id: UserId,
    pub slug: String,
    pub name: String,
    pub description: Option<String>,
    pub logo_url: Option<String>,
    pub banner_url: Option<String>,
    pub country_code: String,
    pub default_currency: String,
    pub contact: Option<String>,
    pub status: String,
    pub published_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
pub struct Product {
    pub id: ProductId,
    pub shop_id: ShopId,
    pub sku: String,
    pub name: String,
    pub description: Option<String>,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
pub struct ProductVariant {
    pub id: VariantId,
    pub product_id: ProductId,
    pub label: String,
    pub amount_minor_units: i64,
    pub currency: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ProductWithPrice {
    #[serde(flatten)]
    pub product: Product,
    pub amount_minor_units: i64,
    pub currency: String,
    pub variant_id: VariantId,
    pub quantity: i32,
    /// Optional approximate display conversion (never mutates stored price).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub display: Option<DisplayMoney>,
}

#[derive(Debug, Clone, Serialize)]
pub struct DisplayMoney {
    pub amount_minor_units: i64,
    pub currency: String,
    pub approximate: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateShopRequest {
    pub name: String,
    pub slug: String,
    pub country_code: String,
    pub description: Option<String>,
    pub logo_url: Option<String>,
    pub banner_url: Option<String>,
    pub contact: Option<String>,
    /// Defaults to the country's default currency when omitted.
    pub default_currency: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateShopRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub logo_url: Option<String>,
    pub banner_url: Option<String>,
    pub contact: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateProductRequest {
    pub sku: String,
    pub name: String,
    pub description: Option<String>,
    pub amount_minor_units: i64,
    pub quantity: Option<i32>,
    pub variant_label: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProductRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub amount_minor_units: Option<i64>,
    pub quantity: Option<i32>,
}

const SHOP_RETURNING: &str = "id, farmer_user_id, slug, name, description, logo_url, banner_url, country_code, default_currency, contact, status, published_at, created_at, updated_at";

fn sql_insert_shop() -> String {
    format!(
        "INSERT INTO shops (farmer_user_id, slug, name, description, logo_url, banner_url, country_code, default_currency, contact, status) \
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'DRAFT') RETURNING {SHOP_RETURNING}"
    )
}

fn sql_select_shop_by_id() -> String {
    format!("SELECT {SHOP_RETURNING} FROM shops WHERE id = $1")
}

fn sql_list_my_shops() -> String {
    format!(
        "SELECT {SHOP_RETURNING} FROM shops \
         WHERE id IN (SELECT shop_id FROM shop_members WHERE user_id = $1) \
         ORDER BY created_at DESC"
    )
}

fn sql_update_shop() -> String {
    format!(
        "UPDATE shops SET name = COALESCE($2, name), description = COALESCE($3, description), \
         logo_url = COALESCE($4, logo_url), banner_url = COALESCE($5, banner_url), \
         contact = COALESCE($6, contact), updated_at = NOW() \
         WHERE id = $1 RETURNING {SHOP_RETURNING}"
    )
}

fn sql_publish_shop() -> String {
    format!(
        "UPDATE shops SET status = 'PUBLISHED', published_at = NOW(), updated_at = NOW() \
         WHERE id = $1 RETURNING {SHOP_RETURNING}"
    )
}

fn sql_list_published() -> String {
    format!(
        "SELECT {SHOP_RETURNING} FROM shops \
         WHERE country_code = $1 AND status = 'PUBLISHED' \
         ORDER BY published_at DESC NULLS LAST, name"
    )
}

fn sql_get_published_slug() -> String {
    format!(
        "SELECT {SHOP_RETURNING} FROM shops \
         WHERE country_code = $1 AND slug = $2 AND status = 'PUBLISHED'"
    )
}

async fn country_default_currency(pool: &PgPool, code: &str) -> Result<Option<String>, sqlx::Error> {
    sqlx::query_scalar::<_, String>(
        "SELECT default_currency FROM countries WHERE code = $1 AND is_active = true",
    )
    .bind(code)
    .fetch_optional(pool)
    .await
}

async fn currency_exists(pool: &PgPool, code: &str) -> Result<bool, sqlx::Error> {
    let found = sqlx::query_scalar::<_, String>("SELECT code FROM currencies WHERE code = $1")
        .bind(code)
        .fetch_optional(pool)
        .await?;
    Ok(found.is_some())
}

async fn assert_member(pool: &PgPool, shop_id: ShopId, user_id: UserId) -> Result<(), ShopError> {
    let role = sqlx::query_scalar::<_, String>(
        "SELECT role FROM shop_members WHERE shop_id = $1 AND user_id = $2",
    )
    .bind(shop_id)
    .bind(user_id)
    .fetch_optional(pool)
    .await?;
    match role.as_deref() {
        Some("OWNER") | Some("STAFF") => Ok(()),
        _ => Err(ShopError::Forbidden),
    }
}

pub async fn create_shop(
    pool: &PgPool,
    user_id: UserId,
    req: CreateShopRequest,
) -> Result<Shop, ShopError> {
    let country = normalize_country_code(&req.country_code).ok_or(ShopError::InvalidCountry)?;
    let country_currency = country_default_currency(pool, &country)
        .await?
        .ok_or(ShopError::InvalidCountry)?;

    let currency = req
        .default_currency
        .as_deref()
        .map(|c| c.trim().to_ascii_uppercase())
        .unwrap_or_else(|| country_currency.clone());

    if !currency_exists(pool, &currency).await? {
        return Err(ShopError::InvalidCurrency);
    }
    // Phase 2 rule: shop currency must match country default (simple, predictable).
    if currency != country_currency {
        return Err(ShopError::InvalidCurrency);
    }

    let slug = req.slug.trim().to_ascii_lowercase();
    if slug.is_empty() || !slug.chars().all(|c| c.is_ascii_alphanumeric() || c == '-') {
        return Err(ShopError::SlugTaken);
    }

    let mut tx = pool.begin().await?;

    let insert_sql = sql_insert_shop();
    let shop = sqlx::query_as::<_, Shop>(&insert_sql)
    .bind(user_id)
    .bind(&slug)
    .bind(req.name.trim())
    .bind(&req.description)
    .bind(&req.logo_url)
    .bind(&req.banner_url)
    .bind(&country)
    .bind(&currency)
    .bind(&req.contact)
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| match &e {
        sqlx::Error::Database(db) if db.constraint() == Some("shops_country_slug_uidx") => {
            ShopError::SlugTaken
        }
        _ => ShopError::Db(e),
    })?;

    sqlx::query(
        "INSERT INTO shop_members (shop_id, user_id, role) VALUES ($1, $2, 'OWNER')",
    )
    .bind(shop.id)
    .bind(user_id)
    .execute(&mut *tx)
    .await?;

    sqlx::query(
        "UPDATE users SET role = 'FARMER', updated_at = NOW() WHERE id = $1 AND role = 'CUSTOMER'",
    )
    .bind(user_id)
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;
    Ok(shop)
}

pub async fn list_my_shops(pool: &PgPool, user_id: UserId) -> Result<Vec<Shop>, ShopError> {
    let q = sql_list_my_shops();
    let shops = sqlx::query_as::<_, Shop>(&q)
    .bind(user_id)
    .fetch_all(pool)
    .await?;
    Ok(shops)
}

pub async fn get_shop(pool: &PgPool, shop_id: ShopId) -> Result<Shop, ShopError> {
    let q = sql_select_shop_by_id();
    sqlx::query_as::<_, Shop>(&q)
    .bind(shop_id)
    .fetch_optional(pool)
    .await?
    .ok_or(ShopError::NotFound)
}

pub async fn update_shop(
    pool: &PgPool,
    user_id: UserId,
    shop_id: ShopId,
    req: UpdateShopRequest,
) -> Result<Shop, ShopError> {
    assert_member(pool, shop_id, user_id).await?;
    let shop = get_shop(pool, shop_id).await?;
    if shop.status != "DRAFT" {
        return Err(ShopError::NotDraft);
    }

    let q = sql_update_shop();
    let shop = sqlx::query_as::<_, Shop>(&q)
    .bind(shop_id)
    .bind(req.name.as_deref())
    .bind(req.description.as_deref())
    .bind(req.logo_url.as_deref())
    .bind(req.banner_url.as_deref())
    .bind(req.contact.as_deref())
    .fetch_one(pool)
    .await?;
    Ok(shop)
}

pub async fn publish_shop(
    pool: &PgPool,
    user_id: UserId,
    shop_id: ShopId,
) -> Result<Shop, ShopError> {
    assert_member(pool, shop_id, user_id).await?;
    let shop = get_shop(pool, shop_id).await?;
    if shop.status != "DRAFT" {
        return Err(ShopError::CannotPublish);
    }

    let country_currency = country_default_currency(pool, &shop.country_code)
        .await?
        .ok_or(ShopError::InvalidCountry)?;
    if shop.default_currency != country_currency {
        return Err(ShopError::InvalidCurrency);
    }

    let q = sql_publish_shop();
    let shop = sqlx::query_as::<_, Shop>(&q)
    .bind(shop_id)
    .fetch_one(pool)
    .await?;
    Ok(shop)
}

pub async fn list_published_by_country(
    pool: &PgPool,
    country_input: &str,
) -> Result<Vec<Shop>, ShopError> {
    let country = normalize_country_code(country_input).ok_or(ShopError::InvalidCountry)?;
    let q = sql_list_published();
    let shops = sqlx::query_as::<_, Shop>(&q)
    .bind(&country)
    .fetch_all(pool)
    .await?;
    Ok(shops)
}

pub async fn get_published_by_slug(
    pool: &PgPool,
    country_input: &str,
    slug: &str,
) -> Result<Shop, ShopError> {
    let country = normalize_country_code(country_input).ok_or(ShopError::InvalidCountry)?;
    let q = sql_get_published_slug();
    sqlx::query_as::<_, Shop>(&q)
    .bind(&country)
    .bind(slug.trim().to_ascii_lowercase())
    .fetch_optional(pool)
    .await?
    .ok_or(ShopError::NotFound)
}

pub async fn create_product(
    pool: &PgPool,
    user_id: UserId,
    shop_id: ShopId,
    req: CreateProductRequest,
) -> Result<ProductWithPrice, ShopError> {
    assert_member(pool, shop_id, user_id).await?;
    if req.amount_minor_units < 0 {
        return Err(ShopError::InvalidAmount);
    }
    let shop = get_shop(pool, shop_id).await?;
    let qty = req.quantity.unwrap_or(0).max(0);
    let label = req
        .variant_label
        .unwrap_or_else(|| "Default".to_string());

    let mut tx = pool.begin().await?;

    let product = sqlx::query_as::<_, Product>(
        r#"
        INSERT INTO products (shop_id, sku, name, description, status)
        VALUES ($1, $2, $3, $4, 'DRAFT')
        RETURNING id, shop_id, sku, name, description, status, created_at, updated_at
        "#,
    )
    .bind(shop_id)
    .bind(req.sku.trim())
    .bind(req.name.trim())
    .bind(&req.description)
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| match &e {
        sqlx::Error::Database(db) if db.constraint() == Some("products_shop_sku_uidx") => {
            ShopError::SkuTaken
        }
        _ => ShopError::Db(e),
    })?;

    let variant = sqlx::query_as::<_, ProductVariant>(
        r#"
        INSERT INTO product_variants (product_id, label, amount_minor_units, currency)
        VALUES ($1, $2, $3, $4)
        RETURNING id, product_id, label, amount_minor_units, currency, created_at, updated_at
        "#,
    )
    .bind(product.id)
    .bind(&label)
    .bind(req.amount_minor_units)
    .bind(&shop.default_currency)
    .fetch_one(&mut *tx)
    .await?;

    sqlx::query(
        "INSERT INTO inventory (variant_id, quantity) VALUES ($1, $2)",
    )
    .bind(variant.id)
    .bind(qty)
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(ProductWithPrice {
        product,
        amount_minor_units: variant.amount_minor_units,
        currency: variant.currency,
        variant_id: variant.id,
        quantity: qty,
        display: None,
    })
}

pub async fn update_product(
    pool: &PgPool,
    user_id: UserId,
    product_id: ProductId,
    req: UpdateProductRequest,
) -> Result<ProductWithPrice, ShopError> {
    let product = sqlx::query_as::<_, Product>(
        "SELECT id, shop_id, sku, name, description, status, created_at, updated_at FROM products WHERE id = $1",
    )
    .bind(product_id)
    .fetch_optional(pool)
    .await?
    .ok_or(ShopError::ProductNotFound)?;

    assert_member(pool, product.shop_id, user_id).await?;

    if let Some(amount) = req.amount_minor_units {
        if amount < 0 {
            return Err(ShopError::InvalidAmount);
        }
    }

    let mut tx = pool.begin().await?;

    let product = sqlx::query_as::<_, Product>(
        r#"
        UPDATE products SET
            name = COALESCE($2, name),
            description = COALESCE($3, description),
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, shop_id, sku, name, description, status, created_at, updated_at
        "#,
    )
    .bind(product_id)
    .bind(req.name.as_deref())
    .bind(req.description.as_deref())
    .fetch_one(&mut *tx)
    .await?;

    let variant = sqlx::query_as::<_, ProductVariant>(
        r#"
        SELECT id, product_id, label, amount_minor_units, currency, created_at, updated_at
        FROM product_variants
        WHERE product_id = $1
        ORDER BY created_at
        LIMIT 1
        "#,
    )
    .bind(product_id)
    .fetch_optional(&mut *tx)
    .await?
    .ok_or(ShopError::ProductNotFound)?;

    let variant = if let Some(amount) = req.amount_minor_units {
        sqlx::query_as::<_, ProductVariant>(
            r#"
            UPDATE product_variants
            SET amount_minor_units = $2, updated_at = NOW()
            WHERE id = $1
            RETURNING id, product_id, label, amount_minor_units, currency, created_at, updated_at
            "#,
        )
        .bind(variant.id)
        .bind(amount)
        .fetch_one(&mut *tx)
        .await?
    } else {
        variant
    };

    let quantity = if let Some(q) = req.quantity {
        let q = q.max(0);
        sqlx::query_scalar::<_, i32>(
            r#"
            INSERT INTO inventory (variant_id, quantity, updated_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (variant_id) DO UPDATE SET quantity = $2, updated_at = NOW()
            RETURNING quantity
            "#,
        )
        .bind(variant.id)
        .bind(q)
        .fetch_one(&mut *tx)
        .await?
    } else {
        sqlx::query_scalar::<_, i32>("SELECT quantity FROM inventory WHERE variant_id = $1")
            .bind(variant.id)
            .fetch_optional(&mut *tx)
            .await?
            .unwrap_or(0)
    };

    tx.commit().await?;

    Ok(ProductWithPrice {
        product,
        amount_minor_units: variant.amount_minor_units,
        currency: variant.currency,
        variant_id: variant.id,
        quantity,
        display: None,
    })
}

async fn set_product_status(
    pool: &PgPool,
    user_id: UserId,
    product_id: ProductId,
    status: &str,
) -> Result<ProductWithPrice, ShopError> {
    let product = sqlx::query_as::<_, Product>(
        "SELECT id, shop_id, sku, name, description, status, created_at, updated_at FROM products WHERE id = $1",
    )
    .bind(product_id)
    .fetch_optional(pool)
    .await?
    .ok_or(ShopError::ProductNotFound)?;
    assert_member(pool, product.shop_id, user_id).await?;

    let product = sqlx::query_as::<_, Product>(
        r#"
        UPDATE products SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING id, shop_id, sku, name, description, status, created_at, updated_at
        "#,
    )
    .bind(product_id)
    .bind(status)
    .fetch_one(pool)
    .await?;

    load_product_price(pool, product, None).await
}

pub async fn publish_product(
    pool: &PgPool,
    user_id: UserId,
    product_id: ProductId,
) -> Result<ProductWithPrice, ShopError> {
    set_product_status(pool, user_id, product_id, "PUBLISHED").await
}

pub async fn archive_product(
    pool: &PgPool,
    user_id: UserId,
    product_id: ProductId,
) -> Result<ProductWithPrice, ShopError> {
    set_product_status(pool, user_id, product_id, "ARCHIVED").await
}

async fn load_product_price(
    pool: &PgPool,
    product: Product,
    display_currency: Option<&str>,
) -> Result<ProductWithPrice, ShopError> {
    let variant = sqlx::query_as::<_, ProductVariant>(
        r#"
        SELECT id, product_id, label, amount_minor_units, currency, created_at, updated_at
        FROM product_variants
        WHERE product_id = $1
        ORDER BY created_at
        LIMIT 1
        "#,
    )
    .bind(product.id)
    .fetch_optional(pool)
    .await?
    .ok_or(ShopError::ProductNotFound)?;

    let quantity = sqlx::query_scalar::<_, i32>(
        "SELECT quantity FROM inventory WHERE variant_id = $1",
    )
    .bind(variant.id)
    .fetch_optional(pool)
    .await?
    .unwrap_or(0);

    let display = if let Some(dc) = display_currency {
        let dc = dc.to_ascii_uppercase();
        if dc != variant.currency {
            convert_display(pool, variant.amount_minor_units, &variant.currency, &dc).await?
        } else {
            None
        }
    } else {
        None
    };

    Ok(ProductWithPrice {
        product,
        amount_minor_units: variant.amount_minor_units,
        currency: variant.currency,
        variant_id: variant.id,
        quantity,
        display,
    })
}

/// Approximate display conversion using latest exchange_rates row.
/// Stored price is never mutated. Returns None if no rate is available.
async fn convert_display(
    pool: &PgPool,
    amount: i64,
    from: &str,
    to: &str,
) -> Result<Option<DisplayMoney>, sqlx::Error> {
    let row = sqlx::query_as::<_, (i64, i64)>(
        r#"
        SELECT rate_numerator, rate_denominator
        FROM exchange_rates
        WHERE base_currency = $1 AND quote_currency = $2
        ORDER BY as_of DESC
        LIMIT 1
        "#,
    )
    .bind(from)
    .bind(to)
    .fetch_optional(pool)
    .await?;

    let Some((num, den)) = row else {
        return Ok(None);
    };
    if den == 0 {
        return Ok(None);
    }
    // amount_quote ≈ amount_base * num / den
    let converted = (amount as i128 * num as i128) / den as i128;
    Ok(Some(DisplayMoney {
        amount_minor_units: converted as i64,
        currency: to.to_string(),
        approximate: true,
    }))
}

pub async fn list_shop_products_public(
    pool: &PgPool,
    country_input: &str,
    slug: &str,
    display_currency: Option<&str>,
) -> Result<(Shop, Vec<ProductWithPrice>), ShopError> {
    let shop = get_published_by_slug(pool, country_input, slug).await?;
    let products = sqlx::query_as::<_, Product>(
        r#"
        SELECT id, shop_id, sku, name, description, status, created_at, updated_at
        FROM products
        WHERE shop_id = $1 AND status = 'PUBLISHED'
        ORDER BY name
        "#,
    )
    .bind(shop.id)
    .fetch_all(pool)
    .await?;

    let mut out = Vec::with_capacity(products.len());
    for p in products {
        out.push(load_product_price(pool, p, display_currency).await?);
    }
    Ok((shop, out))
}

pub async fn list_my_shop_products(
    pool: &PgPool,
    user_id: UserId,
    shop_id: ShopId,
) -> Result<Vec<ProductWithPrice>, ShopError> {
    assert_member(pool, shop_id, user_id).await?;
    let products = sqlx::query_as::<_, Product>(
        r#"
        SELECT id, shop_id, sku, name, description, status, created_at, updated_at
        FROM products
        WHERE shop_id = $1
        ORDER BY created_at DESC
        "#,
    )
    .bind(shop_id)
    .fetch_all(pool)
    .await?;

    let mut out = Vec::with_capacity(products.len());
    for p in products {
        out.push(load_product_price(pool, p, None).await?);
    }
    Ok(out)
}

#[cfg(test)]
mod tests {
    use kisaan_common::normalize_country_code;

    #[test]
    fn slug_country_normalize() {
        assert_eq!(normalize_country_code("uk").unwrap(), "GB");
    }
}
