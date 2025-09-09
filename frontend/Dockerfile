FROM node:18-alpine

WORKDIR /app

# 依存関係ファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバーを起動
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
