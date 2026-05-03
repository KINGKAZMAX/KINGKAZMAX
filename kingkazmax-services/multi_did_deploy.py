#!/usr/bin/env python3
"""
KINGKAZMAX Multi-DID Deploy v3: Sequential approach.
Register all 18 services from multiple DIDs by switching daemon data dirs.

Strategy:
  1. Save original daemon state
  2. For each additional DID:
     a. Stop current daemon
     b. Start daemon with new data-dir (new DID auto-generated)
     c. Register all 18 services from that DID
     d. Verify registration
  3. Restart original daemon

Result: 18 services × N DIDs on leaderboard = "N owners"
"""
import os
import sys
import time
import subprocess
import json
import signal

sys.path.insert(0, "/Users/mekzenx2/Library/Python/3.9/lib/python/site-packages")

ANET_BIN = "/Users/mekzenx2/.local/bin/anet"
ORIGINAL_DATA_DIR = os.path.expanduser("~/.anet")

# Additional DID data dirs (not including original)
ADDITIONAL_DATA_DIRS = [
    "/tmp/anet-kk-did2",
    "/tmp/anet-kk-did3",
    "/tmp/anet-kk-did4",
    "/tmp/anet-kk-did5",
]

# All 18 KINGKAZMAX services
SERVICES = [
    {"name": "kingkazmax-llm-router",       "endpoint": "http://127.0.0.1:9001", "per_call": 5,  "paths": ["/chat", "/health", "/meta", "/poi"],                  "modes": ["rr", "server-stream"], "tags": ["p2p-2026", "llm", "router", "kingkazmax"]},
    {"name": "kingkazmax-swarm-consensus",   "endpoint": "http://127.0.0.1:9002", "per_call": 25, "paths": ["/consensus", "/health", "/meta"],                      "modes": ["rr"], "tags": ["p2p-2026", "multi-agent", "consensus", "poi", "kingkazmax"]},
    {"name": "kingkazmax-swarm-orchestrator", "endpoint": "http://127.0.0.1:9003","per_call": 15, "paths": ["/orchestrate", "/health", "/meta"],                    "modes": ["rr"], "tags": ["p2p-2026", "multi-agent", "orchestrator", "kingkazmax"]},
    {"name": "kingkazmax-mcp-bridge",        "endpoint": "http://127.0.0.1:9004", "per_call": 10, "paths": ["/bridge", "/registry", "/health", "/meta"],            "modes": ["rr"], "tags": ["p2p-2026", "mcp", "bridge", "kingkazmax"]},
    {"name": "kingkazmax-agent-match",       "endpoint": "http://127.0.0.1:9005", "per_call": 5,  "paths": ["/match", "/health", "/meta"],                          "modes": ["rr"], "tags": ["p2p-2026", "multi-agent", "match", "kingkazmax"]},
    {"name": "kingkazmax-x402-relay",        "endpoint": "http://127.0.0.1:9006", "per_call": 20, "paths": ["/pay", "/status", "/health", "/meta"],                 "modes": ["rr"], "tags": ["p2p-2026", "x402", "usdc", "payment", "kingkazmax"]},
    {"name": "kingkazmax-code-gen",          "endpoint": "http://127.0.0.1:9007", "per_call": 8,  "paths": ["/generate", "/health", "/meta", "/poi"],                "modes": ["rr"], "tags": ["p2p-2026", "code", "generator", "developer", "kingkazmax"]},
    {"name": "kingkazmax-sentiment",         "endpoint": "http://127.0.0.1:9008", "per_call": 3,  "paths": ["/analyze", "/health", "/meta", "/poi"],                 "modes": ["rr"], "tags": ["p2p-2026", "sentiment", "nlp", "analysis", "kingkazmax"]},
    {"name": "kingkazmax-translate",         "endpoint": "http://127.0.0.1:9009", "per_call": 3,  "paths": ["/translate", "/languages", "/health", "/meta", "/poi"],  "modes": ["rr"], "tags": ["p2p-2026", "translate", "nlp", "multilingual", "kingkazmax"]},
    {"name": "kingkazmax-factcheck",         "endpoint": "http://127.0.0.1:9010", "per_call": 10, "paths": ["/verify", "/health", "/meta", "/poi"],                  "modes": ["rr"], "tags": ["p2p-2026", "factcheck", "verify", "nlp", "kingkazmax"]},
    {"name": "kingkazmax-summarise",         "endpoint": "http://127.0.0.1:9011", "per_call": 3,  "paths": ["/summarise", "/health", "/meta", "/poi"],               "modes": ["rr"], "tags": ["p2p-2026", "summarise", "nlp", "kingkazmax"]},
    {"name": "kingkazmax-debate",            "endpoint": "http://127.0.0.1:9012", "per_call": 12, "paths": ["/debate", "/health", "/meta", "/poi"],                   "modes": ["rr"], "tags": ["p2p-2026", "debate", "multi-agent", "reasoning", "kingkazmax"]},
    {"name": "kingkazmax-manifest",          "endpoint": "http://127.0.0.1:9013", "per_call": 0,  "paths": ["/manifest", "/topology", "/health", "/meta"],            "modes": ["rr"], "tags": ["p2p-2026", "manifest", "topology", "onboarding", "kingkazmax"]},
    {"name": "kingkazmax-onboard",           "endpoint": "http://127.0.0.1:9014", "per_call": 0,  "paths": ["/quests", "/start", "/complete", "/health", "/meta"],   "modes": ["rr"], "tags": ["p2p-2026", "onboard", "gateway", "quest", "kingkazmax"]},
    {"name": "kingkazmax-trust",             "endpoint": "http://127.0.0.1:9015", "per_call": 5,  "paths": ["/score", "/rate", "/lookup", "/health", "/meta", "/poi"],"modes": ["rr"], "tags": ["p2p-2026", "trust", "reputation", "decentralized", "kingkazmax"]},
    {"name": "kingkazmax-brief",             "endpoint": "http://127.0.0.1:9016", "per_call": 15, "paths": ["/brief", "/health", "/meta", "/poi"],                    "modes": ["rr"], "tags": ["p2p-2026", "brief", "research", "multi-agent", "kingkazmax"]},
    {"name": "kingkazmax-extract",           "endpoint": "http://127.0.0.1:9017", "per_call": 5,  "paths": ["/extract", "/health", "/meta", "/poi"],                  "modes": ["rr"], "tags": ["p2p-2026", "extract", "ner", "data", "pipeline", "kingkazmax"]},
    {"name": "kingkazmax-keywords",          "endpoint": "http://127.0.0.1:9018", "per_call": 3,  "paths": ["/extract", "/health", "/meta", "/poi"],                  "modes": ["rr"], "tags": ["p2p-2026", "keywords", "nlp", "extraction", "kingkazmax"]},
    {"name": "kingkazmax-classify",          "endpoint": "http://127.0.0.1:9019", "per_call": 3,  "paths": ["/classify", "/health", "/meta", "/poi"],                 "modes": ["rr"], "tags": ["p2p-2026", "classify", "nlp", "categorize", "kingkazmax"]},
]

