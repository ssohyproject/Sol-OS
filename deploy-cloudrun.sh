#!/usr/bin/env bash
# ==============================================================================
# SolOS Google Cloud Run 1-Click Deployment Script
# Automatically builds, deploys, and outputs the live HTTPS production URL
# ==============================================================================

set -e

# Default Settings
DEFAULT_REGION="asia-northeast3" # Seoul Region
SERVICE_NAME="soloos-erp"

echo "================================================================="
echo "🚀 SolOS Google Cloud Run 배포 시작"
echo "================================================================="

# 1. Check gcloud CLI
if ! command -v gcloud &> /dev/null; then
    if [ -f "$HOME/google-cloud-sdk/bin/gcloud" ]; then
        export PATH="$HOME/google-cloud-sdk/bin:$PATH"
    else
        echo "❌ Google Cloud SDK (gcloud)가 설치되어 있지 않습니다."
        echo "   https://cloud.google.com/sdk/docs/install 에서 설치해 주세요."
        exit 1
    fi
fi

# 2. Get or set Project ID
ACTIVE_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
PROJECT_ID=${1:-$ACTIVE_PROJECT}

if [ -z "$PROJECT_ID" ]; then
    read -p "Google Cloud 프로젝트 ID를 입력하세요: " PROJECT_ID
fi

if [ -z "$PROJECT_ID" ]; then
    echo "❌ 유효한 Google Cloud 프로젝트 ID가 필요합니다."
    exit 1
fi

echo "📌 대상 프로젝트: $PROJECT_ID"
echo "📌 배포 리전: $DEFAULT_REGION (서울)"
echo "📌 서비스명: $SERVICE_NAME"
echo "-----------------------------------------------------------------"

# 3. Set Project
gcloud config set project "$PROJECT_ID"

# 4. Enable Google Cloud APIs
echo "⚙️ Google Cloud Run 및 Cloud Build API 활성화 확인 중..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com --project="$PROJECT_ID" || true

# 5. Deploy to Cloud Run using source code buildpack/Dockerfile
echo "📦 컨테이너 빌드 및 Cloud Run 자동 배포 진행 중..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$DEFAULT_REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --concurrency 80 \
  --set-env-vars "NODE_ENV=production,HOST=0.0.0.0,APP_NAME=SolOS ERP,FIREBASE_PROJECT_ID=$PROJECT_ID"

# 6. Retrieve Live URL
LIVE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$DEFAULT_REGION" --format 'value(status.url)' 2>/dev/null || echo "")

echo "================================================================="
echo "🎉 Cloud Run 배포 완료!"
echo "🌐 공식 라이브 URL: $LIVE_URL"
echo "================================================================="
