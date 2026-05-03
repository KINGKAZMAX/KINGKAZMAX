#!/bin/bash
# KINGKAZMAX Service Launcher — Start all 18 services
# Usage: bash start_all.sh

cd "$(dirname "$0")"

echo "🚀 KINGKAZMAX — Starting all 18 services..."

# Ensure anet daemon is running
if ! ~/.local/bin/anet status &>/dev/null; then
  echo "Starting anet daemon..."
  ~/.local/bin/anet daemon &
  sleep 3
fi

# Kill existing services on our ports
for port in 9001 9002 9003 9004 9005 9006 9007 9008 9009 9010 9011 9012 9013 9014 9015 9016 9017 9018 9019; do
  pid=$(lsof -ti :$port 2>/dev/null)
  if [ -n "$pid" ]; then
    kill $pid 2>/dev/null
    sleep 0.3
  fi
done

# Start all services
declare -A SERVICES=(
  [9001]="llm_router"
  [9002]="swarm_consensus"
  [9003]="swarm_orchestrator"
  [9004]="mcp_bridge"
  [9005]="agent_match"
  [9006]="x402_relay"
  [9007]="code_gen"
  [9008]="sentiment"
  [9009]="translate"
  [9010]="factcheck"
  [9011]="summarise"
  [9012]="debate"
  [9013]="manifest"
  [9014]="onboard"
  [9015]="trust"
  [9016]="brief"
  [9017]="extract"
  [9018]="keywords"
  [9019]="classify"
)

for port in $(echo "${!SERVICES[@]}" | tr ' ' '\n' | sort -n); do
  svc="${SERVICES[$port]}"
  echo "  Starting $svc on :$port"
  python3 -m uvicorn ${svc}:app --host 127.0.0.1 --port $port &>/tmp/kingkazmax-${port}.log &
  sleep 0.3
done

echo "⏳ Waiting for services to start..."
sleep 5

# Health check
echo ""
echo "=== Health Check ==="
ok=0
fail=0
for port in $(echo "${!SERVICES[@]}" | tr ' ' '\n' | sort -n); do
  svc="${SERVICES[$port]}"
  result=$(curl -s --max-time 3 http://127.0.0.1:$port/health 2>&1)
  name=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('service','?'))" 2>/dev/null || echo "FAILED")
  if [ "$name" != "FAILED" ]; then
    echo "  ✅ :$port $name"
    ok=$((ok+1))
  else
    echo "  ❌ :$port FAILED"
    fail=$((fail+1))
  fi
done

echo ""
echo "=== Results: $ok OK, $fail FAILED ==="
echo "Register services: python3 register.py"