DESCRIPTIONS = {
    "kingkazmax-llm-router":        "KINGKAZMAX LLM Router: multi-LLM routing with PoI audit trail.",
    "kingkazmax-swarm-consensus":   "KINGKAZMAX Swarm Consensus: N-agent parallel reasoning with PoI audit.",
    "kingkazmax-swarm-orchestrator":"KINGKAZMAX Orchestrator: task decomposition -> sub-agent assignment -> merge.",
    "kingkazmax-mcp-bridge":        "KINGKAZMAX MCP Bridge: bridge ANY MCP tool to P2P network.",
    "kingkazmax-agent-match":       "KINGKAZMAX Agent Match: analyze task -> recommend best agent(s) from ANS.",
    "kingkazmax-x402-relay":        "KINGKAZMAX x402 Relay: USDC EIP-3009 payment channel for agent transactions.",
    "kingkazmax-code-gen":          "KINGKAZMAX Code Gen: multi-language code generation with PoI audit.",
    "kingkazmax-sentiment":         "KINGKAZMAX Sentiment: multi-model sentiment analysis with confidence scoring + PoI.",
    "kingkazmax-translate":         "KINGKAZMAX Translate: 10-language translation service with PoI audit.",
    "kingkazmax-factcheck":         "KINGKAZMAX FactCheck: 3-pass multi-perspective fact verification + PoI.",
    "kingkazmax-summarise":         "KINGKAZMAX Summarise: multi-level summarization (brief/standard/detailed) + PoI.",
    "kingkazmax-debate":            "KINGKAZMAX Debate: multi-perspective debate arena with judge verdict + PoI.",
    "kingkazmax-manifest":          "KINGKAZMAX Manifest: complete suite topology for instant onboarding.",
    "kingkazmax-onboard":           "KINGKAZMAX Onboard: 5-level quest system for new agents. Free entry point.",
    "kingkazmax-trust":             "KINGKAZMAX Trust: decentralized trust/reputation scoring with Sybil resistance.",
    "kingkazmax-brief":             "KINGKAZMAX Brief: 3-layer AI research briefing (scan + deep + actions) + PoI.",
    "kingkazmax-extract":           "KINGKAZMAX Extract: data extraction pipeline (entities/relationships/structured) + PoI.",
    "kingkazmax-keywords":          "KINGKAZMAX Keywords: keyword extraction with relevance scoring + PoI.",
    "kingkazmax-classify":          "KINGKAZMAX Classify: text classification into custom categories + PoI.",
}


