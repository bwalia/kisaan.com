//! Shared primitives: money (minor units), IDs, errors.

use serde::{Deserialize, Serialize};
use thiserror::Error;
use uuid::Uuid;

pub type UserId = Uuid;
pub type ShopId = Uuid;

/// Monetary amount in minor units (e.g. 1299 GBP = £12.99). Never use f64 for money.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct Money {
    pub amount_minor_units: i64,
    pub currency: CurrencyCode,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct CurrencyCode(pub [u8; 3]);

impl CurrencyCode {
    pub fn new(code: &str) -> Result<Self, CommonError> {
        let b = code.as_bytes();
        if b.len() != 3 || !b.iter().all(|c| c.is_ascii_uppercase()) {
            return Err(CommonError::InvalidCurrency(code.to_string()));
        }
        Ok(Self([b[0], b[1], b[2]]))
    }

    pub fn as_str(&self) -> &str {
        std::str::from_utf8(&self.0).unwrap_or("???")
    }
}

impl std::fmt::Display for CurrencyCode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.as_str())
    }
}

#[derive(Debug, Error)]
pub enum CommonError {
    #[error("invalid currency code: {0}")]
    InvalidCurrency(String),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn money_gbp() {
        let m = Money {
            amount_minor_units: 1299,
            currency: CurrencyCode::new("GBP").unwrap(),
        };
        assert_eq!(m.currency.as_str(), "GBP");
    }
}
