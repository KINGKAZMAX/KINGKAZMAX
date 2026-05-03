#!/usr/bin/env python3
"""
KINGKAZMAX Sentiment Analysis — Direction A: LLM Market
Multi-model sentiment analysis with confidence scoring + PoI.
"""
import uuid, json
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Sentiment Analysis")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

SYSTEM_PROMPT = """Analyze the sentiment of the given text. Return a JSON object with:
- sentiment: positive/negative/neutral/mixed
- confidence: 0.0-1.0
- key_phrases: list of key emotional phrases
- intensity: low/medium/high
Return ONLY the JSON object."""

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-sentiment", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-sentiment",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "sentiment", "nlp", "analysis", "kingkazmax"],
        "description": "Multi-model sentiment analysis with confidence scoring and PoI audit trail.",
        "cost_model": {"per_call": 3},
        "paths": ["/analyze", "/health", "/meta", "/poi"],
    }

@app.post("/analyze")
async def analyze(request: Request):
    body = await request.json()
    text = body.get("text", "")
    model = body.get("model", "gpt-4o-mini")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": text}
    ]

    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages, "temperature": 0.1}

    resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=30)
    data = resp.json()
    answer = data["choices"][0]["message"]["content"]

    try:
        result = json.loads(answer)
    except:
        result = {"raw": answer, "parse_error": True}

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "sentiment",
        "model": model,
        "text_length": len(text),
    }
    poi_log.append(poi)

    return {"analysis": result, "model": model, "poi": poi}

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9008)
