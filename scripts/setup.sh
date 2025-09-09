#!/bin/bash

echo "🚀 KIS Demo セットアップスクリプト"
echo "=================================="

# 環境変数ファイルをコピー
if [ ! -f .env ]; then
    echo "📋 環境変数ファイルを作成しています..."
    cp env.example .env
    echo "✅ .env ファイルが作成されました"
else
    echo "ℹ️  .env ファイルは既に存在します"
fi

# ルートの依存関係をインストール
echo "📦 ルートの依存関係をインストールしています..."
npm install

# フロントエンドの依存関係をインストール
echo "📦 フロントエンドの依存関係をインストールしています..."
cd frontend
npm install
cd ..

# バックエンドの依存関係をインストール
echo "📦 バックエンドの依存関係をインストールしています..."
cd backend
npm install
cd ..

# データベースの初期化とシードデータの投入
echo "🗄️  データベースを初期化しています..."
cd backend
npm run db:seed
cd ..

echo ""
echo "🎉 セットアップが完了しました！"
echo ""
echo "📋 次の手順で起動してください："
echo "1. npm run dev      - 開発サーバーを起動"
echo "2. http://localhost:5173 にアクセス"
echo ""
echo "🔑 デモ用アカウント："
echo "管理者: admin / admin123"
echo "ユーザー: user / user123"
echo ""
echo "🐳 Dockerを使用する場合："
echo "docker-compose up"
