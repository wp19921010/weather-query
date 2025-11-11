# Vercel 一键部署指南

本指南将帮助您快速部署 Weather API 到 Vercel。

## 前置准备

### 1. 环境要求
- Node.js 18+
- npm 或 yarn
- Vercel CLI（可选，但推荐）
- GitHub 账户（推荐使用 Git 部署）

### 2. 获取必要的密钥

#### OpenWeather API Key
1. 访问 https://openweathermap.org/api
2. 注册免费账户
3. 生成 API Key
4. 保存 API Key，部署时需要用到

---

## 部署方式

### 方式 1: 通过 GitHub（推荐 - 最简单）

#### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit: Weather API ready for Vercel"

# 推送到 GitHub
git remote add origin https://github.com/YOUR_USERNAME/weather-api.git
git branch -M main
git push -u origin main
```

#### 步骤 2: 连接 Vercel 和 GitHub

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择您的 GitHub 账户和仓库
4. 点击 "Import"

#### 步骤 3: 配置环境变量

Vercel 将自动打开项目配置页面：

1. 在 "Environment Variables" 部分，添加：
   - **Key**: `WEATHER_API_KEY`
   - **Value**: 您的 OpenWeather API Key

2. 点击 "Deploy"

✅ 完成！您的 API 现在已经在 Vercel 上运行！

---

### 方式 2: 使用 Vercel CLI（适合本地开发者）

#### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2: 登录 Vercel

```bash
vercel login
```

按照提示登录您的 Vercel 账户。

#### 步骤 3: 本地预览

```bash
# 在项目根目录运行
vercel dev
```

应用将在 http://localhost:3000 运行，您可以测试 API。

#### 步骤 4: 部署到 Vercel

```bash
# 首次部署
vercel --prod

# 系统会提示配置选项
# 选择 "n"（不创建新项目，除非是第一次）
```

#### 步骤 5: 设置环境变量

部署后，访问 Vercel 控制台：

1. 打开您的项目: https://vercel.com/dashboard
2. 选择您的项目名称
3. 进入 "Settings" → "Environment Variables"
4. 添加 `WEATHER_API_KEY`
5. 点击保存
6. 重新部署（"Deployments" → 点击最新部署 → "Redeploy"）

---

## 后续部署（更新代码）

### 使用 GitHub（自动部署）

```bash
# 本地提交并推送
git add .
git commit -m "Update: Your changes here"
git push origin main
```

Vercel 将自动检测到 GitHub 的更新，并自动重新部署。

### 使用 CLI（手动部署）

```bash
vercel --prod
```

---

## 验证部署

### 1. 查看部署 URL

部署完成后，您会获得一个公开 URL，例如：
```
https://weather-api-xxx.vercel.app
```

### 2. 测试 API

```bash
# 测试默认城市
curl https://weather-api-xxx.vercel.app/weather/default

# 测试指定城市
curl https://weather-api-xxx.vercel.app/weather/beijing

# 查看所有可用端点
curl https://weather-api-xxx.vercel.app/health
```

### 3. 查看日志

在 Vercel 控制台：
1. 选择项目
2. 点击 "Deployments"
3. 选择最近的部署
4. 查看 "Function Logs" 标签

---

## 常见问题排查

### ❌ 部署失败 - "Build failed"

**原因**: 通常是依赖安装或构建问题

**解决方案**:
```bash
# 清除本地构建产物
rm -rf dist node_modules
rm package-lock.json

# 重新安装
npm install

# 本地测试构建
npm run build

# 重新部署
vercel --prod
```

### ❌ API 返回 500 错误

**原因**: 环境变量未设置或 API Key 无效

**解决方案**:
1. 验证 `WEATHER_API_KEY` 已在 Vercel 环境变量中设置
2. 检查 API Key 是否有效
3. 在 Vercel 控制台重新部署

### ❌ "WEATHER_API_KEY is not defined"

**原因**: 环境变量未正确传入

**解决方案**:
```bash
# 在 Vercel 控制台检查：
# Settings → Environment Variables → 确保 WEATHER_API_KEY 已添加
# 然后重新部署
vercel --prod
```

### ❌ CORS 错误

这个项目已启用 CORS，应该可以从任何域访问。如果仍有问题：

1. 检查浏览器控制台的完整错误信息
2. 访问 Vercel 项目的 Logs 查看服务器日志

---

## 配置说明

### vercel.json

这个文件定义了如何在 Vercel 上构建和部署您的应用：

- **builds**: 定义哪些文件需要构建以及如何构建
- **routes**: 定义请求如何路由到您的应用
- **env**: 设置生产环境变量默认值

### .vercelignore

这个文件指定在部署时应该忽略哪些文件，以减少部署包大小。

### api/index.ts

这是 Vercel Serverless Functions 的入口点，它导出一个处理 HTTP 请求的函数。

---

## 性能优化建议

### 1. 缓存 API 响应

在 `src/weather.service.ts` 中已有基本实现，考虑添加更多缓存：

```typescript
// 缓存时间：10 分钟
const CACHE_DURATION = 600000;

private cache = new Map<string, { data: any; timestamp: number }>();

async getCurrentWeather(city: string) {
  const cached = this.cache.get(city);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // 获取新数据...
}
```

### 2. 使用 Vercel 的 Redis

Vercel 提供了 KV Store 服务（需要付费）：

```typescript
import { kv } from '@vercel/kv';

const cached = await kv.get(`weather:${city}`);
```

### 3. 监控性能

在 Vercel 控制台的 "Analytics" 标签查看：
- 响应时间
- 错误率
- 流量统计

---

## 生产环境最佳实践

### 1. 监控错误

```bash
# 定期检查日志
curl https://vercel.com/api/deployments/YOUR_PROJECT_ID/logs
```

### 2. 设置告警

在 Vercel 控制台：
- Settings → Alerts
- 添加邮件通知规则

### 3. 版本控制

使用 Git tags 标记重要版本：

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 4. 定期备份

虽然 Vercel 不存储数据，但要备份：
- 代码（使用 GitHub）
- 配置（环境变量的记录）
- 日志（定期导出）

---

## 获取帮助

- **Vercel 文档**: https://vercel.com/docs
- **NestJS 文档**: https://docs.nestjs.com
- **项目问题**: 检查 GitHub Issues
- **部署问题**: https://vercel.com/support

---

## 下一步

部署完成后，您可以：

1. **配置自定义域名**
   - 在 Vercel 控制台添加自定义域
   - 配置 DNS 记录

2. **设置 API 文档**
   - 访问 `https://your-domain/api` 查看 API 文档

3. **监控性能**
   - 使用 Vercel Analytics
   - 设置错误告警

4. **自动化部署**
   - Vercel 已自动配置 GitHub 集成
   - 每次 `git push` 都会自动部署

---

**祝贺！🎉 您的 Weather API 已成功部署到 Vercel！**
