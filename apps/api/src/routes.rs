use crate::AppState;
use axum::{
    extract::{FromRequestParts, Path, Query, State},
    http::{header::AUTHORIZATION, request::Parts, StatusCode},
    response::{IntoResponse, Json, Response},
    routing::{get, patch, post},
    Router,
};
use kisaan_auth::{decode_token, Claims};
use kisaan_common::country_to_market_key;
use kisaan_countries::list_active;
use kisaan_db::health_check;
use kisaan_shops::{
    archive_product, create_product, create_shop, get_published_by_slug, list_my_shop_products,
    list_my_shops, list_published_by_country, list_shop_products_public, publish_product,
    publish_shop, update_product, update_shop, CreateProductRequest, CreateShopRequest, ShopError,
    UpdateProductRequest, UpdateShopRequest,
};
use kisaan_users::{login, register, LoginRequest, RegisterRequest, UserError};
use serde::Deserialize;
use serde_json::{json, Value};
use std::sync::Arc;
use uuid::Uuid;

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/readyz", get(readyz))
        .route("/openapi.json", get(openapi))
        .route("/api/v1/countries", get(countries))
        .route("/api/v1/auth/register", post(auth_register))
        .route("/api/v1/auth/login", post(auth_login))
        // Authenticated seller shops
        .route("/api/v1/shops", post(shops_create))
        .route("/api/v1/shops/me", get(shops_me))
        .route("/api/v1/shops/{id}", patch(shops_update))
        .route("/api/v1/shops/{id}/publish", post(shops_publish))
        .route("/api/v1/shops/{id}/products", post(shops_create_product).get(shops_list_my_products))
        .route("/api/v1/products/{id}", patch(products_update))
        .route("/api/v1/products/{id}/publish", post(products_publish))
        .route("/api/v1/products/{id}/archive", post(products_archive))
        // Public discovery
        .route("/api/v1/countries/{code}/shops", get(country_shops))
        .route("/api/v1/shops/{country}/{slug}", get(public_shop))
        .route(
            "/api/v1/shops/{country}/{slug}/products",
            get(public_shop_products),
        )
}

struct AuthUser(Claims);

impl FromRequestParts<Arc<AppState>> for AuthUser {
    type Rejection = Response;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &Arc<AppState>,
    ) -> Result<Self, Self::Rejection> {
        let header = parts
            .headers
            .get(AUTHORIZATION)
            .and_then(|v| v.to_str().ok())
            .ok_or_else(|| {
                (
                    StatusCode::UNAUTHORIZED,
                    Json(json!({ "error": "missing authorization" })),
                )
                    .into_response()
            })?;

        let token = header
            .strip_prefix("Bearer ")
            .ok_or_else(|| {
                (
                    StatusCode::UNAUTHORIZED,
                    Json(json!({ "error": "invalid authorization scheme" })),
                )
                    .into_response()
            })?;

        let claims = decode_token(token, &state.jwt_secret).map_err(|_| {
            (
                StatusCode::UNAUTHORIZED,
                Json(json!({ "error": "invalid token" })),
            )
                .into_response()
        })?;

        Ok(AuthUser(claims))
    }
}

async fn healthz() -> Json<Value> {
    Json(json!({ "status": "ok", "service": "kisaan-api" }))
}

async fn readyz(State(state): State<Arc<AppState>>) -> Response {
    match health_check(&state.pool).await {
        Ok(()) => (StatusCode::OK, Json(json!({ "status": "ready" }))).into_response(),
        Err(e) => (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(json!({ "status": "not_ready", "error": e.to_string() })),
        )
            .into_response(),
    }
}

async fn countries(State(state): State<Arc<AppState>>) -> Response {
    match list_active(&state.pool).await {
        Ok(list) => {
            let data: Vec<Value> = list
                .into_iter()
                .map(|c| {
                    json!({
                        "code": c.code,
                        "market": country_to_market_key(&c.code),
                        "name": c.name,
                        "default_currency": c.default_currency,
                        "default_locale": c.default_locale,
                        "measurement_system": c.measurement_system,
                        "is_active": c.is_active,
                    })
                })
                .collect();
            (StatusCode::OK, Json(json!({ "data": data }))).into_response()
        }
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e.to_string() })),
        )
            .into_response(),
    }
}

