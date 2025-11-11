# Vercel 部署配置总结

本文档总结了为该项目添加的所有 Vercel 部署相关的配置。

## 📝 新增文件

### 1. **vercel.json** - Vercel 部署配置
```json
{
  "version": 2,
  "env": {"NODE_ENV": "production"},
  "builds": [...],
  "routes": [...]
}
```
- 定义如何在 Vercel 上构建和部署应用
- 配置 API 路由和环境变量
- **位置**: 项目根目录

### 2. **.vercelignore** - 部署忽略文件清单
排除以下文件不参与部署，减少构建时间和部署包大小：
- `node_modules`, `src/`, `test/` 等源代码
- 配置文件和文档

### 3. **api/index.ts** - Vercel Serverless 函数入口
```typescript
export default async (req, res) => {
  // 处理所有 HTTP 请求
}
```
- 这是 Vercel 将请求路由到的入口点
- 自动初始化 NestJS 应用并处理请求

### 4. **VERCEL_DEPLOYMENT.md** - 详细部署指南
包含：
- 两种部署方式的完整步骤（GitHub + CLI）
- 环境变量配置说明
- 常见问题及解决方案
- 性能优化建议
- 生产环境最佳实践

### 5. **VERCEL_QUICKSTART.md** - 快速开始指南
快速上手版本：
- 3 步完成部署
- 两种部署方式对比
- 立即测试的命令

### 6. **deploy-vercel.sh** - 自动化部署脚本
一个 Bash 脚本，自动化：
- 检查依赖（Node.js, npm）
- 安装项目依赖
- 构建项目
- 提示后续步骤

## 🔧 修改的文件

### 1. **package.json**
添加了新的脚本命令：
```json
{
  "scripts": {
    "vercel-build": "npm run build"
  }
}
```

### 2. **src/main.ts**
增强了应用兼容性：
- 添加 CORS 支持
- 支持 Vercel 环境变量
- 为 Serverless 环境导出应用实例

## 🚀 部署流程

```
GitHub/本地代码
    ↓
git push / vercel --prod
    ↓
Vercel 检测变更
    ↓
执行构建步骤:
  1. npm install（安装依赖）
  2. npm run build（编译 TypeScript）
    ↓
创建 Serverless Functions
    ↓
部署到全球 CDN
    ↓
获得公开 URL
    ↓
应用上线运行！
```

## 📊 部署配置详解

### vercel.json 配置说明

```json
{
  "version": 2,              // Vercel v2 API
  "env": {                   // 生产环境默认变量
    "NODE_ENV": "production"
  },
  "builds": [
    {
      "src": "api/**/*.ts",           // 构建 api 目录下的所有 TS 文件
      "use": "@vercel/node",          // 使用 Node.js 构建器
      "config": {
        "maxDuration": 60             // 函数执行超时时间（秒）
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",                 // 匹配所有路由
      "dest": "api/index.ts"          // 转发到 api/index.ts
    }
  ]
}
```

### api/index.ts 工作原理

1. 接收 Vercel 的 HTTP 请求
2. 创建/重用 NestJS 应用实例
3. 将请求传递给 NestJS 处理
4. 返回响应给 Vercel
5. 保持应用实例以供下一请求重用（性能优化）

## 🔐 环境变量管理

### 需要的环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `WEATHER_API_KEY` | OpenWeather API Key（必需）| `abc123def456...` |
| `NODE_ENV` | 环境（已预设）| `production` |
| `PORT` | 端口（可选，默认 3000）| `3000` |

### 如何设置（Vercel 控制台）

1. 登录 https://vercel.com/dashboard
2. 选择您的项目
3. Settings → Environment Variables
4. 添加 `WEATHER_API_KEY`
5. 保存并重新部署

## ✅ 验证部署

部署成功的标志：

```bash
# 测试 API 可访问性
curl https://your-project.vercel.app/weather/default

# 预期返回 JSON 响应
{
  "city": "default city",
  "temperature": 20.5,
  ...
}
```

## 🔄 持续部署（CI/CD）

### 使用 GitHub（自动）

无需额外配置，Vercel 已自动：
- 监听 GitHub 仓库更新
- 检测新 commits
- 自动构建和部署
- 为每个 PR 创建预览环境

### 部署流程

```bash
# 本地开发
git checkout -b feature/new-feature
# 做一些修改
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# GitHub 上创建 PR
# ↓ Vercel 自动为这个 PR 创建预览环境
# 测试通过后 merge 到 main
# ↓ Vercel 自动部署到生产环境
```

## 📈 监控和日志

### 在 Vercel 控制台查看

1. **Deployments** - 查看部署历史
2. **Function Logs** - 查看应用日志
3. **Analytics** - 查看性能指标
4. **Alerts** - 设置错误通知

## 🎯 后续步骤

部署完成后，可以考虑：

1. **添加自定义域名**
   - 在 Vercel 控制台配置
   - 更新 DNS 记录

2. **启用 SSL/HTTPS**
   - Vercel 自动配置（included）

3. **设置告警**
   - 在 Vercel 控制台配置错误通知

4. **优化性能**
   - 添加响应缓存
   - 考虑使用 Vercel KV（Redis）

5. **配置备份**
   - 定期备份 GitHub 仓库
   - 保存环境变量列表

## 🆘 故障排除快速链接

- **构建失败？** → 查看 `VERCEL_DEPLOYMENT.md` 的 "❌ 部署失败" 部分
- **API 返回错误？** → 检查 "❌ API 返回 500 错误" 部分
- **环境变量问题？** → 查看 "❌ WEATHER_API_KEY is not defined" 部分

## 📚 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [NestJS 官方文档](https://docs.nestjs.com)
- [项目 API 文档](./API_DOCS.md)
- [完整部署指南](./VERCEL_DEPLOYMENT.md)
- [项目总结](./PROJECT_SUMMARY.md)

---

**部署配置完成！** 现在您的项目已准备好部署到 Vercel。

下一步：[查看快速开始指南](./VERCEL_QUICKSTART.md) 或 [详细部署指南](./VERCEL_DEPLOYMENT.md)
