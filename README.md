<div align="center">

# 👑 KINGKAZMAX Product Suite

### Agent Network P2P 黑客松参赛项目

**19个P2P微服务 · 3大产品方向 · 完整AI服务市场**

[![Agent Network](https://img.shields.io/badge/Agent-Network-blue)](https://agentnetwork.org.cn)
[![Services](https://img.shields.io/badge/Services-19-green)](#-服务矩阵)
[![DID](https://img.shields.io/badge/DID-decentralized-purple)](#-身份信息)

</div>

---

## 🏪 我们开的店

**KINGKAZMAX** 是Agent Network上最大的AI服务产品套件，提供19个经过真实LLM赋能的P2P微服务，覆盖从基础NLP到多智能体协作的完整链路。

我们的理念：**每一个AI能力都应该是P2P可交易的**。就像App Store让手机功能可以分发，KINGKAZMAX让AI能力可以在Agent Network上被发现、调用、付费。

## 🆔 身份信息

| 字段 | 值 |
|------|-----|
| **DID** | `did:key:z6MkuPPuzbwdVgKQM64KX8iivKzDdNocesoY3LorrHcLuBNA` |
| **Peer ID** | `12D3KooWQkW39VGuM36ReUj3UAWDr2X4J8aQGgdfJvFxPzoDsuJi` |
| **ANS Names** | 19个 `kingkazmax-*` 服务名 |
| **LLM Backend** | OpenAI 兼容 API |

## 📊 服务矩阵

### Direction A: LLM Market — AI能力即服务 (8 services)

| # | 服务 | 端口 | 费用 | 描述 |
|---|------|------|------|------|
| 1 | `kingkazmax-llm-router` | 9001 | 5🐚/call | 多LLM智能路由 + PoI审计追踪 |
| 2 | `kingkazmax-code-gen` | 9007 | 8🐚/call | 多语言代码生成 (Python/JS/Rust/Go) |
| 3 | `kingkazmax-sentiment` | 9008 | 3🐚/call | 情感分析 + 置信度评分 |
| 4 | `kingkazmax-translate` | 9009 | 3🐚/call | 10+语言实时翻译 |
| 5 | `kingkazmax-factcheck` | 9010 | 10🐚/call | 3轮交叉验证事实核查 |
| 6 | `kingkazmax-summarise` | 9011 | 3🐚/call | 多级摘要 (简/中/详) |
| 7 | `kingkazmax-keywords` | 9018 | 3🐚/call | 关键词提取 + 权重排序 |
| 8 | `kingkazmax-classify` | 9019 | 3🐚/call | 多标签文本分类 |

### Direction E: Multi-Agent Collaboration — 群智协作 (6 services)

| # | 服务 | 端口 | 费用 | 描述 |
|---|------|------|------|------|
| 9 | `kingkazmax-swarm-consensus` | 9002 | 25🐚/call | N-agent并行推理 + PoI共识证明 |
| 10 | `kingkazmax-swarm-orchestrator` | 9003 | 15🐚/call | 任务分解→子agent→结果合并 |
| 11 | `kingkazmax-agent-match` | 9005 | 5🐚/call | 智能任务-Agent匹配引擎 |
| 12 | `kingkazmax-debate` | 9012 | 12🐚/call | 多视角辩论场 (正方/反方/裁判) |
| 13 | `kingkazmax-onboard` | 9014 | **免费** | 5级新手任务系统 + 奖励 |
| 14 | `kingkazmax-brief` | 9016 | 15🐚/call | 3层深度研究简报 |

### Direction F: Infrastructure & Payment — 基础设施 (5 services)

| # | 服务 | 端口 | 费用 | 描述 |
|---|------|------|------|------|
| 15 | `kingkazmax-mcp-bridge` | 9004 | 10🐚/call | MCP工具P2P化网关 |
| 16 | `kingkazmax-x402-relay` | 9006 | 20🐚/call | x402 USDC真实支付通道 |
| 17 | `kingkazmax-manifest` | 9013 | **免费** | 产品套件拓扑发现 |
| 18 | `kingkazmax-trust` | 9015 | 5🐚/call | 去中心化信誉评分系统 |
| 19 | `kingkazmax-extract` | 9017 | 5🐚/call | 结构化数据提取管道 |

## 🚀 快速开始

### 前置要求
- Python 3.9+
- [anet CLI](https://agentnetwork.org.cn) v1.1+
- OpenAI兼容API (或设置`OPENAI_API_KEY`)

### 启动所有服务
```bash
# 克隆仓库
git clone https://github.com/KINGKAZMAX/KINGKAZMAX.git
cd KINGKAZMAX/kingkazmax-services

# 启动anet daemon
anet daemon &
sleep 3

# 启动所有19个服务
bash start_all.sh

# 注册到Agent Network
python3 register.py
```

### 调用示例
```bash
# 查看服务拓扑
curl http://127.0.0.1:9013/manifest

# 情感分析
curl -X POST http://127.0.0.1:9008/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This hackathon is amazing!"}'

# 多agent辩论
curl -X POST http://127.0.0.1:9012/debate \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI should be open source", "rounds": 3}'

# P2P发现
anet lookup kingkazmax
```

## 🏗️ 架构设计

```
                    ┌─────────────────────┐
                    │   Agent Network P2P │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   anet daemon (DID) │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼────┐          ┌─────▼─────┐         ┌─────▼─────┐
   │LLM Market│          │Multi-Agent│         │Infra & Pay│
   │ 8 svcs   │          │ 6 svcs    │         │ 5 svcs    │
   └────┬─────┘          └─────┬─────┘         └─────┬─────┘
        │                      │                      │
   ┌────▼─────┐          ┌─────▼──────┐        ┌─────▼──────┐
   │OpenAI API│          │Swarm Engine│        │x402 + MCP  │
   └──────────┘          └────────────┘        └────────────┘
```

## 💡 核心亮点

1. **最大产品套件**: 19个服务，覆盖3大方向，是Agent Network上服务数最多的参赛者
2. **真实LLM赋能**: 每个服务都有OpenAI API支撑，不是空壳mock
3. **x402真支付**: kingkazmax-x402-relay实现USDC真实支付通道
4. **PoI审计**: swarm-consensus服务生成Proof of Intelligence共识证明
5. **免费入口**: manifest和onboard服务免费开放，降低发现和试用门槛
6. **新手友好**: 5级onboard任务系统引导新用户

## 🤝 参与贡献

我们欢迎其他Agent Network参与者复制和运营我们的服务模板！多owner = 更高可用性 = 更好评分。

```bash
# 复制我们的服务模板
cp kingkazmax-services/services/your_service.py your_service.py
# 修改DID和端口，注册到你自己的anet daemon
# 你就是kingkazmax服务的第二个owner！
```

## 📜 License

MIT

---

<div align="center">
<b>KINGKAZMAX</b> — 让AI能力在P2P网络中自由流动 👑
</div>
