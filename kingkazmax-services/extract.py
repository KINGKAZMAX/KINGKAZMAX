#!/usr/bin/env python3
"""
KINGKAZMAX Extract — Direction A: LLM Market
Data extraction pipeline: entities, relationships, structured data from text + PoI.
"""
import uuid, json
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Extract")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-extract", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-extract",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "extract", "ner", "data", "pipeline", "kingkazmax"],
        "description": "Data extraction pipeline: entities, relationships, structured data from unstructured text with PoI.",
        "cost_model": {"per_call": 5},
        "paths": ["/extract", "/health", "/meta", "/poi"],
    }

@app.post("/extract")
async def extract(request: Request):
    body = await request.json()
    text = body.get("text", "")
    extract_type = body.get("type", "entities")  # entities/relationships/structured
    model = body.get("model", "gpt-4o-mini")

    prompts = {
        "entities": "Extract all named entities from the text. Return JSON: {entities: [{name, type, context}]}",
        "relationships": "Extract entity relationships. Return JSON: {relationships: [{source, relation, target}]}",
        "structured": "Extract all structured data (tables, lists, key-value pairs). Return JSON: {data: [...]}",
    }
    prompt = prompts.get(extract_type, prompts["entities"])

    messages = [
        {"role": "system", "content": prompt + ". Only output valid JSON."},
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
        "task": "extract",
        "type": extract_type,
        "model": model,
        "input_chars": len(text),
    }
    poi_log.append(poi)

    return {"extraction": result, "type": extract_type, "model": model, "poi": poi}

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9017)
