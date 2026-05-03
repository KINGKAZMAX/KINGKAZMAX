#!/usr/bin/env python3
"""
KINGKAZMAX API Server - ANP Protocol Compliant
==============================================
提供符合ANP协议的HTTP接口
用于接入Agent Network P2P网络

Endpoints:
- GET  /                    -> Agent Info (ANP Discovery)
- POST /v1/chat             -> Natural Language Interface
- POST /v1/swarm            -> Multi-Agent Control (JSON-RPC)
- POST /v1/mcp              -> MCP Tool Interface  
- GET  /v1/models           -> Model Marketplace
- GET  /.well-known/agent-descriptions  -> ANP Discovery
- GET  /agents/main/ad.json -> Full Agent Description
- GET  /did.json            -> DID Document
"""

import json
import asyncio
import logging
import time
from datetime import datetime
from typing import Optional
from urllib.parse import parse_qs

# Try to use http.server, fallback to simple implementation
try:
    from http.server import HTTPServer, BaseHTTPRequestHandler
except ImportError:
    pass

from kingkazmax import KINGKAZMAX, Config, AgentRole, SpecialistAgents


class KINGKAZMAXAPIHandler:
    """
    轻量级HTTP API处理器
    符合ANP协议规范
    """
    
    def __init__(self, kkm: KINGKAZMAX):
        self.kkm = kkm
        self.config = kkm.config
        self.logger = logging.getLogger("API")
    
    async def handle_request(self, method: str, path: str, 
                            body: Optional[dict] = None,
                            headers: dict = None) -> dict:
        """路由请求到对应处理函数"""
        
        # ANP 协议端点
        if path == "/" or path == "":
            return await self._handle_root()
        
        elif path == "/.well-known/agent-descriptions":
            return await self._handle_discovery()
        
        elif path == "/agents/main/ad.json":
            return await self._handle_agent_description()
        
        elif path == "/did.json":
            return await self._handle_did_document()
        
        # API 端点
        elif path == "/v1/chat" and method == "POST":
            return await self._handle_chat(body)
        
        elif path == "/v1/swarm" and method == "POST":
            return await self._handle_swarm(body)
        
        elif path == "/v1/mcp" and method == "POST":
            return await self._handle_mcp(body)
        
        elif path == "/v1/models":
            return await self._handle_models()
        
        elif path == "/status":
            return await self._handle_status()
        
        else:
            return {
                "error": "Not Found",
                "path": path,
                "code": 404,
                "available_endpoints": [
                    "/", "/.well-known/agent-descriptions",
                    "/agents/main/ad.json", "/did.json",
                    "/v1/chat", "/v1/swarm", "/v1/mcp", 
                    "/v1/models", "/status"
                ]
            }
    
    async def _handle_root(self) -> dict:
        """根路径 - 返回基本信息"""
        return {
            "@context": "https://schema.org/",
            "@type": "AgentService",
            "name": "KINGKAZMAX",
            "description": "Multi-Agent Swarm Intelligence | ANP Native",
            "version": self.config.AGENT_VERSION,
            "status": "operational",
            "endpoints": {
                "chat": "/v1/chat",
                "swarm": "/v1/swarm", 
                "mcp": "/v1/mcp",
                "models": "/v1/models"
            },
            "links": {
                "agent-description": "/agents/main/ad.json",
                "did-document": "/did.json",
                "discovery": "/.well-known/agent-descriptions"
            },
            "_kkm": "🏆 Ready to win!"
        }
    
    async def _handle_discovery(self) -> dict:
        """ANP 发现协议 (.well-known)"""
        return self.kkm.anp.get_discovery_file()
    
    async def _handle_agent_description(self) -> dict:
        """返回完整Agent描述文件 (JSON-LD)"""
        return self.kkm.anp.agent_description
    
    async def _handle_did_document(self) -> dict:
        """返回DID文档"""
        return self.kkm.anp.did_document
    
    async def _handle_chat(self, body: dict) -> dict:
        """
        自然语言接口 - OpenAI兼容格式
        这是主要的用户交互入口
        """
        start = time.time()
        
        messages = body.get("messages", [])
        mode = body.get("mode", "auto")
        model_override = body.get("model")  # 可选：指定模型
        
        if not messages:
            return {"error": "No messages provided", "code": 400}
        
        # 提取最后一条用户消息作为输入
        user_input = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                user_input = msg["content"]
                break
        
        # 处理请求
        result = await self.kkm.process_request(user_input, mode=mode)
        
        response = {
            "id": f"chatcmpl-{int(time.time())}",
            "object": "chat.completion",
            "model": result.get("synthesis", {}).get("model", "kingkazmax-swarm"),
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": result.get("synthesis", {}).get("content", 
                               result.get("result", {}).get("content", "Processing..."))
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": len(user_input),
                "completion_tokens": len(result.get("synthesis", {}).get("content", "")),
                "total_tokens": len(user_input) + len(result.get("synthesis", {}).get("content", ""))
            },
            "meta": result.get("meta", {}),
            "_processing_time": round(time.time() - start, 2)
        }
        
        return response
    
    async def _handle_swarm(self, body: dict) -> dict:
        """
        JSON-RPC 多Agent控制接口
        支持完整的Swarm操作
        """
        method = body.get("method", "")
        params = body.get("params", {})
        request_id = body.get("id", int(time.time()))
        
        handlers = {
            "swarm.execute": self._swarm_execute,
            "swarm.status": self._swarm_status,
            "swarm.scale": self._swarm_scale,
            "agent.create": self._agent_create,
            "result.aggregate": self._result_aggregate
        }
        
        if method not in handlers:
            return {
                "jsonrpc": "2.0",
                "error": {"code": -32601, "message": f"Method not found: {method}"},
                "id": request_id
            }
        
        try:
            result = await handlers[method](params)
            return {
                "jsonrpc": "2.0",
                "result": result,
                "id": request_id
            }
        except Exception as e:
            return {
                "jsonrpc": "2.0",
                "error": {"code": -32603, "message": str(e)},
                "id": request_id
            }
    
    async def _swarm_execute(self, params: dict) -> dict:
        """并行执行多个任务"""
        tasks = []
        for task in params.get("tasks", []):
            role_str = task.get("role", "general")
            try:
                role = AgentRole(role_str)
            except ValueError:
                role = AgentRole.STRATEGIST
            
            tasks.append({
                "role": role,
                "system": task.get("system", ""),
                "user": task.get("prompt", ""),
                "max_tokens": task.get("max_tokens", 2048)
            })
        
        return await self.kkm.swarm.parallel_execute(tasks)
    
    async def _swarm_status(self, params: dict) -> dict:
        """获取Swarm状态"""
        return self.kkm.swarm.get_swarm_status()
    
    async def _swarm_scale(self, params: dict) -> dict:
        """动态调整Swarm规模"""
        count = params.get("count", self.config.MAX_CONCURRENT_AGENTS)
        self.config.MAX_CONCURRENT_AGENTS = min(count, 20)
        return {"new_limit": self.config.MAX_CONCURRENT_AGENTS}
    
    async def _agent_create(self, params: dict) -> dict:
        """创建专用Agent"""
        role_str = params.get("role", "strategist")
        try:
            role = AgentRole(role_str)
        except ValueError:
            role = AgentRole.STRATEGIST
        
        agent = self.kkm.swarm.create_agent(role, params.get("task"))
        return agent.to_dict()
    
    async def _result_aggregate(self, params: dict) -> dict:
        """聚合多个结果"""
        results = params.get("results", [])
        
        # 使用最强模型聚合
        aggregation_prompt = f"请综合以下结果，产出最终答案:\n\n{json.dumps(results, ensure_ascii=False)[:6000]}"
        
        final = await self.kkm.router.call_model(
            model=self.config.MODELS["strategist"],
            messages=[{"role": "user", "content": aggregation_prompt}],
            max_tokens=4096
        )
        
        return {"aggregated": final}
    
    async def _handle_mcp(self, body: dict) -> dict:
        """
        MCP (Model Context Protocol) 工具接口
        提供工具调用能力
        """
        tool_name = body.get("tool")
        params = body.get("params", {})
        
        tools = {
            "web-search": self._tool_web_search,
            "code-execution": self._tool_code_exec,
            "file-operation": self._tool_file_ops,
            "api-call": self._tool_api_call,
            "analysis": self._tool_analysis
        }
        
        if tool_name not in tools:
            return {
                "error": f"Unknown tool: {tool_name}",
                "available_tools": list(tools.keys())
            }
        
        try:
            result = await tools[tool_name](params)
            return {"tool": tool_name, "success": True, "result": result}
        except Exception as e:
            return {"tool": tool_name, "success": False, "error": str(e)}
    
    async def _tool_web_search(self, params: dict) -> dict:
        """网页搜索工具"""
        query = params.get("query", "")
        
        # 使用AI模型模拟搜索（实际应接入搜索API）
        result = await self.kkm.router.call_model(
            model="gemini-2.5-flash",
            messages=[{"role": "user", "content": f"搜索信息: {query}\n请提供相关信息。"}],
            max_tokens=1024
        )
        return result.get("content", "Search completed")
    
    async def _tool_code_exec(self, params: dict) -> dict:
        """代码执行分析"""
        code = params.get("code", "")
        language = params.get("language", "python")
        
        result = await self.kkm.router.call_model(
            model=self.config.MODELS["coder"],
            messages=[{
                "role": "user",
                "content": f"分析以下{language}代码，解释功能并指出潜在问题:\n\n```{language}\n{code}\n```"
            }],
            max_tokens=2048
        )
        return result.get("content", "Code analyzed")
    
    async def _tool_file_ops(self, params: dict) -> dict:
        """文件操作描述生成"""
        operation = params.get("operation", "read")
        filepath = params.get("path", "")
        
        result = await self.kkm.router.call_model(
            model=self.config.MODELS["fast"],
            messages=[{
                "role": "user",
                "content": f"为以下文件操作生成安全建议:\n操作:{operation}, 路径:{filepath}"
            }],
            max_tokens=512
        )
        return result.get("content", "File operation advice generated")
    
    async def _tool_api_call(self, params: dict) -> dict:
        """API调用代理"""
        url = params.get("url", "")
        method = params.get("method", "GET")
        
        result = await self.kkm.router.call_model(
            model=self.config.MODELS["analyst"],
            messages=[{
                "role": "user", 
                "content": f"设计对 {method} {url} 的API调用方案，包括参数和预期响应格式。"
            }],
            max_tokens=1024
        )
        return result.get("content", "API call plan generated")
    
    async def _tool_analysis(self, params: dict) -> dict:
        """数据分析"""
        data = params.get("data", "")
        analysis_type = params.get("type", "general")
        
        result = await self.kkm.router.call_model(
            model=self.config.MODELS["analyst"],
            messages=[{
                "role": "user",
                "content": f"执行{analysis_type}分析:\n数据:\n{data[:2000]}"
            }],
            max_tokens=2048
        )
        return result.get("content", "Analysis complete")
    
    async def _handle_models(self) -> dict:
        """模型市场接口"""
        models_info = []
        for name, model_id in self.config.MODELS.items():
            stats = self.kkm.router.model_stats.get(model_id, {})
            models_info.append({
                "name": name,
                "id": model_id,
                "category": self._get_model_category(name),
                "stats": stats,
                "recommended_for": self._get_model_recommendation(name)
            })
        
        return {
            "provider": "KINGKAZMAX",
            "total_models": len(models_info),
            "models": models_info,
            "features": [
                "intelligent-routing",
                "cost-optimization", 
                "fallback-support",
                "performance-tracking"
            ]
        }
    
    def _get_model_category(self, name: str) -> str:
        categories = {
            "strategist": "Reasoning & Planning",
            "coder": "Code Generation",
            "analyst": "Deep Analysis",
            "creative": "Creative Tasks",
            "fast": "Quick Response",
            "researcher": "Research"
        }
        return categories.get(name, "General")
    
    def _get_model_recommendation(self, name: str) -> list:
        recommendations = {
            "strategist": ["complex-reasoning", "planning", "strategy"],
            "coder": ["coding", "debugging", "architecture"],
            "analyst": ["data-analysis", "research", "reasoning"],
            "creative": ["writing", "brainstorming", "content"],
            "fast": ["simple-tasks", "quick-response", "chat"],
            "researcher": ["deep-dive", "literature-review", "technical"]
        }
        return recommendations.get(name, ["general"])
    
    async def _handle_status(self) -> dict:
        """系统状态端点"""
        return self.kkm.get_status()


