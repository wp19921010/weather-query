# 天气查询 API - NestJS 后端项目

## 项目简介

这是一个使用 **NestJS** 和 **TypeScript** 构建的天气查询后端 API 项目。通过集成 OpenWeatherMap 天气 API，提供实时天气数据查询功能。

## 技术栈

- **NestJS** - 现代化的 Node.js 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Axios** - HTTP 客户端库
- **dotenv** - 环境变量管理
- **OpenWeatherMap API** - 天气数据来源

## 项目结构

```
src/
├── app.module.ts              # 主应用模块
├── app.controller.ts          # 主控制器
├── app.service.ts             # 主服务
├── main.ts                    # 应用入口
└── weather/                   # 天气模块
    ├── weather.module.ts      # 天气模块定义
    ├── weather.controller.ts  # 天气 API 路由
    └── weather.service.ts     # 天气业务逻辑
```

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 文件并填入你的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 获取免费的 API Key: https://openweathermap.org/api
WEATHER_API_KEY=your_openweathermap_api_key_here
PORT=3000
NODE_ENV=development
```

### 3. 获取 OpenWeatherMap API Key

1. 访问 [OpenWeatherMap 官网](https://openweathermap.org/api)
2. 注册免费账户
3. 获取 API Key
4. 将 Key 填入 `.env` 文件中的 `WEATHER_API_KEY`

## 运行项目

### 开发环境（带热重载）

```bash
npm run start:dev
```

### 生产环境

```bash
# 构建项目
npm run build

# 运行编译后的项目
npm run start:prod
```

### 标准启动

```bash
npm start
```

服务器默认运行在 `http://localhost:3000`

## API 端点

### 1. 按城市名查询天气

**请求:**

```bash
GET /weather/city?name=北京
```

**响应示例:**

```json
{
  "city": "北京",
  "temperature": 5.2,
  "description": "晴",
  "humidity": 45,
  "windSpeed": 3.5,
  "pressure": 1013
}
```

### 2. 按坐标查询天气

**请求:**

```bash
GET /weather/coordinates?lat=39.9042&lon=116.4074
```

**参数说明:**
- `lat`: 纬度（必填）
- `lon`: 经度（必填）

**响应示例:**

```json
{
  "city": "北京",
  "temperature": 5.2,
  "description": "晴",
  "humidity": 45,
  "windSpeed": 3.5,
  "pressure": 1013
}
```

### 3. 获取默认城市天气

**请求:**

```bash
GET /weather/default
```

返回北京的实时天气数据

## 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| city | string | 城市名称 |
| temperature | number | 温度（摄氏度） |
| description | string | 天气描述（中文） |
| humidity | number | 湿度（%） |
| windSpeed | number | 风速（m/s） |
| pressure | number | 气压（hPa） |

## 使用示例

### cURL

```bash
# 查询北京天气
curl "http://localhost:3000/weather/city?name=北京"

# 按坐标查询
curl "http://localhost:3000/weather/coordinates?lat=39.9042&lon=116.4074"

# 查询默认天气
curl "http://localhost:3000/weather/default"
```

### JavaScript/TypeScript

```typescript
const response = await fetch('http://localhost:3000/weather/city?name=北京');
const data = await response.json();
console.log(data);
```

### Python

```python
import requests

url = 'http://localhost:3000/weather/city'
params = {'name': '北京'}
response = requests.get(url, params=params)
print(response.json())
```

## 脚本命令

| 命令 | 说明 |
|------|------|
| `npm start` | 启动应用 |
| `npm run start:dev` | 开发模式（带热重载） |
| `npm run start:debug` | 调试模式 |
| `npm run start:prod` | 生产模式 |
| `npm run build` | 构建项目 |
| `npm run lint` | 代码检查与自动修复 |
| `npm run format` | 代码格式化 |
| `npm test` | 单元测试 |
| `npm run test:watch` | 测试监控模式 |
| `npm run test:cov` | 测试覆盖率报告 |
| `npm run test:e2e` | 端到端测试 |

## 项目特点

✅ **类型安全** - 完整的 TypeScript 支持
✅ **模块化架构** - 清晰的功能模块划分
✅ **环境配置** - 灵活的环境变量管理
✅ **实时数据** - 调用 OpenWeatherMap 获取实时天气
✅ **多查询方式** - 支持城市名和坐标查询
✅ **错误处理** - 完善的异常处理机制

## 扩展建议

- [ ] 添加缓存机制（Redis）以减少 API 调用
- [ ] 实现数据库存储用户查询历史
- [ ] 添加天气预报功能
- [ ] 实现更详细的错误处理和日志记录
- [ ] 添加 API 请求限流
- [ ] 支持多语言响应
- [ ] 添加数据验证中间件

## 常见问题

**Q: API Key 无效怎么办？**
A: 确保你在 [OpenWeatherMap](https://openweathermap.org/api) 注册了账户并获取了 API Key，需要等待几分钟激活。

**Q: 跨域请求失败？**
A: 可以在 `main.ts` 中启用 CORS：
```typescript
app.enableCors();
```

**Q: 如何修改服务器端口？**
A: 在 `.env` 文件中修改 `PORT` 变量或直接在命令行指定：
```bash
PORT=5000 npm start
```

## 许可证

MIT

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。
