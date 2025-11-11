# 快速开始指南

## 5 分钟快速上手

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 配置 API Key

1. 访问 [https://openweathermap.org/api](https://openweathermap.org/api)
2. 注册免费账户并获取 API Key
3. 创建 `.env` 文件：

```bash
cp .env.example .env
```

4. 编辑 `.env` 文件，将 `your_openweathermap_api_key_here` 替换为你的 API Key

### 步骤 3: 启动服务器

```bash
npm run start:dev
```

你应该看到类似的输出：
```
[Nest] 12345 11/11 10:00 PM     LOG [NestFactory] Starting Nest application...
Weather API server running on http://localhost:3000
```

### 步骤 4: 测试 API

打开浏览器或使用 cURL 测试：

```bash
# 查询北京天气
curl "http://localhost:3000/weather/city?name=北京"

# 查询上海天气
curl "http://localhost:3000/weather/city?name=上海"

# 按坐标查询
curl "http://localhost:3000/weather/coordinates?lat=39.9042&lon=116.4074"
```

## 常用命令速查

```bash
# 开发模式（带热重载）
npm run start:dev

# 生产模式
npm run build
npm run start:prod

# 代码检查
npm run lint

# 代码格式化
npm run format

# 运行测试
npm test
```

## 项目文件说明

| 文件/目录 | 说明 |
|-----------|------|
| `src/` | 源代码目录 |
| `src/weather/` | 天气模块 |
| `dist/` | 编译输出目录 |
| `.env` | 环境变量配置（需自己创建） |
| `.env.example` | 环境变量模板 |
| `package.json` | 项目依赖配置 |
| `tsconfig.json` | TypeScript 配置 |
| `nest-cli.json` | NestJS CLI 配置 |

## 下一步

- 查看 [API_DOCS.md](./API_DOCS.md) 了解详细的 API 文档
- 学习 NestJS 官方文档：https://docs.nestjs.com
- 探索 OpenWeatherMap API：https://openweathermap.org/api

## 遇到问题？

1. 确保 API Key 配置正确
2. 检查网络连接
3. 查看服务器日志输出
4. 参考 API_DOCS.md 中的常见问题部分

祝你使用愉快！🚀
