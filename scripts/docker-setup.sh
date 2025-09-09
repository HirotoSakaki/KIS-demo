#!/bin/bash

echo "🐳 企業環境向け Docker セットアップ"
echo "=================================="

# Colima の状態確認
if ! command -v colima &> /dev/null; then
    echo "❌ Colima がインストールされていません"
    echo "📦 以下のコマンドでインストールしてください:"
    echo "brew install colima docker docker-compose"
    exit 1
fi

# Colima の起動状態確認
if ! colima status &> /dev/null; then
    echo "🚀 Colima を起動しています..."
    colima start --cpu 2 --memory 4 --disk 10
else
    echo "✅ Colima は既に起動しています"
fi

# Docker の動作確認
echo "🔍 Docker の動作確認..."
if docker info &> /dev/null; then
    echo "✅ Docker が正常に動作しています"
    docker --version
    docker-compose --version
else
    echo "❌ Docker が正常に動作していません"
    echo "🔧 以下を試してください:./scripts/docker-setup.sh"
    echo "1. colima restart"
    echo "2. eval \$(colima nerdctl install)"
    exit 1
fi

# package-lock.json の確認と生成
echo "📦 依存関係ファイルを確認中..."
if [ ! -f "backend/package-lock.json" ]; then
    echo "📋 backend/package-lock.json を生成中..."
    cd backend && npm install && cd ..
fi

if [ ! -f "frontend/package-lock.json" ]; then
    echo "📋 frontend/package-lock.json を生成中..."
    cd frontend && npm install && cd ..
fi

# 軽量版 docker-compose で起動
echo "🚀 軽量版 Docker Compose で起動します..."
if [ -f "docker-compose.lite.yml" ]; then
    docker-compose -f docker-compose.lite.yml up --build
else
    echo "❌ docker-compose.lite.yml が見つかりません"
    echo "📋 通常版で起動します..."
    docker-compose up --build
fi
