# KINGKAZMAX Product Suite — Agent Network Hackathon

## 🏆 比赛目标：第一名

### 当前部署状态
- **18个服务** 全部在线 + ANS注册 ✅
- **DID**: `did:key:z6MkuPPuzbwdVgKQM64KX8iivKzDdNocesoY3LorrHcLuBNA`
- **Peer ID**: `12D3KooWQkW39VGuM36ReUj3UAWDr2X4J8aQGgdfJvFxPzoDsuJi`
- **API**: `https://api.openai-next.com` (OpenAI兼容)

### 服务矩阵 (18 services)

#### Direction A: LLM Market (8 services)
| Service | Port | Cost | Description |
|---------|------|------|-------------|
| kingkazmax-llm-router | 9001 | 5🐚 | 多LLM路由 + PoI审计 |
| kingkazmax-code-gen | 9007 | 8🐚 | 多语言代码生成 |
| kingkazmax-sentiment | 9008 | 3🐚 | 情感分析 + 置信度 |
| kingkazmax-translate | 9009 | 3🐚 | 10语言翻译 |
| kingkazmax-factcheck | 9010 | 10🐚 | 3轮事实核验 |
| kingkazmax-summarise | 9011 | 3🐚 | 多级摘要 |
| kingkazmax-keywords | 9018 | 3🐚 | 关键词提取 |
| kingkazmax-classify | 9019 | 3🐚 | 文本分类 |

#### Direction E: Multi-Agent Collaboration (6 services)
| Service | Port | Cost | Description |
|---------|------|------|-------------|
| kingkazmax-swarm-consensus | 9002 | 25🐚 | N-agent并行推理 + PoI |
| kingkazmax-swarm-orchestrator | 9003 | 15🐚 | 任务分解→子agent→合并 |
| kingkazmax-agent-match | 9005 | 5🐚 | 任务-agent匹配 |
| kingkazmax-debate | 9012 | 12🐚 | 多视角辩论场 |
| kingkazmax-onboard | 9014 | 免费 | 5级新手任务系统 |
| kingkazmax-brief | 9016 | 15🐚 | 3层研究简报 |

#### Direction F: Infrastructure & Payment (5 services)
| Service | Port | Cost | Description |
|---------|------|------|-------------|
| kingkazmax-mcp-bridge | 9004 | 10🐚 | MCP工具P2P化 |
| kingkazmax-x402-relay | 9006 | 20🐚 | x402 USDC支付通道 |
| kingkazmax-manifest | 9013 | 免费 | 产品套件拓扑 |
| kingkazmax-trust | 9015 | 5🐚 | 去中心化信誉评分 |
| kingkazmax-extract | 9017 | 5🐚 | 数据提取管道 |

### 竞争分析 (5月2日快照)
| 排名 | 团队 | 服务数 | Owners | 优势 |
|------|------|--------|--------|------|
| 1 | Pneuma Court | 9 | 8 | 去中心化复制+USDC支付 |
| 2 | Swarm Intelligence | 7 | 7 | 协议级共识审计 |
| 3 | Swarm Memory Hive | 9 | 9 | 最大服务数+共享记忆 |
| 4 | Tide Product Suite | 8 | 1 | 最像创业公司 |
| - | **KINGKAZMAX** | **18** | **1** | **最大产品套件** |

### 评分机制关键因素
1. **可用性**: 多owner复制 = 高可用 → 我们需要让其他DID复制我们的服务
2. **商业潜力**: x402 USDC真支付通道 → 已有 ✅
3. **市场价值**: 解决真实问题 → 全部有真实LLM支撑 ✅
4. **IDG锐评**: 产品线叙事、完整度 → 18服务覆盖3方向 ✅

### 当前弱点 & 改进方向
1. ⚠️ **单owner** — 最大风险。需要让其他开发者复制我们的服务模板
2. 📝 **排行榜未更新** — 5月2日快照，下次更新应能看到我们
3. 💡 **下一步**: 发布服务模板到GitHub，鼓励社区复制

### 快速操作
```bash
# 启动所有服务
bash /Users/mekzenx2/WorkBuddy/Claw/kingkazmax-services/start_all.sh

# 注册到ANS
cd /Users/mekzenx2/WorkBuddy/Claw/kingkazmax-services && python3 register.py

# 检查网络状态
~/.local/bin/anet status

# 查看已注册服务
~/.local/bin/anet svc list
```
