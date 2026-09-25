//! User repository and registration/login services.

use chrono::{DateTime, Utc};
use kisaan_auth::{hash_password, issue_token, verify_password, AuthError};
use kisaan_common::UserId;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use thiserror::Error;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: UserId,
    pub email: String,
    pub name: Option<String>,
    pub role: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Error)]
pub enum UserError {
    #[error("email already registered")]
    EmailTaken,
    #[error("invalid credentials")]
    InvalidCredentials,
    #[error(transparent)]
    Auth(#[from] AuthError),
    #[error(transparent)]
    Db(#[from] sqlx::Error),
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub name: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserPublic,
}

#[derive(Debug, Serialize)]
pub struct UserPublic {
    pub id: UserId,
    pub email: String,
    pub name: Option<String>,
    pub role: String,
}

impl From<User> for UserPublic {
    fn from(u: User) -> Self {
        Self {
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
        }
    }
}

pub async fn register(
    pool: &PgPool,
    req: RegisterRequest,
    jwt_secret: &str,
) -> Result<AuthResponse, UserError> {
    let existing = sqlx::query_scalar::<_, Uuid>("SELECT id FROM users WHERE email = $1")
        .bind(&req.email)
        .fetch_optional(pool)
        .await?;
    if existing.is_some() {
        return Err(UserError::EmailTaken);
    }

    let id = Uuid::new_v4();
    let password_hash = hash_password(&req.password)?;
    let user = sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users (id, email, name, role, password_hash)
        VALUES ($1, $2, $3, 'CUSTOMER', $4)
        RETURNING id, email, name, role, password_hash, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(&req.email)
    .bind(&req.name)
    .bind(&password_hash)
    .fetch_one(pool)
    .await?;

    let token = issue_token(user.id, &user.email, jwt_secret, 24)?;
    Ok(AuthResponse {
        token,
        user: user.into(),
    })
}

pub async fn login(
    pool: &PgPool,
    req: LoginRequest,
    jwt_secret: &str,
) -> Result<AuthResponse, UserError> {
    let user = sqlx::query_as::<_, User>(
        r#"
        SELECT id, email, name, role, password_hash, created_at, updated_at
        FROM users WHERE email = $1
        "#,
    )
    .bind(&req.email)
    .fetch_optional(pool)
    .await?
    .ok_or(UserError::InvalidCredentials)?;

    verify_password(&req.password, &user.password_hash)
        .map_err(|_| UserError::InvalidCredentials)?;

    let token = issue_token(user.id, &user.email, jwt_secret, 24)?;
    Ok(AuthResponse {
        token,
        user: user.into(),
    })
}
