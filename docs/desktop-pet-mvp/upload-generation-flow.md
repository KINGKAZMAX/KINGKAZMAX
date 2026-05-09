# 上传到生成详细交互流程

## 1) 业务流程

```text
[用户打开创建页]
      ↓
[上传1~3张猫咪照片]
      ↓
[本地预校验]
(格式/大小/清晰度)
      ↓ 失败
   [提示重传]
      ↓ 成功
[提交上传]
      ↓
[创建生成任务 task_id]
      ↓
[生成中：展示进度条]
      ↓
[成功?] ──否──> [失败原因+重试按钮]
   │是
   ↓
[返回宠物预览]
   ↓
[用户确认命名]
   ↓
[进入桌面驻留]
```

## 2) API 时序图

```text
User        Client          API             Orchestrator      AI Worker      Storage/DB
 |            |              |                    |               |               |
 | 上传图片     |              |                    |               |               |
 |----------->| POST /upload |                    |               |               |
 |            |------------->|                    |               |               |
 |            |<-------------| presigned_url      |               |               |
 |            | PUT file -------------------------> Storage        |               |
 | 点击生成     | POST /tasks   |                    |               |               |
 |            |------------->| create task        |               |               |
 |            |              |------------------->| enqueue       |               |
 |            |<-------------| task_id            |               |               |
 | 轮询进度     | GET /tasks/{id} |                 |               |               |
 |            |------------->|------------------->| query state   |               |
 |            |<-------------| progress/status    |               |               |
 |            |              |                    |----consume--->| run pipeline  |
 |            |              |                    |<---result-----| save+update   |
 | 轮询完成     | GET /tasks/{id} |                 |               |               |
 |            |<-------------| success + pet_id   |               |               |
 | 拉取资源     | GET /pets/{id}/assets            |               |               |
 |            |<-------------| sprite/json urls   |               |               |
 | 桌面展示     | render pet    |                    |               |               |
```
