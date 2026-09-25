//! Auth helpers: Argon2 password hashing and JWT access tokens.

use argon2::password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use argon2::Argon2;
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use kisaan_common::UserId;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AuthError {
    #[error("password hash failed")]
    HashFailed,
    #[error("invalid password")]
    InvalidPassword,
    #[error("invalid token")]
    InvalidToken,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: UserId,
    pub email: String,
    pub exp: i64,
    pub iat: i64,
}

pub fn hash_password(password: &str) -> Result<String, AuthError> {
    let salt = SaltString::generate(&mut argon2::password_hash::rand_core::OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|h| h.to_string())
        .map_err(|_| AuthError::HashFailed)
}

pub fn verify_password(password: &str, password_hash: &str) -> Result<(), AuthError> {
    let parsed = PasswordHash::new(password_hash).map_err(|_| AuthError::InvalidPassword)?;
    Argon2::default()
        .verify_password(password.as_bytes(), &parsed)
        .map_err(|_| AuthError::InvalidPassword)
}

pub fn issue_token(
    user_id: UserId,
    email: &str,
    secret: &str,
    ttl_hours: i64,
) -> Result<String, AuthError> {
    let now = Utc::now();
    let claims = Claims {
        sub: user_id,
        email: email.to_string(),
        iat: now.timestamp(),
        exp: (now + Duration::hours(ttl_hours)).timestamp(),
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|_| AuthError::InvalidToken)
}

pub fn decode_token(token: &str, secret: &str) -> Result<Claims, AuthError> {
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map(|d| d.claims)
    .map_err(|_| AuthError::InvalidToken)
}

#[cfg(test)]
mod tests {
    use super::*;
    use uuid::Uuid;

    #[test]
    fn hash_and_verify() {
        let h = hash_password("secret123").unwrap();
        verify_password("secret123", &h).unwrap();
        assert!(verify_password("wrong", &h).is_err());
    }

    #[test]
    fn jwt_roundtrip() {
        let id = Uuid::new_v4();
        let t = issue_token(id, "a@b.com", "test-secret-key", 1).unwrap();
        let c = decode_token(&t, "test-secret-key").unwrap();
        assert_eq!(c.sub, id);
        assert_eq!(c.email, "a@b.com");
    }
}
