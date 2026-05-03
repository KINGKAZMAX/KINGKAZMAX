#!/usr/bin/env python3
"""
KINGKAZMAX Fact Check — Direction A: LLM Market
Multi-source fact verification with PoI audit trail.
"""
import uuid, json
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Fact Check")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-factcheck", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-factcheck",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "factcheck", "verify", "nlp", "kingkazmax"],
        "description": "Multi-source fact verification with confidence scoring and PoI audit trail.",
        "cost_model": {"per_call": 10},
        "paths": ["/verify", "/health", "/meta", "/poi"],
    }

@app.post("/verify")
async def verify(request: Request):
    body = await request.json()
    claim = body.get("claim", "")
    model = body.get("model", "gpt-4o-mini")

    # Run 3 verification passes with different prompts for robustness
    prompts = [
        {"role": "system", "content": "You are a fact-checker. Verify this claim. Return JSON: {verdict: true/false/unverifiable, confidence: 0.0-1.0, reasoning: string, sources: [string]}. Only JSON."},
        {"role": "system", "content": "You are a skeptical analyst. Challenge this claim from a critical perspective. Return JSON: {verdict: true/false/unverifiable, confidence: 0.0-1.0, reasoning: string, counter_arguments: [string]}. Only JSON."},
        {"role": "system", "content": "You are a neutral arbitrator. Weigh the evidence for this claim objectively. Return JSON: {verdict: true/false/unverifiable, confidence: 0.0-1.0, reasoning: string, evidence_for: [string], evidence_against: [string]}. Only JSON."},
    ]

    results = []
    for sys_prompt in prompts:
        messages = [sys_prompt, {"role": "user", "content": claim}]
        headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
        payload = {"model": model, "messages": messages, "temperature": 0.2}
        resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=30)
        data = resp.json()
        answer = data["choices"][0]["message"]["content"]
        try:
            results.append(json.loads(answer))
        except:
            results.append({"raw": answer})

    # Aggregate: majority vote
    verdicts = [r.get("verdict", "unverifiable") for r in results]
    from collections import Counter
    verdict_counts = Counter(verdicts)
    final_verdict = verdict_counts.most_common(1)[0][0]
    avg_confidence = sum(r.get("confidence", 0.5) for r in results) / len(results)

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "factcheck",
        "model": model,
        "verdict": final_verdict,
        "confidence": avg_confidence,
        "passes": 3,
    }
    poi_log.append(poi)

    return {
        "claim": claim,
        "verdict": final_verdict,
        "confidence": avg_confidence,
        "detailed_results": results,
        "poi": poi,
    }

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9010)
