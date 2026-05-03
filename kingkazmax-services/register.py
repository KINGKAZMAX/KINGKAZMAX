#!/usr/bin/env python3
"""
Register ALL KINGKAZMAX services with the P2P gateway (v2 — 18 services).
Skips already-registered services automatically.
"""
import sys
sys.path.insert(0, "/Users/mekzenx2/Library/Python/3.9/lib/python/site-packages")

from anet.svc import SvcClient

TOKEN = "3795e70efe726c6bc850903605a10e9a1ab6b316dd5da0bb13e14b160f2cebf6"
svc = SvcClient(base_url="http://127.0.0.1:3998", token=TOKEN)

# ── All 18 services ──────────────────────────────────────
SERVICES = [
    # Direction A: LLM Market (8 services)
    {
        "name": "kingkazmax-llm-router",
        "endpoint": "http://127.0.0.1:9001",
        "paths": ["/chat", "/health", "/meta", "/poi"],
        "modes": ["rr", "server-stream"],
        "per_call": 5,
        "tags": ["p2p-2026", "llm", "router", "kingkazmax"],
        "description": "KINGKAZMAX LLM Router: multi-LLM routing with PoI audit trail.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-swarm-consensus",
        "endpoint": "http://127.0.0.1:9002",
        "paths": ["/consensus", "/health", "/meta"],
        "modes": ["rr"],
        "per_call": 25,
        "tags": ["p2p-2026", "multi-agent", "consensus", "poi", "kingkazmax"],
        "description": "KINGKAZMAX Swarm Consensus: N-agent parallel reasoning with PoI audit.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-swarm-orchestrator",
        "endpoint": "http://127.0.0.1:9003",
        "paths": ["/orchestrate", "/health", "/meta"],
        "modes": ["rr"],
        "per_call": 15,
        "tags": ["p2p-2026", "multi-agent", "orchestrator", "kingkazmax"],
        "description": "KINGKAZMAX Orchestrator: task decomposition → sub-agent assignment → merge.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-mcp-bridge",
        "endpoint": "http://127.0.0.1:9004",
        "paths": ["/bridge", "/registry", "/health", "/meta"],
        "modes": ["rr"],
        "per_call": 10,
        "tags": ["p2p-2026", "mcp", "bridge", "kingkazmax"],
        "description": "KINGKAZMAX MCP Bridge: bridge ANY MCP tool to P2P network.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-agent-match",
        "endpoint": "http://127.0.0.1:9005",
        "paths": ["/match", "/health", "/meta"],
        "modes": ["rr"],
        "per_call": 5,
        "tags": ["p2p-2026", "multi-agent", "match", "kingkazmax"],
        "description": "KINGKAZMAX Agent Match: analyze task → recommend best agent(s) from ANS.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-x402-relay",
        "endpoint": "http://127.0.0.1:9006",
        "paths": ["/pay", "/status", "/health", "/meta"],
        "modes": ["rr"],
        "per_call": 20,
        "tags": ["p2p-2026", "x402", "usdc", "payment", "kingkazmax"],
        "description": "KINGKAZMAX x402 Relay: USDC EIP-3009 payment channel for agent transactions.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    # ── NEW: Direction A expanded (6 services) ──
    {
        "name": "kingkazmax-code-gen",
        "endpoint": "http://127.0.0.1:9007",
        "paths": ["/generate", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 8,
        "tags": ["p2p-2026", "code", "generator", "developer", "kingkazmax"],
        "description": "KINGKAZMAX Code Gen: multi-language code generation with PoI audit.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-sentiment",
        "endpoint": "http://127.0.0.1:9008",
        "paths": ["/analyze", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 3,
        "tags": ["p2p-2026", "sentiment", "nlp", "analysis", "kingkazmax"],
        "description": "KINGKAZMAX Sentiment: multi-model sentiment analysis with confidence scoring + PoI.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-translate",
        "endpoint": "http://127.0.0.1:9009",
        "paths": ["/translate", "/languages", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 3,
        "tags": ["p2p-2026", "translate", "nlp", "multilingual", "kingkazmax"],
        "description": "KINGKAZMAX Translate: 10-language translation service with PoI audit.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-factcheck",
        "endpoint": "http://127.0.0.1:9010",
        "paths": ["/verify", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 10,
        "tags": ["p2p-2026", "factcheck", "verify", "nlp", "kingkazmax"],
        "description": "KINGKAZMAX FactCheck: 3-pass multi-perspective fact verification + PoI.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-summarise",
        "endpoint": "http://127.0.0.1:9011",
        "paths": ["/summarise", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 3,
        "tags": ["p2p-2026", "summarise", "nlp", "kingkazmax"],
        "description": "KINGKAZMAX Summarise: multi-level summarization (brief/standard/detailed) + PoI.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    # ── NEW: Direction E expanded (3 services) ──
    {
        "name": "kingkazmax-debate",
        "endpoint": "http://127.0.0.1:9012",
        "paths": ["/debate", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 12,
        "tags": ["p2p-2026", "debate", "multi-agent", "reasoning", "kingkazmax"],
        "description": "KINGKAZMAX Debate: multi-perspective debate arena with judge verdict + PoI.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    # ── NEW: Direction F expanded (6 services) ──
    {
        "name": "kingkazmax-manifest",
        "endpoint": "http://127.0.0.1:9013",
        "paths": ["/manifest", "/topology", "/health", "/meta"],
        "modes": ["rr"],
        "per_call": 0,
        "tags": ["p2p-2026", "manifest", "topology", "onboarding", "kingkazmax"],
        "description": "KINGKAZMAX Manifest: complete suite topology for instant onboarding.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "2.0.0",
    },
    {
        "name": "kingkazmax-onboard",
        "endpoint": "http://127.0.0.1:9014",
        "paths": ["/quests", "/start", "/complete", "/health", "/meta"],
        "modes": ["rr"],
        "per_call": 0,
        "tags": ["p2p-2026", "onboard", "gateway", "quest", "kingkazmax"],
        "description": "KINGKAZMAX Onboard: 5-level quest system for new agents. Free entry point.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-trust",
        "endpoint": "http://127.0.0.1:9015",
        "paths": ["/score", "/rate", "/lookup", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 5,
        "tags": ["p2p-2026", "trust", "reputation", "decentralized", "kingkazmax"],
        "description": "KINGKAZMAX Trust: decentralized trust/reputation scoring with Sybil resistance.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-brief",
        "endpoint": "http://127.0.0.1:9016",
        "paths": ["/brief", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 15,
        "tags": ["p2p-2026", "brief", "research", "multi-agent", "kingkazmax"],
        "description": "KINGKAZMAX Brief: 3-layer AI research briefing (scan + deep + actions) + PoI.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-extract",
        "endpoint": "http://127.0.0.1:9017",
        "paths": ["/extract", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 5,
        "tags": ["p2p-2026", "extract", "ner", "data", "pipeline", "kingkazmax"],
        "description": "KINGKAZMAX Extract: data extraction pipeline (entities/relationships/structured) + PoI.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-keywords",
        "endpoint": "http://127.0.0.1:9018",
        "paths": ["/extract", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 3,
        "tags": ["p2p-2026", "keywords", "nlp", "extraction", "kingkazmax"],
        "description": "KINGKAZMAX Keywords: keyword extraction with relevance scoring + PoI.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
    {
        "name": "kingkazmax-classify",
        "endpoint": "http://127.0.0.1:9019",
        "paths": ["/classify", "/health", "/meta", "/poi"],
        "modes": ["rr"],
        "per_call": 3,
        "tags": ["p2p-2026", "classify", "nlp", "categorize", "kingkazmax"],
        "description": "KINGKAZMAX Classify: text classification into custom categories + PoI.",
        "health_check": "/health",
        "meta_path": "/meta",
        "version": "1.0.0",
    },
]

# ── Get already registered names ───────────────────────────
registered = {e.get("name") for e in svc.list()}
print(f"Already registered: {registered}\n")

# ── Register each service ────────────────────────────────
for s in SERVICES:
    if s["name"] in registered:
        print(f"⊝  {s['name']} — already registered, skipping")
        continue
    try:
        resp = svc.register(
            name=s["name"],
            endpoint=s["endpoint"],
            paths=s["paths"],
            modes=s["modes"],
            free=(s["per_call"] == 0),
            per_call=s["per_call"],
            tags=s["tags"],
            description=s["description"],
            health_check=s["health_check"],
            meta_path=s["meta_path"],
            version=s["version"],
        )
        published = (resp.get("ans") or {}).get("published")
        print(f"✓  {s['name']} — ans.published={published}, cost={s['per_call']}/call")
    except Exception as e:
        print(f"✗  {s['name']} — FAILED: {e}")

# ── Final list ───────────────────────────────────────────
print(f"\n=== All registered services ===")
for e in svc.list():
    name = e.get("name", "")
    cost = e.get("cost_model") or {}
    print(f"  • {name}  cost={cost}")
