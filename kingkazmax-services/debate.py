#!/usr/bin/env python3
"""
KINGKAZMAX Debate Arena — Direction E: Multi-Agent Collaboration
Multi-perspective debate with PoI audit trail.
"""
import uuid, json
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Debate Arena")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

ROLES = ["proponent", "opponent", "judge"]

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-debate", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-debate",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "debate", "multi-agent", "reasoning", "kingkazmax"],
        "description": "Multi-perspective debate arena: 3 agents argue from different angles with PoI.",
        "cost_model": {"per_call": 12},
        "paths": ["/debate", "/health", "/meta", "/poi"],
    }

@app.post("/debate")
async def debate(request: Request):
    body = await request.json()
    topic = body.get("topic", "")
    rounds = body.get("rounds", 1)
    model = body.get("model", "gpt-4o-mini")

    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    transcript = []

    for r in range(rounds):
        # Proponent
        messages = [
            {"role": "system", "content": "You are a passionate proponent. Argue FOR the topic with evidence and logic."},
            {"role": "user", "content": f"Topic: {topic}\n{'Previous arguments: ' + json.dumps(transcript[-4:]) if transcript else 'Opening argument.'}"}
        ]
        payload = {"model": model, "messages": messages, "temperature": 0.7}
        resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=30)
        pro_arg = resp.json()["choices"][0]["message"]["content"]
        transcript.append({"role": "proponent", "round": r+1, "argument": pro_arg})

        # Opponent
        messages = [
            {"role": "system", "content": "You are a rigorous opponent. Argue AGAINST the topic with counter-evidence."},
            {"role": "user", "content": f"Topic: {topic}\nCounter this: {pro_arg}"}
        ]
        payload = {"model": model, "messages": messages, "temperature": 0.7}
        resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=30)
        con_arg = resp.json()["choices"][0]["message"]["content"]
        transcript.append({"role": "opponent", "round": r+1, "argument": con_arg})

    # Judge verdict
    messages = [
        {"role": "system", "content": "You are a neutral judge. Evaluate the debate and give a verdict with reasoning."},
        {"role": "user", "content": f"Topic: {topic}\nTranscript: {json.dumps(transcript)}"}
    ]
    payload = {"model": model, "messages": messages, "temperature": 0.3}
    resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=30)
    verdict = resp.json()["choices"][0]["message"]["content"]

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "debate",
        "topic": topic[:50],
        "rounds": rounds,
        "model": model,
    }
    poi_log.append(poi)

    return {"topic": topic, "transcript": transcript, "verdict": verdict, "poi": poi}

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9012)
