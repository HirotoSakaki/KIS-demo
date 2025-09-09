FROM node:18-alpine

WORKDIR /app

# 依存関係ファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# 開発サーバーを起動
EXPOSE 3001

CMD ["npm", "run", "dev"]
