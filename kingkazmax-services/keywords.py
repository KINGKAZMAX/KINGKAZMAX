#!/usr/bin/env python3
"""
KINGKAZMAX Keywords — Direction A: LLM Market
Keyword extraction with relevance scoring + PoI.
"""
import uuid, json
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Keywords")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-keywords", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-keywords",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "keywords", "nlp", "extraction", "kingkazmax"],
        "description": "Keyword extraction with relevance scoring and frequency analysis + PoI.",
        "cost_model": {"per_call": 3},
        "paths": ["/extract", "/health", "/meta", "/poi"],
    }

@app.post("/extract")
async def extract(request: Request):
    body = await request.json()
    text = body.get("text", "")
    top_k = body.get("top_k", 10)
    model = body.get("model", "gpt-4o-mini")

    messages = [
        {"role": "system", "content": f"Extract the top {top_k} keywords/keyphrases from the text. Return JSON: {{keywords: [{{keyword, relevance: 0.0-1.0, category}}]}}. Only output valid JSON."},
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
        "task": "keywords",
        "model": model,
        "top_k": top_k,
    }
    poi_log.append(poi)

    return {"result": result, "model": model, "poi": poi}

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9018)
