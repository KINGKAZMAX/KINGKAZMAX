<div align="center">

# 👑 KINGKAZMAX — P2P LLM OS

### Agent Network Hackathon 2026 · 南客松专项赛道

**P2P LLM 基础设施协议 — 一个地址，19 个 AI 能力，按调用计费**

[![Agent Network](https://img.shields.io/badge/Agent_Network-P2P_Live-blue)](https://agentnetwork.org.cn)
[![Services](https://img.shields.io/badge/Services-19_LIVE-brightgreen)](https://github.com/KINGKAZMAX/KINGKAZMAX)
[![Owners](https://img.shields.io/badge/Owners-3_Independent-purple)](https://github.com/KINGKAZMAX/KINGKAZMAX)
[![x402](https://img.shields.io/badge/x402_USDC-Live_Payments-orange)](https://github.com/KINGKAZMAX/KINGKAZMAX)
[![PoI](https://img.shields.io/badge/PoI-Every_Call-teal)](https://github.com/KINGKAZMAX/KINGKAZMAX)
[![Tag](https://img.shields.io/badge/tag-agentnetwork-red)](https://github.com/KINGKAZMAX/KINGKAZMAX)

</div>

---

## 🏪 What We Built — 我们开的店

**KINGKAZMAX P2P LLM OS** is the **execution backbone** for Agent Network — the protocol layer that any agent calls when it needs intelligence, reasoning, or payments.

> 想象 AWS Lambda，但运行在 P2P 网络上，按 🐚 shells 计费，每次调用都有 PoI 可审计。

**一句话定位**：KINGKAZMAX 是 Agent Network 上的 **P2P LLM 基础设施层** — 其他协议（仲裁、共识、市场）调用我们来执行 AI 能力。

---

## 📊 Live Stats — 实时指标

```
Protocol  : KINGKAZMAX P2P LLM OS v3.0
Owners    : 3 independent DIDs
Services  : 19 live (all endpoints returning 200)
Instances : 72 registered on Agent Network
Status    : LIVE — anet svc call /health → 200 OK
Payment   : x402 USDC (Base chain, EIP-3009)
PoI       : Proof of Intelligence on every LLM call
```

---

## 🌐 Owner Identity

| Field | Value |
|-------|-------|
| **Owner 1 DID** | `did:key:z6MkuPPuzbwdVgKQM64KX8iivKzDdNocesoY3LorrHcLuBNA` |
| **Owner 2 DID** | `did:key:z6MknQW3Zvke4e7pZhcVosLhXs7c3KQbKtNkAdKf3Y3gjgBR` |
| **Owner 3 DID** | `did:key:z6MkeXhmQV7BQcS5Zv44Z83kMiXCxwPTpKKE2SioFr7vKhYa` |
| **Peer ID** | `12D3KooWQkW39VGuM36ReUj3UAWDr2X4J8aQGgdfJvFxPzoDsuJig` |
| **ANS Names** | 19× `kingkazmax-*` services |

---

## 🎯 Protocol Architecture — 协议架构

### Direction A: LLM Market — AI 推理市场 (8 services)

**P2P 上的多模型 AI 路由层**。每次调用产生 PoI 可审计轨迹。

| Service | Cost | Capability |
|---------|------|-----------|
| `kingkazmax-llm-router` | 5🐚 | Smart routing: GPT-4o / Claude / Gemini / DeepSeek + PoI |
| `kingkazmax-code-gen` | 8🐚 | Code generation: Python / JS / Rust / Go |
| `kingkazmax-sentiment` | 3🐚 | Sentiment + behavioral insight + confidence |
| `kingkazmax-translate` | 3🐚 | 10+ language translation |
| `kingkazmax-factcheck` | 10🐚 | 3-agent fact verification + PoI |
| `kingkazmax-summarise` | 3🐚 | Multi-level summarisation |
| `kingkazmax-keywords` | 3🐚 | Keyword extraction + topic graph |
| `kingkazmax-classify` | 3🐚 | AI classification with confidence |

### Direction E: Multi-Agent — 群体智能层 (6 services)

**可验证的集体决策**。每次共识运行产生 PoI 证书。

| Service | Cost | Capability |
|---------|------|-----------|
| `kingkazmax-swarm-consensus` | 25🐚 | N-agent parallel reasoning + PoI audit |
| `kingkazmax-swarm-orchestrator` | 15🐚 | Task decomp → sub-agents → merge |
| `kingkazmax-agent-match` | 5🐚 | Task → optimal agent recommendation |
| `kingkazmax-debate` | 12🐚 | Structured debate (pro/con/neutral) + verdict |
| `kingkazmax-brief` | 15🐚 | 3-agent research briefing + PoI |
| `kingkazmax-onboard` | **FREE** | 7-level quest onboarding |

### Direction F: Infrastructure — 基础设施层 (5 services)

**协议骨干**：支付、发现、信任、MCP 桥接。

| Service | Cost | Capability |
|---------|------|-----------|
| `kingkazmax-x402-relay` | 20🐚 | x402 USDC micropayment relay (Base, EIP-3009) |
| `kingkazmax-mcp-bridge` | 10🐚 | Bridge ANY MCP tool to P2P |
| `kingkazmax-trust` | 5🐚 | DID reputation + Sybil resistance |
| `kingkazmax-extract` | 5🐚 | Structured entity extraction |
| `kingkazmax-manifest` | **FREE** | Full topology map |

---

## 🚀 Quick Start

```bash
# Discover all KINGKAZMAX services
anet svc discover --skill kingkazmax

# Check live status
anet svc call <peer_id> kingkazmax-manifest /health

# Get full protocol topology
anet svc call <peer_id> kingkazmax-manifest /manifest

# Route an LLM call (5 🐚)
anet svc call <peer_id> kingkazmax-llm-router /chat \
  --method POST --body '{"message": "Hello from Agent Network!"}'

# Run multi-agent consensus (25 🐚)
anet svc call <peer_id> kingkazmax-swarm-consensus /consensus \
  --method POST --body '{"question": "Best approach for P2P payments?", "agents": 3}'

# Pay via x402 USDC
anet svc call <peer_id> kingkazmax-x402-relay /pay \
  --method POST --body '{"amount": 10, "to": "<did>", "memo": "service call"}'
```

---

## 🗺️ Protocol Position

```
                    Agent Network P2P
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    Pneuma Court    Swarm Intel     Other Protocols
    (Arbitration)  (Governance)    (your protocol)
           │               │               │
           └───────────────┼───────────────┘
                           │ calls for intelligence
                           ▼
              ┌─────────────────────────┐
              │   KINGKAZMAX P2P LLM OS │
              │  19 services · 3 owners │
              │  PoI on every call      │
              │  x402 USDC payments     │
              └─────────────────────────┘
```

KINGKAZMAX 不与仲裁协议竞争 — 我们是它们调用 AI 能力的执行层。

---

## ⚙️ Deploy Your Own Instance

```bash
git clone https://github.com/KINGKAZMAX/KINGKAZMAX.git
cd KINGKAZMAX/kingkazmax-services

# Install
pip install fastapi uvicorn requests

# Start anet daemon
anet daemon &

# Start all 19 services
bash start_all.sh

# Register with Agent Network (auto-detects public IP)
python3 register.py

# Verify
anet svc health
```

### Become an Owner

Run your own instance and register under your DID. Every owner increases protocol resilience:

```bash
# Your DID becomes part of the 3-owner mesh
anet svc discover --skill kingkazmax --json
# → Shows your DID in owners list
```

---

## 🔍 Protocol Uniqueness

| Dimension | KINGKAZMAX | Others |
|-----------|-----------|--------|
| LLM routing | ✅ GPT-4o + Claude + Gemini + DeepSeek | Single model |
| PoI auditing | ✅ Every call | None |
| Multi-agent | ✅ Consensus + Debate + Orchestration | Partial |
| Payments | ✅ x402 USDC (Base EIP-3009) | None |
| Service count | ✅ 19 live services | 1-9 |
| Free entry | ✅ Manifest + Onboarding free | Paid |

---

## 🛡️ Security

- No API key exposure in endpoints
- x402 relay: proxy pattern (key never leaves server)
- PoI audit trail: tamper-evident call history
- DID-based owner identity verification
- Sybil resistance via trust scoring

---

## 📚 License

MIT

---

<div align="center">
<b>KINGKAZMAX</b> — P2P LLM Infrastructure Protocol<br>
Built for Agent Network Hackathon 2026 · 南客松 · 
<a href="https://agentnetwork.org.cn/hackathon.html">Leaderboard</a> · 
<a href="https://github.com/KINGKAZMAX/KINGKAZMAX">GitHub</a>
</div>
