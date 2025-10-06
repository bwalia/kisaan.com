#!/bin/bash

# This bash script automates the process of build docker image and pushing it to nexus docker registry.

# set -x

# Validate input parameter

if [ -z "$1" ]; then
    echo "Error: Missing base64 encoded environment file content as first parameter"
    echo "Usage: $0 <base64_encoded_env_file_content>"
    exit 1
else
    ENV_FILE_CONTENT_BASE64="$1"
    # Validate base64 content
    if ! echo "$ENV_FILE_CONTENT_BASE64" | base64 -d > /dev/null 2>&1; then
        echo "Error: Invalid base64 content provided"
        exit 1
    fi
fi

if [ -z "$2" ]; then
    echo "Error: Environment reference (like prod, dev) as second parameter is required"
    exit 1
else
    ENV_REF="$2"
fi

DOCKER_USER=${3:-"admin"}
DOCKER_PASSWD=${4:-"docker-registry-passwd"}
DOCKER_REPO_NAME=${5:-"bwalia"}
DOCKER_REGISTRY=${6:-"docker.workstation.co.uk"}
DOCKER_IMAGE_NAME=${7:-"kisaan-cicd-test"}
DOCKER_IMAGE_TAG=${8:-"latest"}

echo "DOCKER_USER: $DOCKER_USER"
echo "DOCKER_REGISTRY: $DOCKER_REGISTRY"
echo "DOCKER_IMAGE_NAME: $DOCKER_IMAGE_NAME"
echo "DOCKER_IMAGE_TAG: $DOCKER_IMAGE_TAG"
echo "$ENV_FILE_CONTENT_BASE64" | base64 -d > nextjs/.env

echo "Environment reference: $ENV_REF"

echo "build -f nextjs/Dockerfile.${ENV_REF} --build-arg TAG=$DOCKER_IMAGE_TAG -t ${ENV_REF}-$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG . --no-cache"
docker build -f nextjs/Dockerfile.${ENV_REF} --build-arg TAG=$DOCKER_IMAGE_TAG -t ${ENV_REF}-$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG . --no-cache
echo "docker tag ${ENV_REF}-$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG $DOCKER_REGISTRY/$DOCKER_REPO_NAME/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG"
docker tag ${ENV_REF}-$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG $DOCKER_REGISTRY/$DOCKER_REPO_NAME/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG

echo $DOCKER_PASSWD | docker login -u $DOCKER_USER --password-stdin $DOCKER_REGISTRY
echo "Docker logged in successfully to $DOCKER_REGISTRY docker registry"

echo "docker push $DOCKER_REGISTRY/$DOCKER_REPO_NAME/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG"
if docker push $DOCKER_REGISTRY/$DOCKER_REPO_NAME/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG; then
    # docker tag ${ENV_REF}-kisaan-cicd-test bwalia/kisaan-cicd-test:latest --- IGNORE ---
    #         docker push bwalia/kisaan-cicd-test:latest --- IGNORE ---
    echo "Docker image pushed successfully to $DOCKER_REGISTRY docker registry"
    
    sleep 10
    echo "Starting docker container to verify the image..."
    docker container stop kisaan-cicd-test || true
    docker container rm kisaan-cicd-test || true
    docker run --name kisaan-cicd-test -d -p 30000:3000 $DOCKER_REGISTRY/$DOCKER_REPO_NAME/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG
    sleep 10 # Give some time for the server to start
    curl -I http://localhost:30000
    echo "Docker container started successfully"
else
    echo "ERROR: Failed to push Docker image to $DOCKER_REGISTRY docker registry"
    echo "Skipping container verification due to push failure"
    exit 1
fi
