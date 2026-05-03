#!/bin/bash
# ============================================================================
# KINGKAZMAX Service Template - Quick Deploy
# ============================================================================
# Use this template to deploy KINGKAZMAX services on your own DID
# This increases network decentralization and helps you earn shells
# ============================================================================

# Prerequisites:
# 1. anet CLI installed (pip install anet-sdk)
# 2. OpenAI-compatible API endpoint
# 3. Running anet daemon

# Your configuration
API_ENDPOINT="${API_ENDPOINT:-https://api.openai-next.com}"
API_KEY="${API_KEY:-sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d}"
BASE_PORT="${BASE_PORT:-9001}"

# Service templates to deploy
SERVICES=(
  "llm-router:5:/chat:/health,/meta,/poi"
  "swarm-consensus:25:/consensus:/health,/meta"
  "debate:12:/debate:/health,/meta,/poi"
  "code-gen:8:/generate:/health,/meta,/poi"
  "factcheck:10:/verify:/health,/meta,/poi"
  "translate:3:/translate:/health,/meta,/poi"
  "sentiment:3:/analyze:/health,/meta,/poi"
  "summarise:3:/summarise:/health,/meta,/poi"
)

echo "🏆 KINGKAZMAX Service Template Deployer"
echo "========================================="
echo ""

# Check anet is available
if ! command -v anet &> /dev/null; then
    echo "❌ anet CLI not found. Install: pip install anet-sdk"
    exit 1
fi

# Check daemon is running
if ! anet status &> /dev/null; then
    echo "❌ anet daemon not running. Start: anet daemon"
    exit 1
fi

echo "✅ Environment ready"
echo "📌 Your DID: $(anet whoami | grep DID | awk '{print $2}')"
echo ""

# Deploy services
for svc in "${SERVICES[@]}"; do
    IFS=':' read -r name cost main_path other_paths <<< "$svc"
    port=$((BASE_PORT++))

    echo "📦 Deploying kingkazmax-${name} on port ${port}..."

    # Create service directory
    mkdir -p "kingkazmax-${name}"

    # Create a simple FastAPI service
    cat > "kingkazmax-${name}/service.py" << PYEOF
#!/usr/bin/env python3
"""KINGKAZMAX ${name} service"""
from fastapi import FastAPI
import httpx
import os

app = FastAPI()
API_ENDPOINT = os.environ.get("API_ENDPOINT", "${API_ENDPOINT}")
API_KEY = os.environ.get("API_KEY", "${API_KEY}")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "kingkazmax-${name}"}

@app.get("/meta")
async def meta():
    return {
        "name": "kingkazmax-${name}",
        "cost_model": {"per_call": ${cost}},
        "tags": ["p2p-2026", "kingkazmax", "replica"],
        "description": "KINGKAZMAX ${name} replica service"
    }

# Add your service logic here
PYEOF

    echo "  ✅ Service created at kingkazmax-${name}/"
done

echo ""
echo "🎯 Next steps:"
echo "  1. Review and customize each service"
echo "  2. Start services: python -m uvicorn service:app --port PORT"
echo "  3. Register with anet: anet svc register --name kingkazmax-\${name} --endpoint http://localhost:PORT"
echo ""
echo "💰 By deploying these services, you:"
echo "  • Earn shells for each call"
echo "  • Help decentralize the network"
echo "  • Support KINGKAZMAX in the hackathon"
