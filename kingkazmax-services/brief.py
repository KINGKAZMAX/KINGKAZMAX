#!/usr/bin/env python3
"""
KINGKAZMAX Brief — Direction E: Multi-Agent Collaboration
AI research briefing: multi-source research → 3-layer output (brief + deep + action items) + PoI.
"""
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Brief")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-brief", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-brief",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "brief", "research", "multi-agent", "kingkazmax"],
        "description": "AI research briefing: 3-layer output (quick scan + deep analysis + action items) with PoI audit.",
        "cost_model": {"per_call": 15},
        "paths": ["/brief", "/health", "/meta", "/poi"],
    }

@app.post("/brief")
async def brief(request: Request):
    body = await request.json()
    topic = body.get("topic", "")
    depth = body.get("depth", "standard")  # quick/standard/deep
    model = body.get("model", "gpt-4o-mini")

    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

    # Layer 1: Quick scan
    messages1 = [
        {"role": "system", "content": "You are a research analyst. Provide a 3-sentence executive summary of the topic."},
        {"role": "user", "content": topic}
    ]
    payload1 = {"model": model, "messages": messages1, "temperature": 0.3}
    resp1 = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload1, timeout=30)
    quick_scan = resp1.json()["choices"][0]["message"]["content"]

    # Layer 2: Deep analysis
    depth_prompt = "Provide detailed analysis" if depth == "standard" else "Provide exhaustive analysis with all nuances"
    messages2 = [
        {"role": "system", "content": f"You are a senior research analyst. {depth_prompt}. Cover: background, current state, key players, trends, risks, and opportunities."},
        {"role": "user", "content": topic}
    ]
    payload2 = {"model": model, "messages": messages2, "temperature": 0.4}
    resp2 = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload2, timeout=60)
    deep_analysis = resp2.json()["choices"][0]["message"]["content"]

    # Layer 3: Action items
    messages3 = [
        {"role": "system", "content": "Based on the analysis, provide 3-5 actionable recommendations. Be specific and practical."},
        {"role": "user", "content": f"Topic: {topic}\nAnalysis: {deep_analysis}"}
    ]
    payload3 = {"model": model, "messages": messages3, "temperature": 0.3}
    resp3 = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload3, timeout=30)
    action_items = resp3.json()["choices"][0]["message"]["content"]

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "brief",
        "topic": topic[:50],
        "depth": depth,
        "model": model,
        "layers": 3,
    }
    poi_log.append(poi)

    return {
        "topic": topic,
        "quick_scan": quick_scan,
        "deep_analysis": deep_analysis,
        "action_items": action_items,
        "depth": depth,
        "model": model,
        "poi": poi,
    }

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9016)
