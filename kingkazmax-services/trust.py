#!/usr/bin/env python3
"""
KINGKAZMAX Trust Score — Direction F: Infrastructure
Decentralized trust/reputation scoring with PoI audit trail.
"""
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
import requests

app = FastAPI(title="KINGKAZMAX Trust Score")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"
poi_log = []

# In-memory trust registry
trust_db = {}

@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-trust", "owner": "KINGKAZMAX"}

@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-trust",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "trust", "reputation", "decentralized", "kingkazmax"],
        "description": "Decentralized trust scoring: rate agents, compute reputation, prevent Sybil attacks.",
        "cost_model": {"per_call": 5},
        "paths": ["/score", "/rate", "/lookup", "/health", "/meta", "/poi"],
    }

@app.get("/lookup")
def lookup(did: str = ""):
    if did in trust_db:
        return {"did": did, "score": trust_db[did]}
    return {"did": did, "score": None, "message": "No trust data yet"}

@app.post("/rate")
async def rate(request: Request):
    body = await request.json()
    target_did = body.get("target_did", "")
    rater_did = body.get("rater_did", "")
    score = body.get("score", 5)  # 1-10
    reason = body.get("reason", "")

    # Validate score
    score = max(1, min(10, score))

    if target_did not in trust_db:
        trust_db[target_did] = {"total_score": 0, "count": 0, "ratings": []}

    trust_db[target_did]["total_score"] += score
    trust_db[target_did]["count"] += 1
    trust_db[target_did]["ratings"].append({
        "rater": rater_did,
        "score": score,
        "reason": reason,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "trust-rate",
        "target": target_did,
        "rater": rater_did,
        "score": score,
    }
    poi_log.append(poi)

    return {"status": "rated", "target": target_did, "new_avg": trust_db[target_did]["total_score"] / trust_db[target_did]["count"]}

@app.post("/score")
async def compute_score(request: Request):
    body = await request.json()
    did = body.get("did", "")

    if did not in trust_db or trust_db[did]["count"] == 0:
        return {"did": did, "trust_score": 0.0, "confidence": "none", "ratings": 0}

    avg = trust_db[did]["total_score"] / trust_db[did]["count"]
    confidence = "high" if trust_db[did]["count"] >= 5 else "medium" if trust_db[did]["count"] >= 2 else "low"

    poi = {
        "poi_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task": "trust-score",
        "target": did,
        "score": avg,
        "confidence": confidence,
    }
    poi_log.append(poi)

    return {"did": did, "trust_score": round(avg, 2), "confidence": confidence, "ratings": trust_db[did]["count"]}

@app.get("/poi")
def get_poi():
    return {"entries": poi_log[-20:], "total": len(poi_log)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9015)