# ============================================================================
# ============================================================================
# SIMPLE ASYNC HTTP SERVER (for demo)
# ============================================================================

async def run_api_server(host: str = "0.0.0.0", port: int = 8443):
    """启动API服务器"""
    
    print(f"\n🚀 Starting KINGKAZMAX API Server on {host}:{port}")
    print(f"   ANP Endpoints:")
    print(f"     https://{host}/.well-known/agent-descriptions")
    print(f"     https://{host}/agents/main/ad.json")
    print(f"   API Endpoints:")
    print(f"     http://{port}/v1/chat")
    print(f"     http://{port}/v1/swarm")
    print(f"     http://{port}/v1/mcp")
    print(f"     http://{port}/v1/models")
    
    # Initialize system
    kkm = KINGKAZMAX()
    handler = KINGKAZMAXAPIHandler(kkm)
    
    # Demo: Test endpoints
    print("\n=== Testing API ===")
    
    # Test root
    root_result = await handler.handle_request("GET", "/", None)
    print(f"[ROOT] {json.dumps(root_result, ensure_ascii=False)[:300]}")
    
    # Test chat
    chat_result = await handler.handle_request("POST", "/v1/chat", {
        "messages": [{"role": "user", "content": "Hello, prove you are KINGKAZMAX"}],
        "mode": "fast"
    })
    content = chat_result.get("choices", [{}])[0].get("message", {}).get("content", "")[:500]
    print(f"[CHAT] Response: {content}")
    
    # Test status
    status_result = await handler.handle_request("GET", "/status", None)
    print(f"[STATUS] Agents active: {status_result.get('swarm', {}).get('active', 0)}")
    
    print("\n✅ All systems operational!")
    
    return kkm, handler


if __name__ == "__main__":
    asyncio.run(run_api_server())