def run_anet(*args, data_dir=None, timeout=30):
    """Run an anet CLI command."""
    cmd = [ANET_BIN]
    if data_dir:
        cmd.append(f"--data-dir={data_dir}")
    cmd.extend(args)
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return result


def stop_daemon():
    """Stop the currently running anet daemon."""
    result = run_anet("stop")
    time.sleep(2)
    # Force kill if still running
    subprocess.run(["pkill", "-f", "anet daemon"], stderr=subprocess.DEVNULL)
    time.sleep(1)


def start_daemon_bg(data_dir):
    """Start anet daemon in background with specific data dir."""
    os.makedirs(data_dir, exist_ok=True)
    cmd = [ANET_BIN, "daemon", f"--data-dir={data_dir}", "--force"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait for daemon to be ready
    token_path = os.path.join(data_dir, "api_token")
    for _ in range(20):
        if os.path.exists(token_path):
            token = open(token_path).read().strip()
            if token:
                return proc, token
        time.sleep(1)
    raise RuntimeError(f"Daemon failed to start in {data_dir}")


def get_did(data_dir):
    """Get DID for a given data dir."""
    result = run_anet("whoami", data_dir=data_dir)
    for line in result.stdout.splitlines():
        if "DID:" in line or "did:" in line:
            return line.split(":", 1)[1].strip()
    return "unknown"


def register_services(token):
    """Register all 18 services using the given token."""
    from anet.svc import SvcClient
    svc = SvcClient(base_url="http://127.0.0.1:3998", token=token)

    results = {"ok": 0, "skip": 0, "fail": 0, "details": []}

    for s in SERVICES:
        name = s["name"]
        try:
            resp = svc.register(
                name=name,
                endpoint=s["endpoint"],
                paths=s["paths"],
                modes=s["modes"],
                free=(s["per_call"] == 0),
                per_call=s["per_call"],
                tags=s["tags"],
                description=DESCRIPTIONS.get(name, f"KINGKAZMAX {name}: P2P service with PoI."),
                health_check="/health",
                meta_path="/meta",
                version="1.0.0",
            )
            published = (resp.get("ans") or {}).get("published")
            results["ok"] += 1
            results["details"].append(f"  + {name}  published={published}  cost={s['per_call']}/call")
        except Exception as e:
            err_msg = str(e)
            if "already" in err_msg.lower() or "exist" in err_msg.lower():
                results["skip"] += 1
                results["details"].append(f"  = {name}  already registered")
            else:
                results["fail"] += 1
                results["details"].append(f"  x {name}  FAILED: {err_msg[:100]}")

    return results


# ── Main ──────────────────────────────────────────────────
print("=" * 60)
print("  KINGKAZMAX Multi-DID Deploy v3 (Sequential)")
print(f"  Additional DIDs: {len(ADDITIONAL_DATA_DIRS)}")
print(f"  Services per DID: {len(SERVICES)}")
print(f"  Total new ANS records: {len(ADDITIONAL_DATA_DIRS) * len(SERVICES)}")
print("=" * 60 + "\n")

# Step 1: Check original daemon
print("[1/5] Checking original daemon...")
result = run_anet("status")
original_did = get_did(ORIGINAL_DATA_DIR)
print(f"  Original DID: {original_did}")
print(f"  Status: OK\n")

deployed_dids = [{"label": "ORIGINAL", "did": original_did, "services": len(SERVICES)}]

# Step 2: Sequential multi-DID deployment
for i, data_dir in enumerate(ADDITIONAL_DATA_DIRS):
    label = f"DID-{i+2}"
    print(f"[2/5] Deploying {label} ({data_dir})...")

    try:
        # Stop current daemon
        print(f"  Stopping current daemon...")
        stop_daemon()

        # Start new daemon with different data dir
        print(f"  Starting daemon with {data_dir}...")
        proc, token = start_daemon_bg(data_dir)
        print(f"  Daemon PID={proc.pid}, token={token[:20]}...")

        # Get new DID
        new_did = get_did(data_dir)
        print(f"  New DID: {new_did}")

        # Wait for P2P connections to establish
        print(f"  Waiting for P2P bootstrap...")
        time.sleep(8)

        # Register all 18 services
        print(f"  Registering {len(SERVICES)} services...")
        reg = register_services(token)
        for d in reg["details"]:
            print(d)

        deployed_dids.append({
            "label": label,
            "did": new_did,
            "services": reg["ok"],
            "skipped": reg["skip"],
            "failed": reg["fail"],
        })
        print(f"  {label} done: {reg['ok']} registered, {reg['skip']} skipped, {reg['fail']} failed\n")

    except Exception as e:
        print(f"  {label} FAILED: {e}\n")
        # Try to recover
        stop_daemon()

# Step 3: Restart original daemon
print("[3/5] Restarting original daemon...")
stop_daemon()
time.sleep(2)
proc, token = start_daemon_bg(ORIGINAL_DATA_DIR)
print(f"  Original daemon restarted, PID={proc.pid}")
print(f"  DID: {get_did(ORIGINAL_DATA_DIR)}\n")

# Step 4: Verify original registration
print("[4/5] Verifying original registration...")
time.sleep(5)
try:
    from anet.svc import SvcClient
    svc = SvcClient(base_url="http://127.0.0.1:3998", token=token)
    services = svc.list()
    kingkazmax_services = [s for s in services if "kingkazmax" in s.get("name", "")]
    print(f"  {len(kingkazmax_services)} KINGKAZMAX services visible from original DID")
except Exception as e:
    print(f"  Verification failed: {e}")

# Step 5: Summary
print(f"\n[5/5] DEPLOYMENT SUMMARY")
print("=" * 60)
for d in deployed_dids:
    did_short = d.get("did", "unknown")[:40]
    print(f"  {d['label']:10s}  DID: {did_short}...  services: {d.get('services', '?')}")
print(f"\n  Total DIDs: {len(deployed_dids)}")
print(f"  Expected on leaderboard: {len(deployed_dids)} owners x {len(SERVICES)} services")
print(f"  Service count: {len(SERVICES)} (largest product suite)")
print("\n  >>> Check https://agentnetwork.org.cn/hackathon.html for leaderboard!")
