#!/bin/bash

# Script to build and push Docker images to Docker Hub
# Usage: ./build-and-push.sh [your-dockerhub-username] [tag]

set -e

# Get Docker Hub username from argument or environment variable
DOCKERHUB_USERNAME=${1:-${DOCKERHUB_USERNAME:-"your-dockerhub-username"}}
IMAGE_TAG=${2:-${IMAGE_TAG:-"latest"}}

if [ "$DOCKERHUB_USERNAME" = "your-dockerhub-username" ]; then
    echo "Error: Please provide your Docker Hub username"
    echo "Usage: ./build-and-push.sh [your-dockerhub-username] [tag]"
    echo "   or: DOCKERHUB_USERNAME=your-username ./build-and-push.sh [tag]"
    exit 1
fi

IMAGE_NAME="${DOCKERHUB_USERNAME}/nhs-waitlist"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

echo "=========================================="
echo "Building Docker image for NHS Waitlist"
echo "=========================================="
echo "Docker Hub Username: ${DOCKERHUB_USERNAME}"
echo "Image Name: ${IMAGE_NAME}"
echo "Tag: ${IMAGE_TAG}"
echo "Full Image: ${FULL_IMAGE_NAME}"
echo "=========================================="
echo ""

# Build the image
echo "Step 1: Building Docker image..."
docker build -f Dockerfile.prod -t ${FULL_IMAGE_NAME} .

# Also tag as latest if not already latest
if [ "$IMAGE_TAG" != "latest" ]; then
    echo ""
    echo "Step 2: Tagging as latest..."
    docker tag ${FULL_IMAGE_NAME} ${IMAGE_NAME}:latest
fi

# Login to Docker Hub
echo ""
echo "Step 3: Logging in to Docker Hub..."
echo "Please enter your Docker Hub credentials:"
docker login

# Push the image
echo ""
echo "Step 4: Pushing image to Docker Hub..."
docker push ${FULL_IMAGE_NAME}

if [ "$IMAGE_TAG" != "latest" ]; then
    echo ""
    echo "Step 5: Pushing latest tag..."
    docker push ${IMAGE_NAME}:latest
fi

echo ""
echo "=========================================="
echo "✅ Successfully pushed image to Docker Hub!"
echo "=========================================="
echo "Image: ${FULL_IMAGE_NAME}"
echo ""
echo "To use this image on your VPS, update docker-compose.prod.yml:"
echo "  DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}"
echo "  IMAGE_TAG=${IMAGE_TAG}"
echo ""
echo "Then run: docker-compose -f docker-compose.prod.yml up -d"

