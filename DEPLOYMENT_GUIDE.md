# 🚀 云服务器部署指南

完整的天气 API 部署解决方案，支持多个云平台。

---

## 📋 目录

1. [通用部署准备](#通用部署准备)
2. [方案 1: Docker 部署（推荐）](#方案-1-docker-部署推荐)
3. [方案 2: Heroku 部署](#方案-2-heroku-部署)
4. [方案 3: Vercel 部署](#方案-3-vercel-部署)
5. [方案 4: AWS 部署](#方案-4-aws-部署)
6. [方案 5: 腾讯云/阿里云 部署](#方案-5-腾讯云阿里云-部署)
7. [监控和维护](#监控和维护)

---

## 通用部署准备

### 前置要求

1. **获取 API Key**
   - 访问 https://openweathermap.org/api
   - 注册并获取免费 API Key
   - **重要**: API Key 不要提交到 GitHub！

2. **准备环境变量**
   ```bash
   WEATHER_API_KEY=your_api_key_here
   PORT=3000
   NODE_ENV=production
   ```

3. **Git 仓库**（如果使用 Git 部署）
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

---

## 方案 1: Docker 部署（推荐）

最灵活和独立的部署方式。支持所有服务器。

### 1.1 本地测试（Docker）

**先在本地测试 Docker 镜像**:

```bash
# 构建镜像
docker build -t weather-api:latest .

# 运行容器
docker run -p 3000:3000 \
  -e WEATHER_API_KEY=your_api_key \
  -e NODE_ENV=production \
  weather-api:latest

# 测试
curl http://localhost:3000/weather/default
```

### 1.2 使用 docker-compose 启动

```bash
# 编辑 .env 文件配置 API Key
echo "WEATHER_API_KEY=your_api_key" > .env

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f weather-api

# 停止服务
docker-compose down
```

### 1.3 部署到云服务器

#### Linux 服务器部署步骤

**前置条件**: 已安装 Docker 和 Docker Compose

```bash
# 1. 登录服务器
ssh user@your_server_ip

# 2. 克隆项目
cd /opt
git clone https://github.com/your-username/weather-api.git
cd weather-api

# 3. 配置环境变量
cat > .env << EOF
WEATHER_API_KEY=your_api_key_here
NODE_ENV=production
PORT=3000
EOF

# 4. 启动服务
docker-compose up -d

# 5. 验证运行状态
docker-compose ps
docker-compose logs

# 6. 测试 API
curl http://localhost:3000/weather/default
```

#### 使用 Nginx 反向代理

**Nginx 配置** (`/etc/nginx/sites-available/weather-api`):

```nginx
upstream weather_api {
    server localhost:3000;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL 证书（使用 Let's Encrypt）
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass http://weather_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查端点
    location /health {
        access_log off;
        proxy_pass http://weather_api;
    }
}
```

启用配置:

```bash
sudo ln -s /etc/nginx/sites-available/weather-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 配置 SSL 证书（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot certonly --nginx -d api.yourdomain.com

# 自动续期（通常已默认配置）
sudo systemctl enable certbot.timer
```

#### 配置自动重启

创建 systemd 服务 (`/etc/systemd/system/weather-api.service`):

```ini
[Unit]
Description=Weather API Docker Service
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
WorkingDirectory=/opt/weather-api
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

启用服务:

```bash
sudo systemctl daemon-reload
sudo systemctl enable weather-api
sudo systemctl start weather-api
```

---

## 方案 2: Heroku 部署

快速部署到 Heroku（免费层已停用，但可以了解流程）

### 前置条件

```bash
# 安装 Heroku CLI
npm install -g heroku

# 登录
heroku login
```

### 部署步骤

```bash
# 1. 创建 Heroku 应用
heroku create your-weather-api

# 2. 设置环境变量
heroku config:set WEATHER_API_KEY=your_api_key

# 3. 推送代码
git push heroku main

# 4. 查看日志
heroku logs --tail

# 5. 打开应用
heroku open
```

### Procfile 配置

创建 `Procfile` 文件:

```
web: npm run start:prod
```

---

## 方案 3: Vercel 部署

适合 Serverless 部署（需要修改项目结构）

### 前置条件

```bash
npm i -g vercel
vercel login
```

### 部署步骤

```bash
# 推送到 GitHub
git push origin main

# 部署到 Vercel
vercel --prod

# 设置环境变量
# 在 Vercel 控制台设置 WEATHER_API_KEY
```

---

## 方案 4: AWS 部署

### 选项 A: 使用 AWS Elastic Beanstalk

```bash
# 安装 EB CLI
pip install awsebcli

# 初始化
eb init -p node.js-22 weather-api

# 部署
eb create weather-api-env
eb setenv WEATHER_API_KEY=your_api_key
eb deploy

# 查看日志
eb logs
```

### 选项 B: 使用 EC2 + Docker

1. **启动 EC2 实例**
   - 选择 Ubuntu 22.04 LTS
   - 配置安全组，开放 80、443、3000 端口

2. **安装 Docker**

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# 添加当前用户到 docker 组
sudo usermod -aG docker $USER
newgrp docker
```

3. **部署应用**
   - 按照 "Docker 部署" 章节进行

---

## 方案 5: 腾讯云/阿里云 部署

### 腾讯云（CVM + Docker）

```bash
# 1. 购买云服务器（CVM）
# 2. 连接到服务器
ssh -i /path/to/key.pem ubuntu@your_server_ip

# 3. 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 4. 按 "Docker 部署" 步骤操作
```

### 阿里云（ECS + 容器镜像服务）

```bash
# 1. 登录阿里云 Docker Registry
docker login registry.cn-shanghai.aliyuncs.com

# 2. 标记镜像
docker tag weather-api:latest \
  registry.cn-shanghai.aliyuncs.com/your-namespace/weather-api:latest

# 3. 推送镜像
docker push registry.cn-shanghai.aliyuncs.com/your-namespace/weather-api:latest

# 4. 在 ECS 上拉取并运行
docker pull registry.cn-shanghai.aliyuncs.com/your-namespace/weather-api:latest
docker run -p 3000:3000 \
  -e WEATHER_API_KEY=your_api_key \
  registry.cn-shanghai.aliyuncs.com/your-namespace/weather-api:latest
```

---

## 监控和维护

### 日志监控

```bash
# Docker Compose 日志
docker-compose logs -f weather-api

# 查看最后 100 行
docker-compose logs --tail 100

# 保存日志到文件
docker-compose logs > logs.txt
```

### 健康检查

```bash
# 检查服务状态
curl http://your_domain/health

# 定期监控脚本（cron 任务）
*/5 * * * * curl -f http://your_domain/weather/default || notify_admin
```

### 更新应用

```bash
# 拉取最新代码
git pull origin main

# 重新构建和启动
docker-compose up -d --build

# 验证新版本
docker-compose ps
```

### 数据备份

```bash
# 备份应用配置
tar -czf backup-$(date +%Y%m%d).tar.gz .env docker-compose.yml

# 定期备份脚本
0 2 * * * tar -czf /backup/weather-api-$(date +\%Y\%m\%d).tar.gz /opt/weather-api
```

---

## 性能优化

### 环境变量优化

```env
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=512
```

### Docker 优化

```bash
# 使用 Alpine 基础镜像（已在 Dockerfile 中配置）
# 结果: 约 200MB vs 900MB（使用 ubuntu 基础）

# 多阶段构建（已在 Dockerfile 中配置）
# 结果: 最终镜像不包含构建工具
```

### 缓存优化

在 `weather.service.ts` 中添加缓存:

```typescript
private cache = new Map<string, { data: WeatherData; time: number }>();

async getCurrentWeather(city: string): Promise<WeatherData> {
  const cacheKey = `weather_${city}`;
  const cached = this.cache.get(cacheKey);

  // 缓存 10 分钟
  if (cached && Date.now() - cached.time < 600000) {
    return cached.data;
  }

  const data = await this.fetchWeather(city);
  this.cache.set(cacheKey, { data, time: Date.now() });
  return data;
}
```

---

## 常见问题

### Q: 如何更换 API Key？
A: 更新 `.env` 文件并重启容器:
```bash
docker-compose down
# 编辑 .env
docker-compose up -d
```

### Q: 服务无法启动？
A: 检查日志和端口占用:
```bash
docker-compose logs
lsof -i :3000  # 检查端口占用
```

### Q: 如何自动化部署？
A: 使用 GitHub Actions、GitLab CI 或 Jenkins

### Q: 成本如何？
A:
- **Docker（自己的服务器）**: 约 ¥10-50/月
- **Heroku**: 已停用免费层
- **AWS**: $0.01-0.1/小时，看使用量
- **阿里云/腾讯云**: 约 ¥50-200/月

---

## 推荐方案

| 场景 | 推荐方案 | 优点 |
|------|---------|------|
| 学习/演示 | Docker + 个人服务器 | 完全控制，成本低 |
| 小企业 | Docker + Nginx | 稳定可靠 |
| 快速上线 | Vercel/Heroku | 无需运维 |
| 大规模 | AWS/腾讯云 | 可扩展 |

---

## 部署检查清单

- [ ] API Key 已配置到环境变量
- [ ] 代码已提交到 Git
- [ ] Dockerfile 能正常构建
- [ ] docker-compose up -d 能成功启动
- [ ] 能访问 API 端点
- [ ] SSL/HTTPS 已配置（生产环境）
- [ ] 防火墙规则已配置
- [ ] 监控和日志已启用
- [ ] 备份计划已制定
- [ ] 文档已更新

---

**开始部署**: 选择上面的一种方案，按步骤操作即可！

有问题？检查日志和错误信息。
