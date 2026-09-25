mod routes;

use anyhow::Result;
use axum::Router;
use kisaan_db::{connect, migrate};
use sqlx::PgPool;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub jwt_secret: String,
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
            "kisaan_api=debug,tower_http=info,sqlx=warn".into()
        }))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://kisaan:kisaan@localhost:5432/kisaan".into());
    let jwt_secret =
        std::env::var("JWT_SECRET").unwrap_or_else(|_| "dev-only-change-me".into());
    let bind = std::env::var("API_BIND").unwrap_or_else(|_| "0.0.0.0:8081".into());

    let pool = connect(&database_url).await?;
    migrate(&pool).await?;

    let state = Arc::new(AppState { pool, jwt_secret });

    let app = Router::new()
        .merge(routes::router())
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let addr: SocketAddr = bind.parse()?;
    tracing::info!("kisaan-api listening on {addr}");
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;
    Ok(())
}
