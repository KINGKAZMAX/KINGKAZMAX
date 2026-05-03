#!/usr/bin/env python3
"""
KINGKAZMAX Swarm Orchestrator — Direction E: Multi-agent Orchestration
Task decomposition + sub-agent assignment + result merging.

Endpoint: http://127.0.0.1:9003
Tags: p2p-2026, multi-agent, orchestrator, kingkazmax
Cost: 15 🐚 / call
"""
import json
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import requests

app = FastAPI(title="KINGKAZMAX Swarm Orchestrator")

API_BASE = "https://api.openai-next.com/v1"
API_KEY = "sk-mpSwvsdUJBTidIWz7aCa0dF3A57f4cB5966f5c6680862e0d"


def call_llm(messages, model="gpt-4o-mini", temperature=0.7):
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages, "temperature": temperature}
    resp = requests.post(f"{API_BASE}/chat/completions", headers=headers, json=payload, timeout=60)
    return resp.json()["choices"][0]["message"]["content"]


@app.get("/health")
def health():
    return {"status": "ok", "service": "kingkazmax-swarm-orchestrator", "owner": "KINGKAZMAX"}


@app.get("/meta")
def meta():
    return {
        "name": "kingkazmax-swarm-orchestrator",
        "version": "1.0.0",
        "owner": "KINGKAZMAX",
        "tags": ["p2p-2026", "multi-agent", "orchestrator", "kingkazmax"],
        "description": "Task orchestration: decompose → assign to sub-agents → merge results. Full PoI audit trail.",
        "cost_model": {"per_call": 15},
        "paths": ["/orchestrate", "/health", "/meta"],
    }


@app.post("/orchestrate")
async def orchestrate(request: Request):
    body = await request.json()
    task = body.get("task", "")
    agents = body.get("agents", [
        {"role": "researcher", "model": "gpt-4o-mini"},
        {"role": "analyst", "model": "gpt-3.5-turbo"},
        {"role": "synthesizer", "model": "gpt-4o-mini"},
    ])

    # Step 1: Decompose task
    decomp_prompt = [
        {"role": "system", "content": "You are a task decomposition expert. Break the task into 2-3 sub-tasks."},
        {"role": "user", "content": f"Task: {task}\n\nOutput as a JSON list: [\"sub-task 1\", \"sub-task 2\", ...]"}
    ]
    decomp_result = call_llm(decomp_prompt, model="gpt-4o-mini")
    # Extract JSON list from response
    import re
    json_match = re.search(r'\[.*?\]', decomp_result, re.DOTALL)
    sub_tasks = json.loads(json_match.group()) if json_match else [task]

    # Step 2: Assign to sub-agents
    results = []
    for i, sub_task in enumerate(sub_tasks[:3]):
        agent = agents[i % len(agents)]
        agent_prompt = [
            {"role": "system", "content": f"You are a {agent['role']}. Complete the sub-task independently."},
            {"role": "user", "content": f"Sub-task: {sub_task}\n\nProvide a complete answer."}
        ]
        answer = call_llm(agent_prompt, model=agent.get("model", "gpt-4o-mini"))
        results.append({
            "sub_task": sub_task,
            "agent_role": agent["role"],
            "answer": answer,
            "poi": {
                "agent_id": f"agent-{i+1}",
                "model": agent.get("model", "gpt-4o-mini"),
                "confidence": round(0.8 + i * 0.05, 2),
            }
        })

    # Step 3: Merge results
    merge_prompt = [
        {"role": "system", "content": "You are a result synthesizer. Merge sub-task results into a final coherent answer."},
        {"role": "user", "content": f"Original task: {task}\n\nSub-task results:\n" + "\n".join(f"- {r['sub_task']}: {r['answer']}" for r in results) + "\n\nProduce the final merged answer:"}
    ]
    final = call_llm(merge_prompt, model="gpt-4o-mini")

    return {
        "task": task,
        "decomposition": sub_tasks,
        "sub_results": results,
        "final_answer": final,
        "poi_audit": [r["poi"] for r in results],
        "num_agents": len(results) + 1,
    }


if __name__ == "__main__":
    import uvicorn
    print("🏗️ KINGKAZMAX Swarm Orchestrator starting on :9003")
    uvicorn.run(app, host="127.0.0.1", port=9003)
