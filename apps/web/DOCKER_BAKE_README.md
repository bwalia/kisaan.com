# Docker Build for Kisaan Next.js

This directory contains Docker build configurations for building the Kisaan Next.js application across multiple environments.

## Files

- `docker-bake.yml` - Docker Bake configuration file (requires Docker Buildx)
- `docker-bake-build.sh` - Helper script for Docker Bake (requires Docker Buildx)
- `docker-build.sh` - Standalone Docker build script (works with standard Docker)
- `Dockerfile.*` - Environment-specific Dockerfiles

## Quick Start

### Option 1: Standalone Docker Build (Recommended for most users)

```bash
# Build test image
./docker-build.sh test

# Build and push production image
./docker-build.sh --push prod

# Build with custom tag
./docker-build.sh --tag v1.2.3 test
```

### Option 2: Docker Bake (Advanced - requires Docker Buildx)

```bash
# Build test image
./docker-bake-build.sh test

# Build and push production image
./docker-bake-build.sh --push prod

# Build all images with custom tag
./docker-bake-build.sh --tag v1.2.3 all
```

## Prerequisites

### For Standalone Docker Build
- Docker Engine

### For Docker Bake
- Docker with BuildKit enabled
- Docker Buildx plugin installed

```bash
# Install buildx if not available
docker buildx install
```

## Available Targets/Environments

### Standalone Docker Build
- `dev` - Development environment
- `test` - Test environment  
- `acc` - Acceptance environment
- `prod` - Production environment

### Docker Bake (Additional Group Targets)
- `all` - All environments
- `development` - Dev and test environments
- `production` - Acceptance and production environments
- `prod-multiplatform` - Multi-architecture production build

## Configuration Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TAG` | `latest` | Image tag |
| `REGISTRY` | `docker.io` | Docker registry |
| `REPO_NAME` | `bwalia` | Repository name |
| `IMAGE_NAME` | `nextjs` | Image name |

## Examples

### Standalone Docker Build

```bash
# Build test image
./docker-build.sh test

# Build production with custom tag
./docker-build.sh --tag v1.0.0 prod

# Build and push to custom registry
./docker-build.sh --registry my-registry.com --repo myorg --push prod

# Build without cache
./docker-build.sh --no-cache test
```

### Docker Bake (Advanced)

```bash
# Build test image
docker buildx bake test

# Build production with custom tag
TAG=v1.0.0 docker buildx bake prod

# Build for private registry
REGISTRY=my-registry.com REPO_NAME=myorg docker buildx bake --push prod

# Build multi-platform
docker buildx bake --push prod-multiplatform
```

## Comparison

| Feature | Standalone Build | Docker Bake |
|---------|------------------|-------------|
| Requirements | Docker | Docker + Buildx |
| Caching | Basic | Advanced registry cache |
| Multi-platform | No | Yes |
| Parallel builds | No | Yes |
| Configuration | Command-line args | Variables + YAML |
| CI/CD Integration | Simple | Advanced |
| Build groups | No | Yes |
| Complexity | Simple | Advanced |

## Recommended Usage

- **For local development**: Use `./docker-build.sh`
- **For CI/CD pipelines**: Use `./docker-build.sh` or upgrade to Docker Bake
- **For multi-platform**: Use Docker Bake
- **For complex build matrices**: Use Docker Bake