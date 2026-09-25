# syntax=docker/dockerfile:1
FROM rust:1.85-bookworm AS builder
WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
COPY crates ./crates
COPY apps/api ./apps/api
COPY migrations ./migrations
RUN cargo build --release -p kisaan-api

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates libssl3 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/kisaan-api /usr/local/bin/kisaan-api
ENV API_BIND=0.0.0.0:8081
EXPOSE 8081
CMD ["kisaan-api"]
