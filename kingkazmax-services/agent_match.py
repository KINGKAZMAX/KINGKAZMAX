#!/usr/bin/env python3
"""
KINGKAZMAX Agent Match — Direction E: Multi-agent
Match tasks to best available agents on the P2P network.

Endpoint: http://127.0.0.1:9005
Tags: p2p-2026, multi-agent, match, kingkazmax
Cost: 5 🐚 / call
"""
import json
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import requests

app = FastAPI(title="KINGKAZMAX Agent Match")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"


def call_llm(messages, model="gpt-4o-mini"):
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages, "temperature": 0.3}
    resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=30)
    return resp.json()["choices"][0]["message"]["content"]


@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-agent-match", "owner": "KINGKAZMAX"}


@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-agent-match",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "multi-agent", "match", "kingkazmax"],
        "description": "Match tasks to best agents. Uses LLM to analyze task and recommend optimal agent(s) from ANS.",
        "cost_model": {"per_call": 5},
        "paths": ["/match", "/health", "/meta"],
    }


@app.post("/match")
async def match(request: Request):
    """Analyze task and find best agent(s) from P2P network."""
    body = await request.json()
    task = body.get("task", "")
    top_k = min(body.get("top_k", 3), 5)
    
    # Use LLM to analyze task type
    analysis_prompt = [
        {"role": "system", "content": "You are a task-analyst. Given a task description, output a JSON list of 3-5 relevant skill keywords (e.g., [\"llm\", \"code\", \"search\"]). Output ONLY the JSON list."},
        {"role": "user", "content": f"Task: {task}"}
    ]
    skill_json = call_llm(analysis_prompt, model="gpt-4o-mini")
    
    import re
    json_match = re.search(r'\[.*?\]', skill_json, re.DOTALL)
    skills = json.loads(json_match.group()) if json_match else ["llm"]
    
    # Simulate ANS discovery (in production, call svc.discover())
    # For demo, return simulated matches
    matches = []
    for i, skill in enumerate(skills[:top_k]):
        matches.append({
            "rank": i + 1,
            "skill": skill,
            "estimated_cost": (i + 1) * 5,
            "confidence": round(0.9 - i * 0.1, 2),
            "recommended": i == 0,
        })
    
    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task_hash": hash(task) % 100000,
        "skills_extracted": skills,
        "matches_found": len(matches),
    }
    
    return {
        "task": task,
        "skills": skills,
        "matches": matches,
        "recommendation": matches[0] if matches else None,
        "poi": poi,
    }


if __name__ == "__main__":
    import uvicorn
    print("🤝 KINGKAZMAX Agent Match starting on :9005")
    uvicorn.run(app, host="127.0.0.1", port=9005)
