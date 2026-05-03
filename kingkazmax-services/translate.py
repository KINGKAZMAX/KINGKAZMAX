#!/usr/bin/env python3
"""
KINGKAZMAX Translation Service — Direction A: LLM Market
Multi-language translation with PoI audit trail.
"""
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Translation Service")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

SUPPORTED = ["zh", "en", "ja", "ko", "fr", "de", "es", "pt", "ru", "ar"]

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-translate", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-translate",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "translate", "nlp", "multilingual", "kingkazmax"],
        "description": "Multi-language translation service supporting 10+ languages with PoI audit.",
        "cost_model": {"per_call": 3},
        "paths": ["/translate", "/languages", "/health", "/meta", "/poi"],
    }

@app.get("/languages")
def languages():
    return {"supported": SUPPORTED, "count": len(SUPPORTED)}

@app.post("/translate")
async def translate(request: Request):
    body = await request.json()
    text = body.get("text", "")
    source = body.get("source", "auto")
    target = body.get("target", "en")
    model = body.get("model", "gpt-4o-mini")

    messages = [
        {"role": "system", "content": f"You are a professional translator. Translate the following text to {target}. Maintain the tone, style, and formatting. Output only the translation."},
        {"role": "user", "content": text}
    ]

    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages, "temperature": 0.2}

    resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=30)
    data = resp.json()
    translation = data["choices"][0]["message"]["content"]

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "translate",
        "source": source,
        "target": target,
        "model": model,
        "input_chars": len(text),
        "output_chars": len(translation),
    }
    poi_log.append(poi)

    return {"translation": translation, "source": source, "target": target, "model": model, "poi": poi}

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9009)
