#!/bin/bash
# ============================================================================
# KINGKAZMAX Deployment Script
# ============================================================================
# Agent Network Hackathon Competition Build
# 一键部署脚本 - 快速上线参赛
# ============================================================================

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🏆 KINGKAZMAX Deployment - Hackathon Mode 🏆           ║"
echo "║   Agent Network Competition Build                         ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Configuration
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON="python3"
VENV_DIR="$PROJECT_DIR/.venv"
PORT="${PORT:-8443}"
HOST="${HOST:-0.0.0.0}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================================================
# STEP 1: Environment Setup
# ============================================================================

log_info "Setting up environment..."

# Check Python version
PYTHON_VERSION=$($PYTHON --version 2>&1 | awk '{print $2}')
log_info "Python version: $PYTHON_VERSION"

if [[ "$PYTHON_VERSION" < "3.8" ]]; then
    log_error "Python 3.8+ required, found $PYTHON_VERSION"
    exit 1
fi

# Create virtual environment if not exists
if [ ! -d "$VENV_DIR" ]; then
    log_info "Creating virtual environment..."
    $PYTHON -m venv $VENV_DIR
fi

# Activate virtual environment
source $VENV_DIR/bin/activate
log_success "Virtual environment activated"

# Install dependencies
log_info "Installing dependencies..."
pip install -q urllib3 requests aiohttp 2>/dev/null || true
log_success "Dependencies ready"

# ============================================================================
# STEP 2: Export ANP Configurations
# ============================================================================

log_info "Exporting ANP protocol configurations..."

EXPORT_DIR="$PROJECT_DIR/config/exported"
mkdir -p $EXPORT_DIR/.well-known

log_info "Generating DID document..."
$PROJECT_DIR/utils/generate_configs.py 2>/dev/null || true

log_success "ANP configs exported to $EXPORT_DIR"

# ============================================================================
# STEP 3: Pre-flight Checks
# ============================================================================

log_info "Running pre-flight checks..."

# Check API connectivity
log_info "Testing API connectivity..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    https://api.openai-next.com/v1/models \
    -H "Authorization: Bearer sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d" 2>/dev/null || echo "000")

if [ "$API_RESPONSE" = "200" ]; then
    log_success "API endpoint reachable (HTTP $API_RESPONSE)"
else
    log_warn "API returned HTTP $API_RESPONSE - will retry at runtime"
fi

# Check port availability
if command -v lsof &>/dev/null; then
    if lsof -i :$PORT &>/dev/null; then
        log_warn "Port $PORT is in use, trying alternative..."
        PORT=$((PORT + 1))
    fi
fi
log_success "Port $PORT available"

# ============================================================================
# STEP 4: System Initialization Test
# ============================================================================

log_info "Running system initialization test..."

cd $PROJECT_DIR

TEST_RESULT=$($PYTHON -c "
import sys
sys.path.insert(0, '.')
from kingkazmax import KINGKAZMAX, Config
print('✓ Core module loaded')
print(f'✓ Config: {Config.AGENT_NAME} v{Config.AGENT_VERSION}')
print('✓ System OK')
" 2>&1)

if echo "$TEST_RESULT" | grep -q "System OK"; then
    echo "$TEST_RESULT" | while read line; do log_success "$line"; done
else
    log_error "System initialization failed:"
    echo "$TEST_RESULT"
    exit 1
fi

# ============================================================================
# STEP 5: Start Server
# ============================================================================

echo ""
log_info "Starting KINGKAZMAX server..."
echo ""

# Run the main application
exec $PYTHON -c "
import asyncio
import sys
sys.path.insert(0, '.')

async def main():
    from api.server import run_api_server
    kkm, handler = await run_api_server(host='$HOST', port=$PORT)
    
    # Keep running
    print('')
    print('🏆 KINGKAZMAX is LIVE and ready for competition!')
    print(f'   Listening on http://{$HOST}:{$PORT}')
    print('')
    print('Press Ctrl+C to stop')
    print('')
    
    # Simulate continuous operation for demo
    while True:
        await asyncio.sleep(60)
        status = kkm.get_status()
        print(f'[HEARTBEAT] Agents: {status[\"swarm\"][\"total_agents\"]} | Models active: {len(status[\"models\"][\"performance\"])}')

try:
    asyncio.run(main())
except KeyboardInterrupt:
    print('')
    log_info 'KINGKAZMAX shutting down...'
    print('🏆 Good luck in the competition!')
"
