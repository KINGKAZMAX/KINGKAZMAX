#!/usr/bin/env python3
"""
KINGKAZMAX Code Generator — Direction A: LLM Market
Multi-language code generation with PoI audit trail.
"""
import os, json, time, uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import requests

app = FastAPI(title="KINGKAZMAX Code Generator")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

SYSTEM_PROMPT = """You are an expert code generator. Given a description, generate clean, production-ready code.
Include: proper error handling, type hints, docstrings. Output code only, no explanations unless asked."""

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-code-gen", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-code-gen",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "code", "generator", "kingkazmax"],
        "description": "Multi-language code generation with PoI audit. Supports Python/JS/TS/Rust/Go.",
        "cost_model": {"per_call": 8},
        "paths": ["/generate", "/health", "/meta", "/poi"],
    }

@app.post("/generate")
async def generate(request: Request):
    body = await request.json()
    prompt = body.get("prompt", "")
    language = body.get("language", "python")
    model = body.get("model", "gpt-4o-mini")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Generate {language} code for: {prompt}"}
    ]

    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages, "temperature": 0.3}

    resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=60)
    data = resp.json()
    answer = data["choices"][0]["message"]["content"]

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "code-gen",
        "language": language,
        "model": model,
        "output_chars": len(answer),
    }
    poi_log.append(poi)

    return {"code": answer, "language": language, "model": model, "poi": poi}

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9007)
