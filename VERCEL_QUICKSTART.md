# ⚡ Vercel 快速部署 - 3 步完成

这是部署该项目到 Vercel 的最简单方式。

## 🚀 方式 1: GitHub 自动部署（最简单 ✨）

### 步骤 1️⃣: 推送代码到 GitHub

```bash
# 如果还没有初始化 Git
git init
git add .
git commit -m "Weather API - Ready for Vercel deployment"

# 推送到 GitHub（需要先创建 GitHub 仓库）
git push -u origin main
```

### 步骤 2️⃣: 连接 Vercel

1. 打开 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 连接您的 GitHub 账户
4. 选择 `weather-api` 仓库
5. 点击 "Import"

### 步骤 3️⃣: 添加环境变量

在 Vercel 部署页面：

1. 找到 "Environment Variables" 部分
2. 添加新变量：
   ```
   Key:   WEATHER_API_KEY
   Value: your_api_key_from_openweathermap
   ```
3. 点击 "Deploy" 按钮

✅ **完成！** 您的 API 现在已上线！

---

## 🚀 方式 2: CLI 部署（开发者喜欢 💻）

### 步骤 1️⃣: 安装 Vercel CLI

```bash
npm install -g vercel
```

### 步骤 2️⃣: 登录

```bash
vercel login
```

### 步骤 3️⃣: 部署

```bash
vercel --prod
```

按照提示填写信息，然后在 Vercel 控制台添加 `WEATHER_API_KEY` 环境变量。

---

## 📝 获取 OpenWeather API Key

如果您还没有 API Key：

1. 访问 https://openweathermap.org/api
2. 点击 "Sign Up" 注册免费账户
3. 验证邮箱
4. 登录后进入 "API Keys" 页面
5. 复制您的 API Key

该 API Key 是免费的，可以进行每分钟 60 次请求。

---

## ✨ 部署后

部署完成后，您会获得一个 URL，例如：
```
https://weather-api-xyz123.vercel.app
```

### 立即测试 API

```bash
# 用您的实际 URL 替换 YOUR_URL
curl https://YOUR_URL/weather/default

# 测试其他城市
curl "https://YOUR_URL/weather?city=beijing"
```

### 查看完整文档

- 📖 详细指南: 查看 `VERCEL_DEPLOYMENT.md`
- 🔧 API 文档: 查看 `API_DOCS.md`
- ❓ 常见问题: 在 `VERCEL_DEPLOYMENT.md` 中查找故障排除

---

## 🔄 后续更新

部署完成后，更新代码非常简单：

### 使用 GitHub（推荐）

```bash
git add .
git commit -m "Update: your changes"
git push
```

Vercel 将自动检测更改并重新部署！

### 使用 CLI

```bash
vercel --prod
```

---

## 🎯 就这样！

您已经成功部署了 Weather API 到 Vercel。现在它可以处理来自世界各地的请求。

有任何问题？检查 `VERCEL_DEPLOYMENT.md` 中的故障排除部分。

---

**需要更多功能？**
- 查看 `START_HERE.md` 了解项目结构
- 查看 `PROJECT_SUMMARY.md` 了解所有功能
- 查看 `API_DOCS.md` 了解 API 端点
