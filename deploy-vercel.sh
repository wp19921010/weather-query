#!/bin/bash

# Weather API - Vercel 一键部署脚本
# 这个脚本自动化 Vercel 部署的关键步骤

set -e

echo "🚀 Weather API - Vercel 部署助手"
echo "=================================="
echo ""

# 检查依赖
echo "📋 检查依赖..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

# 检查 API Key
if [ -z "$WEATHER_API_KEY" ]; then
    echo "❓ WEATHER_API_KEY 未在环境变量中设置"
    echo "   请从 https://openweathermap.org/api 获取 API Key"
    echo ""
    read -p "请输入您的 OpenWeather API Key: " WEATHER_API_KEY
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查 Vercel CLI
echo "🔍 检查 Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm install -g vercel
fi

# 初始化 Git（如果需要）
if [ ! -d .git ]; then
    echo "📝 初始化 Git..."
    git init
    git add .
    git commit -m "Initial commit: Weather API ready for Vercel"
fi

echo ""
echo "✅ 准备完成！"
echo ""
echo "接下来的步骤："
echo ""
echo "选项 1: 使用 Vercel CLI（手动部署）"
echo "------"
echo "  1. 运行: vercel login"
echo "  2. 运行: vercel --prod"
echo "  3. 在 Vercel 控制台设置 WEATHER_API_KEY 环境变量"
echo ""
echo "选项 2: 使用 GitHub + Vercel（自动部署，推荐）"
echo "------"
echo "  1. 推送到 GitHub: git push origin main"
echo "  2. 访问: https://vercel.com/new"
echo "  3. 导入您的 GitHub 仓库"
echo "  4. 在 Vercel 控制台设置 WEATHER_API_KEY 环境变量"
echo "  5. 部署完成！"
echo ""
echo "更多信息请查看 VERCEL_DEPLOYMENT.md"
