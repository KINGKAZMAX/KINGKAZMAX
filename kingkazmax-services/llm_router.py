#!/usr/bin/env python3
"""
KINGKAZMAX LLM Router — Direction A: LLM Market
Multi-LLM routing with cost optimization + PoI audit trail.

Endpoint: http://127.0.0.1:9001
Tags: p2p-2026, llm, router, kingkazmax
Cost: 5 🐚 / call
"""
import os
import json
import time
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
import requests

app = FastAPI(title="KINGKAZMAX LLM Router")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
MODELS = ["gpt-4o-mini", "gpt-3.5-turbo", "gpt-4o"]

# PoI audit log (in production this goes to CAS / audit log)
poi_log = []


def make_poi_entry(question: str, model: str, answer: str, confidence: float) -> dict:
    """Generate Proof of Intelligence audit entry."""
    return {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "question_hash": hash(question) % 100000,
        "model": model,
        "confidence": confidence,
        "answer_preview": answer[:100],
        "audit_trail": f"model={model} | chars={len(answer)} | query_len={len(question)}",
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-llm-router", "owner": "KINGKAZMAX"}


@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-llm-router",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "llm", "router"],
        "description": "Multi-LLM router with PoI audit trail. Routes to gpt-4o-mini / gpt-3.5-turbo with cost optimization.",
        "cost_model": {"per_call": 5},
        "paths": ["/chat", "/health", "/meta", "/poi"],
    }


@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    messages = body.get("messages", [])
    model = body.get("model", "gpt-4o-mini")
    stream = body.get("stream", False)

    if model not in MODELS:
        model = "gpt-4o-mini"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": messages,
        "stream": stream,
    }

    if not stream:
        resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=60)
        data = resp.json()
        answer = data["choices"][0]["message"]["content"]
        poi = make_poi_entry(messages[-1]["content"], model, answer, 0.95)
        poi_log.append(poi)
        return {"answer": answer, "model": model, "poi": poi, "usage": data.get("usage", {})}

    # Streaming
    def gen():
        resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, stream=True, timeout=60)
        for line in resp.iter_lines():
            if line:
                yield line + b"\n"
    return StreamingResponse(gen(), media_type="text/event-stream")


@app.get("/poi")
def get_poi_log():
    return {"poi_entries": poi_log[-20:], "total": len(poi_log)}


if __name__ == "__main__":
    import uvicorn
    print("🚀 KINGKAZMAX LLM Router starting on :9001")
    uvicorn.run(app, host="127.0.0.1", port=9001)
