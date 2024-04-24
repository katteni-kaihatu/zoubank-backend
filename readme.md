# ZouBank

Resonite向けのシンプルな銀行システム

## Userの区別

`User` 一般ユーザー  
`Bot` お金を生み出せるが、送金元は自分  
`Admin` すべてができる。他人の口座にアクセスできる。

## 起動
```bash
npm i
npx prisma migrate dev
npm run start:dev
```

```bash
# docker
docker compose up -d db redis
```

## 環境変数

DATABSE_URL=postgresql://postgres:postgres@localhost:5432/postgres
REDIS_URL=redis://localhost:6379
SESSION_SECRET=secret // なんでもいい
ADMIN_API_TOKEN=token // なんでもいい ADMINユーザのAPI　Token
APP_AUDIENCE=http://localhost:3001 // デバッグのフロントエンドのURL
