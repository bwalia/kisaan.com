//! Country configuration repository.

use serde::Serialize;
use sqlx::PgPool;

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
pub struct Country {
    pub code: String,
    pub name: String,
    pub default_currency: String,
    pub default_locale: String,
    pub measurement_system: String,
    pub is_active: bool,
}

pub async fn list_active(pool: &PgPool) -> Result<Vec<Country>, sqlx::Error> {
    sqlx::query_as::<_, Country>(
        r#"
        SELECT code, name, default_currency, default_locale, measurement_system, is_active
        FROM countries
        WHERE is_active = true
        ORDER BY name
        "#,
    )
    .fetch_all(pool)
    .await
}
