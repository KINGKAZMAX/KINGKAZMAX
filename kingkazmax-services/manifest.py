#!/usr/bin/env python3
"""
KINGKAZMAX Manifest — Suite Topology
JSON topology of the entire KINGKAZMAX product suite.
Like Pneuma Court's manifest - the onboarding service.
"""
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI

app = FastAPI(title="KINGKAZMAX Manifest")

MANIFEST = {
    "suite": "KINGKAZMAX PRODUCT SUITE",
    "owner": "KINGKAZMAX",
    "did": "did:key:z6MkuPPuzbwdVgKQM64KX8iivKzDdNocesoY3LorrHcLuBNA",
    "version": "2.0.0",
    "description": "The most comprehensive agent suite on Agent Network. 18 services covering LLM Market, Multi-Agent Collaboration, MCP Tools, Payment, and more.",
    "services": {
        "llm-market": {
            "label": "Direction A: LLM Market",
            "services": [
                {"name": "kingkazmax-llm-router", "port": 9001, "cost": 5, "desc": "Multi-LLM routing with PoI"},
                {"name": "kingkazmax-code-gen", "port": 9007, "cost": 8, "desc": "Multi-language code generation"},
                {"name": "kingkazmax-sentiment", "port": 9008, "cost": 3, "desc": "Sentiment analysis with confidence"},
                {"name": "kingkazmax-translate", "port": 9009, "cost": 3, "desc": "10-language translation"},
                {"name": "kingkazmax-factcheck", "port": 9010, "cost": 10, "desc": "3-pass fact verification"},
                {"name": "kingkazmax-summarise", "port": 9011, "cost": 3, "desc": "Multi-level summarization"},
                {"name": "kingkazmax-keywords", "port": 9018, "cost": 3, "desc": "Keyword extraction"},
                {"name": "kingkazmax-classify", "port": 9019, "cost": 3, "desc": "Text classification"},
            ]
        },
        "multi-agent": {
            "label": "Direction E: Multi-Agent Collaboration",
            "services": [
                {"name": "kingkazmax-swarm-consensus", "port": 9002, "cost": 25, "desc": "N-agent parallel reasoning + PoI"},
                {"name": "kingkazmax-swarm-orchestrator", "port": 9003, "cost": 15, "desc": "Task decomposition & merge"},
                {"name": "kingkazmax-agent-match", "port": 9005, "cost": 5, "desc": "Task-agent matching"},
                {"name": "kingkazmax-debate", "port": 9012, "cost": 12, "desc": "Multi-perspective debate arena"},
                {"name": "kingkazmax-onboard", "port": 9014, "cost": 0, "desc": "New agent onboarding gateway"},
                {"name": "kingkazmax-brief", "port": 9016, "cost": 15, "desc": "AI research briefing"},
            ]
        },
        "infra": {
            "label": "Direction F: Infrastructure & Payment",
            "services": [
                {"name": "kingkazmax-mcp-bridge", "port": 9004, "cost": 10, "desc": "MCP tool P2P bridge"},
                {"name": "kingkazmax-x402-relay", "port": 9006, "cost": 20, "desc": "x402 USDC payment channel"},
                {"name": "kingkazmax-manifest", "port": 9013, "cost": 0, "desc": "Suite topology & onboarding"},
                {"name": "kingkazmax-trust", "port": 9015, "cost": 5, "desc": "Decentralized trust scoring"},
                {"name": "kingkazmax-extract", "port": 9017, "cost": 5, "desc": "Data extraction pipeline"},
            ]
        }
    },
    "total_services": 18,
    "price_range": "0-25 shells/call",
    "highlights": [
        "18 services = largest product suite on Agent Network",
        "3 directions covered: LLM Market + Multi-Agent + Infrastructure",
        "Every service has PoI audit trail",
        "x402 USDC real payment channel",
        "Manifest service for instant onboarding",
        "Free onboarding gateway for new agents",
    ]
}

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-manifest", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-manifest",
        "version": "2.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "manifest", "topology", "onboarding", "kingkazmax"],
        "description": "KINGKAZMAX Suite manifest: complete JSON topology for instant onboarding. 5 seconds to understand the entire product suite.",
        "cost_model": {"per_call": 0},
        "paths": ["/manifest", "/topology", "/health", "/meta"],
    }

@app.get("/manifest")
@app.post("/manifest")
def get_manifest():
    return MANIFEST

@app.get("/topology")
@app.post("/topology")
def get_topology():
    return {
        "graph": {
            s["name"]: {"port": s["port"], "cost": s["cost"]}
            for dir_services in MANIFEST["services"].values()
            for s in dir_services["services"]
        },
        "directions": {k: v["label"] for k, v in MANIFEST["services"].items()},
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9013)
