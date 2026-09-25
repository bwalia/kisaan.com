use crate::AppState;
use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Json, Response},
    routing::{get, post},
    Router,
};
use kisaan_countries::list_active;
use kisaan_db::health_check;
use kisaan_users::{login, register, LoginRequest, RegisterRequest, UserError};
use serde_json::{json, Value};
use std::sync::Arc;

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/readyz", get(readyz))
        .route("/openapi.json", get(openapi))
        .route("/api/v1/countries", get(countries))
        .route("/api/v1/auth/register", post(auth_register))
        .route("/api/v1/auth/login", post(auth_login))
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
        Ok(list) => (StatusCode::OK, Json(json!({ "data": list }))).into_response(),
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

fn user_error_response(e: UserError) -> Response {
    let (status, msg) = match &e {
        UserError::EmailTaken => (StatusCode::CONFLICT, e.to_string()),
        UserError::InvalidCredentials => (StatusCode::UNAUTHORIZED, e.to_string()),
        _ => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    };
    (status, Json(json!({ "error": msg }))).into_response()
}

async fn openapi() -> Json<Value> {
    Json(json!({
        "openapi": "3.0.3",
        "info": {
            "title": "Kisaan API",
            "version": "0.1.0",
            "description": "Phase 1 foundation — farmer-first grocery marketplace"
        },
        "paths": {
            "/healthz": { "get": { "summary": "Liveness" } },
            "/readyz": { "get": { "summary": "Readiness (Postgres)" } },
            "/api/v1/countries": { "get": { "summary": "List active countries" } },
            "/api/v1/auth/register": { "post": { "summary": "Register customer" } },
            "/api/v1/auth/login": { "post": { "summary": "Login" } }
        }
    }))
}
