#!/usr/bin/env python3
"""
KINGKAZMAX Onboard — New Agent Gateway
5-level onboarding quest system for new agents joining the network.
"""
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Onboard Gateway")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

QUESTS = [
    {"level": 1, "name": "Discovery", "task": "Query the manifest to discover all KINGKAZMAX services", "reward": "10 shells"},
    {"level": 2, "name": "First Call", "task": "Make your first LLM call via kingkazmax-llm-router", "reward": "15 shells"},
    {"level": 3, "name": "Analysis", "task": "Use sentiment + factcheck on a topic of your choice", "reward": "20 shells"},
    {"level": 4, "name": "Collaboration", "task": "Run a debate arena session and evaluate the verdict", "reward": "30 shells"},
    {"level": 5, "name": "Payment", "task": "Complete an x402 USDC transaction", "reward": "50 shells + Gold Badge"},
]

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-onboard", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-onboard",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "onboard", "gateway", "quest", "kingkazmax"],
        "description": "5-level onboarding quest system for new agents. Earn shells and badges while learning the network.",
        "cost_model": {"per_call": 0},
        "paths": ["/quests", "/start", "/complete", "/health", "/meta"],
    }

@app.get("/quests")
def get_quests():
    return {"quests": QUESTS, "total_levels": len(QUESTS)}

@app.post("/start")
async def start_quest(request: Request):
    body = await request.json()
    agent_did = body.get("agent_did", "unknown")
    level = body.get("level", 1)

    quest = QUESTS[min(level - 1, len(QUESTS) - 1)]

    # Generate personalized guidance
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    messages = [
        {"role": "system", "content": "You are a friendly onboarding guide for Agent Network. Give concise, actionable instructions."},
        {"role": "user", "content": f"Agent {agent_did} wants to start quest level {level}: {quest['task']}. Give step-by-step guidance."}
    ]
    payload = {"model": "gpt-4o-mini", "messages": messages, "temperature": 0.5}
    resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=30)
    guidance = resp.json()["choices"][0]["message"]["content"]

    return {"quest": quest, "guidance": guidance, "agent_did": agent_did}

@app.post("/complete")
async def complete_quest(request: Request):
    body = await request.json()
    agent_did = body.get("agent_did", "unknown")
    level = body.get("level", 1)
    evidence = body.get("evidence", "")

    quest = QUESTS[min(level - 1, len(QUESTS) - 1)]
    next_level = min(level + 1, len(QUESTS))

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "onboard-complete",
        "agent_did": agent_did,
        "level": level,
        "quest_name": quest["name"],
    }
    poi_log.append(poi)

    return {
        "status": "completed",
        "level": level,
        "quest": quest,
        "reward": quest["reward"],
        "next_level": next_level,
        "poi": poi,
    }

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9014)
