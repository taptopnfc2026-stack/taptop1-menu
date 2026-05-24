#!/bin/bash
set -e

echo "================================="
echo " Cloudflare Worker 一键部署"
echo "================================="
echo ""

cd "$(dirname "$0")"

# 1. 安装 wrangler（如果没装）
if ! command -v npx &> /dev/null; then
  echo "❌ 未找到 Node.js，请先安装: https://nodejs.org"
  exit 1
fi

# 2. 输入 OpenAI Key
echo "📝 请输入你的 OpenAI API Key (sk-proj-...):"
read -s OPENAI_KEY
echo ""

if [ -z "$OPENAI_KEY" ]; then
  echo "❌ Key 不能为空"
  exit 1
fi

# 3. 设置 Secret
echo "🔐 正在设置 API Key..."
echo "$OPENAI_KEY" | npx wrangler secret put OPENAI_API_KEY 2>&1

# 4. 部署
echo "🚀 正在部署 Worker..."
DEPLOY_OUTPUT=$(npx wrangler deploy 2>&1)
echo "$DEPLOY_OUTPUT"

# 5. 提取 URL
WORKER_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE 'https://[a-zA-Z0-9._-]+\.workers\.dev' | head -1)

echo ""
echo "================================="
echo " ✅ 部署成功！"
echo "================================="
echo ""
echo "Worker URL: $WORKER_URL"
echo ""
echo "请将以下配置添加到本地 .env 文件中："
echo "  VITE_AI_PROXY_URL=$WORKER_URL"
echo ""
echo "同时也添加到 GitHub Secrets（变量名: VITE_AI_PROXY_URL，值: $WORKER_URL）"
echo "地址: https://github.com/taptopnfc2026-stack/taptop1-menu/settings/secrets/actions"
echo ""
