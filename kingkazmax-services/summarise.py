#!/usr/bin/env python3
"""
KINGKAZMAX Summarise — Direction A: LLM Market
Smart multi-level summarization with PoI audit trail.
"""
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Summarise")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-summarise", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-summarise",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "summarise", "nlp", "kingkazmax"],
        "description": "Multi-level summarization: brief/standard/detailed with PoI audit trail.",
        "cost_model": {"per_call": 3},
        "paths": ["/summarise", "/health", "/meta", "/poi"],
    }

@app.post("/summarise")
async def summarise(request: Request):
    body = await request.json()
    text = body.get("text", "")
    level = body.get("level", "standard")  # brief/standard/detailed
    model = body.get("model", "gpt-4o-mini")

    level_prompts = {
        "brief": "Summarize in 1-2 sentences. Capture only the core message.",
        "standard": "Summarize in a short paragraph. Include key points and conclusions.",
        "detailed": "Provide a comprehensive summary with: overview, key points, conclusions, and action items if applicable.",
    }
    prompt = level_prompts.get(level, level_prompts["standard"])

    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": text}
    ]

    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages, "temperature": 0.3}

    resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=30)
    data = resp.json()
    summary = data["choices"][0]["message"]["content"]

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "summarise",
        "level": level,
        "model": model,
        "input_chars": len(text),
        "output_chars": len(summary),
    }
    poi_log.append(poi)

    return {"summary": summary, "level": level, "model": model, "poi": poi}

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9011)
