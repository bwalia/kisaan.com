#!/bin/bash

# Docker Bake Build Script for Kisaan Next.js Project
# This script provides an easier interface to docker buildx bake

set -e

# Default values
DEFAULT_TAG="latest"
DEFAULT_REGISTRY="docker.io"
DEFAULT_REPO="bwalia"
DEFAULT_IMAGE="kisaan-next"

# Help function
show_help() {
    cat << EOF
Usage: $0 [OPTIONS] TARGET

Build Docker images using docker buildx bake

TARGETS:
    dev                 Build development image
    test                Build test image  
    acc                 Build acceptance image
    prod                Build production image
    all                 Build all environment images
    development         Build dev and test images
    production          Build acc and prod images
    prod-multiplatform  Build production image for multiple platforms

OPTIONS:
    -t, --tag TAG       Image tag (default: $DEFAULT_TAG)
    -r, --registry REG  Docker registry (default: $DEFAULT_REGISTRY)
    -n, --repo REPO     Repository name (default: $DEFAULT_REPO)
    -i, --image IMAGE   Image name (default: $DEFAULT_IMAGE)
    -p, --push          Push images after building
    -h, --help          Show this help message

EXAMPLES:
    # Build test image
    $0 test

    # Build and push production image with custom tag
    $0 --tag v1.2.3 --push prod

    # Build all images for custom registry
    $0 --registry my-registry.com --repo myorg all

    # Build multi-platform production image
    $0 --push prod-multiplatform

EOF
}

# Parse command line arguments
TAG="$DEFAULT_TAG"
REGISTRY="$DEFAULT_REGISTRY"
REPO="$DEFAULT_REPO"
IMAGE="$DEFAULT_IMAGE"
PUSH_FLAG=""
TARGET=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -r|--registry)
            REGISTRY="$2"
            shift 2
            ;;
        -n|--repo)
            REPO="$2"
            shift 2
            ;;
        -i|--image)
            IMAGE="$2"
            shift 2
            ;;
        -p|--push)
            PUSH_FLAG="--push"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        -*)
            echo "Unknown option $1"
            show_help
            exit 1
            ;;
        *)
            if [[ -z "$TARGET" ]]; then
                TARGET="$1"
            else
                echo "Multiple targets specified. Use 'all' to build all targets."
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate target
if [[ -z "$TARGET" ]]; then
    echo "Error: No target specified"
    show_help
    exit 1
fi

# Validate target exists
VALID_TARGETS=("dev" "test" "acc" "prod" "all" "development" "production" "prod-multiplatform")
if [[ ! " ${VALID_TARGETS[@]} " =~ " ${TARGET} " ]]; then
    echo "Error: Invalid target '$TARGET'"
    echo "Valid targets: ${VALID_TARGETS[*]}"
    exit 1
fi

# Check if docker buildx is available
if ! docker buildx version &> /dev/null; then
    echo "Error: docker buildx is not available. Please install Docker Buildx."
    exit 1
fi

# Navigate to kisaan-next directory
cd "$(dirname "$0")"

echo "Building Docker images with the following configuration:"
echo "  Target: $TARGET"
echo "  Tag: $TAG"
echo "  Registry: $REGISTRY"
echo "  Repository: $REPO"
echo "  Image: $IMAGE"
echo "  Push: ${PUSH_FLAG:-"false"}"
echo ""

# Build command
BUILD_CMD="docker buildx bake"
BUILD_CMD="$BUILD_CMD --set *.args.TAG=$TAG"
BUILD_CMD="$BUILD_CMD --set *.platform=linux/amd64"

# Set variables
export TAG="$TAG"
export REGISTRY="$REGISTRY"
export REPO_NAME="$REPO"
export IMAGE_NAME="$IMAGE"

# Add push flag if specified
if [[ -n "$PUSH_FLAG" ]]; then
    BUILD_CMD="$BUILD_CMD $PUSH_FLAG"
fi

# Add target
BUILD_CMD="$BUILD_CMD $TARGET"

echo "Executing: $BUILD_CMD"
echo ""

# Execute the build
eval $BUILD_CMD

echo ""
echo "Build completed successfully!"

# Show built images if not pushing
if [[ -z "$PUSH_FLAG" ]]; then
    echo ""
    echo "Built images:"
    docker images | grep "$REPO/$IMAGE" | head -10
fi