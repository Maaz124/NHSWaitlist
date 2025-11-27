# PowerShell script to build and push Docker images to Docker Hub
# Usage: .\build-and-push.ps1 [your-dockerhub-username] [tag]

param(
    [string]$DockerHubUsername = $env:DOCKERHUB_USERNAME,
    [string]$ImageTag = $env:IMAGE_TAG
)

if (-not $DockerHubUsername) {
    $DockerHubUsername = Read-Host "Enter your Docker Hub username"
}

if (-not $ImageTag) {
    $ImageTag = "latest"
}

if ($DockerHubUsername -eq "your-dockerhub-username" -or -not $DockerHubUsername) {
    Write-Host "Error: Please provide your Docker Hub username" -ForegroundColor Red
    Write-Host "Usage: .\build-and-push.ps1 [your-dockerhub-username] [tag]"
    Write-Host "   or: `$env:DOCKERHUB_USERNAME='your-username'; .\build-and-push.ps1 [tag]"
    exit 1
}

$ImageName = "${DockerHubUsername}/nhs-waitlist"
$FullImageName = "${ImageName}:${ImageTag}"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Building Docker image for NHS Waitlist" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Docker Hub Username: $DockerHubUsername"
Write-Host "Image Name: $ImageName"
Write-Host "Tag: $ImageTag"
Write-Host "Full Image: $FullImageName"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Build the image
Write-Host "Step 1: Building Docker image..." -ForegroundColor Yellow
docker build -f Dockerfile.prod -t $FullImageName .

# Also tag as latest if not already latest
if ($ImageTag -ne "latest") {
    Write-Host ""
    Write-Host "Step 2: Tagging as latest..." -ForegroundColor Yellow
    docker tag $FullImageName "${ImageName}:latest"
}

# Login to Docker Hub
Write-Host ""
Write-Host "Step 3: Logging in to Docker Hub..." -ForegroundColor Yellow
Write-Host "Please enter your Docker Hub credentials:"
docker login

# Push the image
Write-Host ""
Write-Host "Step 4: Pushing image to Docker Hub..." -ForegroundColor Yellow
docker push $FullImageName

if ($ImageTag -ne "latest") {
    Write-Host ""
    Write-Host "Step 5: Pushing latest tag..." -ForegroundColor Yellow
    docker push "${ImageName}:latest"
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ Successfully pushed image to Docker Hub!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Image: $FullImageName"
Write-Host ""
Write-Host "To use this image on your VPS, update docker-compose.prod.yml:" -ForegroundColor Cyan
Write-Host "  DOCKERHUB_USERNAME=$DockerHubUsername"
Write-Host "  IMAGE_TAG=$ImageTag"
Write-Host ""
Write-Host "Then run: docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor Cyan