async fn auth_register(
    State(state): State<Arc<AppState>>,
    Json(body): Json<RegisterRequest>,
) -> Response {
    match register(&state.pool, body, &state.jwt_secret).await {
        Ok(res) => (StatusCode::CREATED, Json(res)).into_response(),
        Err(e) => user_error_response(e),
    }
}

async fn auth_login(
    State(state): State<Arc<AppState>>,
    Json(body): Json<LoginRequest>,
) -> Response {
    match login(&state.pool, body, &state.jwt_secret).await {
        Ok(res) => (StatusCode::OK, Json(res)).into_response(),
        Err(e) => user_error_response(e),
    }
}

async fn shops_create(
    State(state): State<Arc<AppState>>,
    AuthUser(claims): AuthUser,
    Json(body): Json<CreateShopRequest>,
) -> Response {
    match create_shop(&state.pool, claims.sub, body).await {
        Ok(shop) => (StatusCode::CREATED, Json(json!({ "data": shop }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn shops_me(
    State(state): State<Arc<AppState>>,
    AuthUser(claims): AuthUser,
) -> Response {
    match list_my_shops(&state.pool, claims.sub).await {
        Ok(shops) => (StatusCode::OK, Json(json!({ "data": shops }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn shops_update(
    State(state): State<Arc<AppState>>,
    AuthUser(claims): AuthUser,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateShopRequest>,
) -> Response {
    match update_shop(&state.pool, claims.sub, id, body).await {
        Ok(shop) => (StatusCode::OK, Json(json!({ "data": shop }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn shops_publish(
    State(state): State<Arc<AppState>>,
    AuthUser(claims): AuthUser,
    Path(id): Path<Uuid>,
) -> Response {
    match publish_shop(&state.pool, claims.sub, id).await {
        Ok(shop) => (StatusCode::OK, Json(json!({ "data": shop }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn shops_create_product(
    State(state): State<Arc<AppState>>,
    AuthUser(claims): AuthUser,
    Path(id): Path<Uuid>,
    Json(body): Json<CreateProductRequest>,
) -> Response {
    match create_product(&state.pool, claims.sub, id, body).await {
        Ok(product) => (StatusCode::CREATED, Json(json!({ "data": product }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn shops_list_my_products(
    State(state): State<Arc<AppState>>,
    AuthUser(claims): AuthUser,
    Path(id): Path<Uuid>,
) -> Response {
    match list_my_shop_products(&state.pool, claims.sub, id).await {
        Ok(products) => (StatusCode::OK, Json(json!({ "data": products }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn products_update(
    State(state): State<Arc<AppState>>,
    AuthUser(claims): AuthUser,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateProductRequest>,
) -> Response {
    match update_product(&state.pool, claims.sub, id, body).await {
        Ok(product) => (StatusCode::OK, Json(json!({ "data": product }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn products_publish(
    State(state): State<Arc<AppState>>,
    AuthUser(claims): AuthUser,
    Path(id): Path<Uuid>,
) -> Response {
    match publish_product(&state.pool, claims.sub, id).await {
        Ok(product) => (StatusCode::OK, Json(json!({ "data": product }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn products_archive(
    State(state): State<Arc<AppState>>,
    AuthUser(claims): AuthUser,
    Path(id): Path<Uuid>,
) -> Response {
    match archive_product(&state.pool, claims.sub, id).await {
        Ok(product) => (StatusCode::OK, Json(json!({ "data": product }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn country_shops(
    State(state): State<Arc<AppState>>,
    Path(code): Path<String>,
) -> Response {
    match list_published_by_country(&state.pool, &code).await {
        Ok(shops) => (StatusCode::OK, Json(json!({ "data": shops }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

async fn public_shop(
    State(state): State<Arc<AppState>>,
    Path((country, slug)): Path<(String, String)>,
) -> Response {
    match get_published_by_slug(&state.pool, &country, &slug).await {
        Ok(shop) => (StatusCode::OK, Json(json!({ "data": shop }))).into_response(),
        Err(e) => shop_error_response(e),
    }
}

#[derive(Debug, Deserialize)]
struct DisplayCurrencyQuery {
    display_currency: Option<String>,
}

async fn public_shop_products(
    State(state): State<Arc<AppState>>,
    Path((country, slug)): Path<(String, String)>,
    Query(q): Query<DisplayCurrencyQuery>,
) -> Response {
    match list_shop_products_public(
        &state.pool,
        &country,
        &slug,
        q.display_currency.as_deref(),
    )
    .await
    {
        Ok((shop, products)) => (
            StatusCode::OK,
            Json(json!({ "data": { "shop": shop, "products": products } })),
        )
            .into_response(),
        Err(e) => shop_error_response(e),
    }
}

fn user_error_response(e: UserError) -> Response {
    let (status, msg) = match &e {
        UserError::EmailTaken => (StatusCode::CONFLICT, e.to_string()),
        UserError::InvalidCredentials => (StatusCode::UNAUTHORIZED, e.to_string()),
        _ => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    };
    (status, Json(json!({ "error": msg }))).into_response()
}

fn shop_error_response(e: ShopError) -> Response {
    let (status, msg) = match &e {
        ShopError::NotFound | ShopError::ProductNotFound => (StatusCode::NOT_FOUND, e.to_string()),
        ShopError::Forbidden => (StatusCode::FORBIDDEN, e.to_string()),
        ShopError::SlugTaken | ShopError::SkuTaken => (StatusCode::CONFLICT, e.to_string()),
        ShopError::InvalidCountry
        | ShopError::InvalidCurrency
        | ShopError::InvalidAmount
        | ShopError::NotDraft
        | ShopError::CannotPublish => (StatusCode::BAD_REQUEST, e.to_string()),
        ShopError::Db(_) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    };
    (status, Json(json!({ "error": msg }))).into_response()
}

async fn openapi() -> Json<Value> {
    Json(json!({
        "openapi": "3.0.3",
        "info": {
            "title": "Kisaan API",
            "version": "0.2.0",
            "description": "Phase 2 — multi-country multi-currency seller sub-shops"
        },
        "paths": {
            "/healthz": { "get": { "summary": "Liveness" } },
            "/readyz": { "get": { "summary": "Readiness (Postgres)" } },
            "/api/v1/countries": { "get": { "summary": "List active countries" } },
            "/api/v1/auth/register": { "post": { "summary": "Register" } },
            "/api/v1/auth/login": { "post": { "summary": "Login" } },
            "/api/v1/shops": { "post": { "summary": "Create sub-shop" } },
            "/api/v1/shops/me": { "get": { "summary": "List my shops" } },
            "/api/v1/shops/{id}": { "patch": { "summary": "Update draft shop" } },
            "/api/v1/shops/{id}/publish": { "post": { "summary": "Publish shop" } },
            "/api/v1/shops/{id}/products": {
                "post": { "summary": "Create product" },
                "get": { "summary": "List my shop products" }
            },
            "/api/v1/products/{id}": { "patch": { "summary": "Update product" } },
            "/api/v1/products/{id}/publish": { "post": { "summary": "Publish product" } },
            "/api/v1/products/{id}/archive": { "post": { "summary": "Archive product" } },
            "/api/v1/countries/{code}/shops": { "get": { "summary": "Published shops in country" } },
            "/api/v1/shops/{country}/{slug}": { "get": { "summary": "Public shop" } },
            "/api/v1/shops/{country}/{slug}/products": { "get": { "summary": "Public catalogue" } }
        }
    }))
}
