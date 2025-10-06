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
DOCKER_REGISTRY=${5:-"docker.workstation.co.uk"}
DOCKER_IMAGE_NAME=${6:-"kisaan-nextjs"}
DOCKER_IMAGE_TAG=${7:-"latest"}

echo "DOCKER_USER: $DOCKER_USER"
echo "DOCKER_REGISTRY: $DOCKER_REGISTRY"
echo "DOCKER_IMAGE_NAME: $DOCKER_IMAGE_NAME"
echo "$ENV_FILE_CONTENT_BASE64" | base64 -d > kisaan-next/.env

echo "Environment reference: $ENV_REF"

echo "build -f kisaan-next/Dockerfile.${ENV_REF} --build-arg TAG=$DOCKER_IMAGE_TAG -t ${ENV_REF}-$DOCKER_IMAGE_NAME . --no-cache"
docker build -f kisaan-next/Dockerfile.${ENV_REF} --build-arg TAG=$DOCKER_IMAGE_TAG -t ${ENV_REF}-$DOCKER_IMAGE_NAME . --no-cache
echo "docker tag ${ENV_REF}-$DOCKER_IMAGE_NAME $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG"
docker tag ${ENV_REF}-$DOCKER_IMAGE_NAME $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG

echo $DOCKER_PASSWD | docker login -u $DOCKER_USER --password-stdin $DOCKER_REGISTRY

echo "docker push $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG"
exit 0
docker push $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG
# docker tag ${ENV_REF}-kisaan-nextjs bwalia/kisaan-nextjs:latest --- IGNORE ---
#         docker push bwalia/kisaan-nextjs:latest --- IGNORE ---
echo "Docker image pushed successfully to $DOCKER_REGISTRY docker registry"

sleep 10
echo "Starting docker container to verify the image..."
docker run -d -p 30000:3000 $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG
            sleep 60 # Give some time for the server to start
            curl -I http://localhost:30000
echo "Docker container started successfully"
