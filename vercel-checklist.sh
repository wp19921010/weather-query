#!/usr/bin/env bash

# Weather API - Vercel 部署检查清单
# 使用此脚本验证所有部署配置已就绪

echo "🔍 Weather API - Vercel 部署检查清单"
echo "======================================"
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌${NC} $2 (文件不存在: $1)"
        ((CHECKS_FAILED++))
    fi
}

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅${NC} $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌${NC} $2 (请安装: $1)"
        ((CHECKS_FAILED++))
    fi
}

check_env() {
    if [ ! -z "${!1}" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC} $2 (将在部署时需要: $1)"
        ((CHECKS_FAILED++))
    fi
}

echo "📋 文件检查"
echo "---------"
check_file "package.json" "package.json 存在"
check_file "tsconfig.json" "tsconfig.json 存在"
check_file "src/main.ts" "src/main.ts 存在"
check_file "vercel.json" "vercel.json 配置"
check_file ".vercelignore" ".vercelignore 配置"
check_file "api/index.ts" "API 入口点 (api/index.ts)"
check_file "VERCEL_DEPLOYMENT.md" "详细部署指南"
check_file "VERCEL_QUICKSTART.md" "快速开始指南"

echo ""
echo "🔧 环境工具检查"
echo "-----------"
check_command "node" "Node.js 已安装"
check_command "npm" "npm 已安装"

echo ""
echo "🔐 环境变量检查"
echo "----------"
check_env "WEATHER_API_KEY" "WEATHER_API_KEY 已设置"

echo ""
echo "📦 依赖检查"
echo "-------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} node_modules 存在（依赖已安装）"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠️${NC} node_modules 不存在（需要运行: npm install）"
    ((CHECKS_FAILED++))
fi

echo ""
echo "🏗️ 构建检查"
echo "------"
if [ -d "dist" ]; then
    echo -e "${GREEN}✅${NC} dist 目录存在（项目已构建）"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠️${NC} dist 目录不存在（需要运行: npm run build）"
fi

echo ""
echo "📊 总结"
echo "----"
echo -e "通过: ${GREEN}${CHECKS_PASSED}${NC} 项检查"
if [ $CHECKS_FAILED -gt 0 ]; then
    echo -e "失败: ${RED}${CHECKS_FAILED}${NC} 项检查"
fi

echo ""
echo "🚀 下一步"
echo "-----"

if ! command -v node &> /dev/null; then
    echo "1. 安装 Node.js 18+ (https://nodejs.org)"
fi

if [ ! -d "node_modules" ]; then
    echo "2. 运行: npm install"
fi

if [ ! -d "dist" ]; then
    echo "3. 运行: npm run build"
fi

if [ -z "${WEATHER_API_KEY}" ]; then
    echo "4. 获取 OpenWeather API Key: https://openweathermap.org/api"
    echo "5. 设置环境变量: export WEATHER_API_KEY=your_key"
fi

echo ""
echo "部署选项:"
echo "--------"
echo "方式 1 - GitHub (推荐):"
echo "  1. git push origin main"
echo "  2. 访问 https://vercel.com/new"
echo "  3. 导入您的 GitHub 仓库"
echo ""
echo "方式 2 - CLI:"
echo "  1. npm install -g vercel"
echo "  2. vercel login"
echo "  3. vercel --prod"
echo ""
echo "详细说明请查看: VERCEL_QUICKSTART.md"
