```markdown
# Spotify OAuth Backend API

Vercel 后端 API，用于处理 Spotify OAuth 认证。

## 环境变量

需要在 Vercel 中配置：
- `SPOTIFY_CLIENT_ID`: f9332b04a836440c844fce31d1bff045
- `SPOTIFY_CLIENT_SECRET`: 你的 Client Secret

## API 端点

- `GET /api/spotify-auth-url` - 获取授权 URL
- `POST /api/spotify-auth` - 交换授权码获取 token
- `GET /api/spotify-callback` - OAuth 回调处理

## 部署

1. 推送到 GitHub
2. 在 Vercel 中导入仓库
3. 配置环境变量
4. 自动部署
```
