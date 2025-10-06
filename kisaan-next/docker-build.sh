#!/bin/bash

# Docker Build Script for Kisaan Next.js Project (without buildx)
# This script builds Docker images for different environments

set -e

# Default values
DEFAULT_TAG="latest"
DEFAULT_REGISTRY="docker.io"
DEFAULT_REPO="bwalia"
DEFAULT_IMAGE="kisaan-next"

# Help function
show_help() {
    cat << EOF
Usage: $0 [OPTIONS] ENVIRONMENT

Build Docker images for different environments

ENVIRONMENTS:
    dev         Build development image
    test        Build test image  
    acc         Build acceptance image
    prod        Build production image

OPTIONS:
    -t, --tag TAG       Image tag (default: $DEFAULT_TAG)
    -r, --registry REG  Docker registry (default: $DEFAULT_REGISTRY)
    -n, --repo REPO     Repository name (default: $DEFAULT_REPO)
    -i, --image IMAGE   Image name (default: $DEFAULT_IMAGE)
    -p, --push          Push images after building
    --no-cache          Build without cache
    -h, --help          Show this help message

EXAMPLES:
    # Build test image
    $0 test

    # Build and push production image with custom tag
    $0 --tag v1.2.3 --push prod

    # Build for custom registry
    $0 --registry my-registry.com --repo myorg prod

    # Build without cache
    $0 --no-cache test

EOF
}

# Parse command line arguments
TAG="$DEFAULT_TAG"
REGISTRY="$DEFAULT_REGISTRY"
REPO="$DEFAULT_REPO"
IMAGE="$DEFAULT_IMAGE"
PUSH_FLAG=""
NO_CACHE_FLAG=""
ENV=""

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
            PUSH_FLAG="true"
            shift
            ;;
        --no-cache)
            NO_CACHE_FLAG="--no-cache"
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
            if [[ -z "$ENV" ]]; then
                ENV="$1"
            else
                echo "Multiple environments specified."
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate environment
if [[ -z "$ENV" ]]; then
    echo "Error: No environment specified"
    show_help
    exit 1
fi

# Validate environment exists
VALID_ENVS=("dev" "test" "acc" "prod")
if [[ ! " ${VALID_ENVS[@]} " =~ " ${ENV} " ]]; then
    echo "Error: Invalid environment '$ENV'"
    echo "Valid environments: ${VALID_ENVS[*]}"
    exit 1
fi

# Check if Dockerfile exists
DOCKERFILE="Dockerfile.${ENV}"
if [[ ! -f "$DOCKERFILE" ]]; then
    echo "Error: Dockerfile '$DOCKERFILE' not found"
    exit 1
fi

# Navigate to correct directory (we should be in kisaan-next)
if [[ ! -f "package.json" ]]; then
    echo "Error: package.json not found. Run this script from the kisaan-next directory."
    exit 1
fi

# Build configuration
IMAGE_TAG="${REPO}/${IMAGE}:${ENV}-${TAG}"
LATEST_TAG="${REPO}/${IMAGE}:${ENV}-latest"

echo "Building Docker image with the following configuration:"
echo "  Environment: $ENV"
echo "  Dockerfile: $DOCKERFILE"
echo "  Tag: $TAG"
echo "  Registry: $REGISTRY"
echo "  Repository: $REPO"
echo "  Image: $IMAGE"
echo "  Full Image Tag: $IMAGE_TAG"
echo "  Push: ${PUSH_FLAG:-"false"}"
echo ""

# Build command
BUILD_CMD="docker build"
BUILD_CMD="$BUILD_CMD -f $DOCKERFILE"
BUILD_CMD="$BUILD_CMD --build-arg TAG=$TAG"
BUILD_CMD="$BUILD_CMD -t $IMAGE_TAG"
BUILD_CMD="$BUILD_CMD -t $LATEST_TAG"

# Add registry tags if we're pushing
if [[ -n "$PUSH_FLAG" && "$REGISTRY" != "docker.io" ]]; then
    REGISTRY_TAG="${REGISTRY}/${REPO}/${IMAGE}:${ENV}-${TAG}"
    REGISTRY_LATEST="${REGISTRY}/${REPO}/${IMAGE}:${ENV}-latest"
    BUILD_CMD="$BUILD_CMD -t $REGISTRY_TAG"
    BUILD_CMD="$BUILD_CMD -t $REGISTRY_LATEST"
fi

# Add no-cache flag if specified
if [[ -n "$NO_CACHE_FLAG" ]]; then
    BUILD_CMD="$BUILD_CMD $NO_CACHE_FLAG"
fi

# Set context to parent directory (same as bake config)
BUILD_CMD="$BUILD_CMD .."

echo "Executing: $BUILD_CMD"
echo ""

# Execute the build
eval $BUILD_CMD

if [[ $? -eq 0 ]]; then
    echo ""
    echo "✅ Build completed successfully!"
    
    # Push if requested
    if [[ -n "$PUSH_FLAG" ]]; then
        echo ""
        echo "Pushing images to registry..."
        
        if [[ "$REGISTRY" != "docker.io" ]]; then
            # Push to custom registry
            docker push "$REGISTRY_TAG"
            docker push "$REGISTRY_LATEST"
        else
            # Push to Docker Hub
            docker push "$IMAGE_TAG"
            docker push "$LATEST_TAG"
        fi
        
        if [[ $? -eq 0 ]]; then
            echo "✅ Images pushed successfully!"
        else
            echo "❌ Failed to push images"
            exit 1
        fi
    fi
    
    # Show built images
    echo ""
    echo "Built images:"
    docker images | grep "$REPO/$IMAGE" | grep "$ENV" | head -5
else
    echo "❌ Build failed"
    exit 1
fi