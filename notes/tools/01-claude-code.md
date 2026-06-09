---
layout: "note"
nav: "notes"
title: "Claude Code"
course: "TOOLS"
course_title: "开发工具"
course_url: "/notes/tools/"
chapter: "01"
permalink: "/notes/tools/01-claude-code/"
tags: ["notes", "tools", "claude-code", "ai-coding"]
description: "开发工具：Claude Code"
date: "2026-06-09 10:05:00 +0800"
archive: true
search: true
toc:
  - id: claude-code-query-engine
    label: "查询引擎"
  - id: claude-code-tool-executor
    label: "工具系统"
  - id: claude-code-context-manager
    label: "上下文管理"
  - id: claude-code-multi-agent
    label: "多 Agent 编排"
  - id: claude-code-memory
    label: "持久化记忆"
  - id: claude-code-mcp
    label: "MCP 集成"
  - id: claude-code-plugins-skills
    label: "插件与技能"
---

## 查询引擎Query Engine
{: #claude-code-query-engine }

只在会话开始时创建，多轮对话期间维护轮次状态

- 范围
    - 引擎配置
        - 工作目录
        - 工具列表
        - 命令列表
        - MCP连接数组
        - 可通过工具调用的子Agent列表
        - 工具权限函数，记录用户拒绝的操作
        - 获取当前应用状态快照getter/setter（工具权限、Fast mode、文件历史、归因状态等），用于在每轮开始时捕获初始状态
        - 初始消息历史，用于恢复已有会话，而不是从空白开始（可选）
        - 文件状态缓存实例操作接口，记录已读文件的元数据（修改时间、大小、内容哈希），避免重复读取未变化的文件
        - 自定义系统提示，如果提供会**完全替换**默认系统提示，并触发记忆机制提示的加载（可选）
        - 追加到系统提示末尾的额外指令（CLAUDE.md）（可选）
        - 用户选择模型ID（可选）
        - 备用模型ID（可选）
        - 思考模式配置（可选）
        - 最大工具轮次（可选）
        - 最大token消耗（可选）
        - 自定义结构化输出格式，自动重试（可选）
        - 启用调试（可选）
        - 是否回放新用户消息（可选）
    - 新对话消息数组
    - 中断信号控制器
    - 用户拒绝的权限操作
    - 会话恢复是否已经处理过拒绝操作的flag，若处理过则跳过，若没处理，则塞一条用户拒绝操作的消息到消息数组里。
    - 会话期间的Usage
    - 已读文件记录缓存（map结构，文件修改失效，基础操作用于多个查询引擎共享）
    - 轮次发现的技能集合
    - 已加载的记忆文件路径集合
    - 代码示例
        
        ```jsx
        interface QueryEngineConfig {
          // ========== 第一层：基础设施（绝对不可变） ==========
          infrastructure: {
            /** 工作目录 - 改变会导致文件路径错乱 */
            readonly cwd: string
            
            /** 文件缓存 - 多个引擎可共享 */
            readonly fileCache: FileStateCache
            
            /** MCP 连接 - 重连需重建引擎 */
            readonly mcpConnections: MCPServerConnection[]
          }
          
          // ========== 第二层：能力注册（会话级不可变） ==========
          capabilities: {
            /** 内置工具集 - 改变会导致历史消息中的工具调用失效 */
            readonly tools: Tool[]
            
            /** 斜杠命令 - 改变会影响命令解析 */
            readonly commands: Command[]
            
            /** 子 Agent - 改变会影响任务委派 */
            readonly agents: AgentDefinition[]
          }
          
          // ========== 第三层：行为策略（会话级可变，需明确标注） ==========
          behavior: {
            /** 最大轮次 - 修改后下一轮生效 */
            maxTurns?: number
            
            /** 预算上限 - 修改后立即生效（需要说明） */
            maxBudgetUsd?: number
            
            /** 思考模式 - 修改后下一轮生效 */
            thinking?: 'adaptive' | 'disabled'
            
            /** 详细日志 - 可随时开关 */
            verbose?: boolean
          }
          
          // ========== 第四层：动态策略（每轮可变的注入行为） ==========
          dynamic: {
            /** 权限检查 - 每次调用动态决策 */
            canUseTool: CanUseToolFn
            
            /** 应用状态 - getter 获取最新快照 */
            getAppState: () => AppState
            setAppState: (updater: (prev: AppState) => AppState) => void
            
            /** 当前轮次使用的输出格式 - 每轮可不同 */
            outputFormat?: JSONSchema
            
            /** 当前轮次使用的模型 - 可动态切换 */
            model?: string
            
            /** 备用模型 - 主模型失败时切换 */
            fallbackModel?: string
          }
          
          // ========== 第五层：会话初始化（一次性参数） ==========
          session: {
            /** 历史消息 - 只在构造时使用，之后会复制到内部状态 */
            initialMessages?: Message[]
            
            /** 自定义系统提示 - 只在构造时生效 */
            customPrompt?: string
            
            /** 追加指令 - 只在构造时生效 */
            appendPrompt?: string
          }
          
          // ========== 第六层：可选回调（无状态行为） ==========
          callbacks: {
            /** URL 引出处理 */
            onElicitation?: (url: string) => Promise<void>
            
            /** 历史裁剪决策 */
            onSnip?: (message: Message, history: Message[]) => Message[] | undefined
            
            /** 用户消息回放（用于 SDK） */
            replayUserMessages?: boolean
          }
        }
        ```
        
- 入口
    - 用户消息
        - uuid
        - 系统消息标记（错误恢复后的消息，不计费）
    - 执行步骤
        - Turn初始化
            - 清理上轮发现的skills
            - 设置工作目录
            - 检查是否需要持久化
            - 记录本轮开始时间
        - Tool Use 包装
            - 调用权限检查，若被拒绝则加入拒绝列表
        - 构建消息上下文
            - 历史消息数组
            - 把引擎内部的方法和变量赋值给输入上下文
        - 组装系统提示词
        - 处理用户输入
            - 用户消息先于query请求持久化，后续端点重续
            - assistant消息异步持久化
        - 初始化query state，进入query loop
        - query event
            - stream event（llm流式回答，前端消费）
            - message（完整的assistant消息、工具消息，前端/账单系统消费）
            - request start（调试/日志消费）
            - summary event（压缩消息，内存/数据库管理）
            - tool summary（工具摘要消息，可观测消费）
        - queryLoop
            - 发送请求到 API
            - 接收流式响应（token by token）
            - 检测到工具调用 -> 暂停流式输出 -> 执行工具 -> 注入结果 -> 继续请求
            - 检测到需要恢复 -> 执行恢复策略 -> 重试
            - 最终完成
        - CheckRecovery
            - 正常路径 (Streaming → Complete)
                - 直接进入 `Streaming`，流式输出结果。当所有内容输出完毕，进入 `Complete`，任务结束。
            - 输出溢出 (Max Output Tokens)
                - 输出token数碰到上限，扩大阈值不修改上下文，并记录重试次数
                - 第二次通过提示词断点重续
            - 输入溢出 (Prompt Too Long / Media Size Error)
                - 第一级，collapse 轻量级压缩，工具调用、早期对话摘要
                - 第二级，reactive compact 重量级压缩，整体压缩包括media type。
                - 带着压缩后的上下文，重新发起请求。
            - 模型不可用 (Model Unavailable/API Error)
                - 切换到备用模型（比如 Claude 3.0）继续任务。
                - API Error优雅退出
            - 工具调用 (CollectToolUses → ExecuteTools → InjectResults)
            - 无工具调用 (EscalateTokens)
                - 等待流式响应，收集是否有工具调用
            - 任务结束 (StopHooks)
                - 任务正常完成，或者遇到无法恢复的错误，触发收尾工作（比如保存日志、更新用户界面状态）。
        - query state
            - 消息数组（快照，由于达到阈值，没完整输出消息，不应改变query engine的消息数组）
            - 工具上下文（权限检查、中断控制器、文件缓存）
            - AutoCompactTracking阈值和已经触发的压缩次数
            - 是否尝试过reactive压缩
            - max output tokens错误的已重试次数
            - max output tokens提高阈值覆盖
            - pending工具摘要
            - 轮次计数
            - 迭代原因，比如max_output_tokens_recovery，
        - query params
            - 消息数组
            - 系统提示词
            - 动态用户上下文
            - 静态系统上下文
            - 权限检查函数
            - 工具执行上下文
            - 降级模型
            - 是否跳过缓存写入（恢复，重试时的提示消息，避免污染缓存时启用）
            - 输出token上限
            - 最大工具调用轮次
            - token预算
            - 真实接口
                - 流式api
                - 执行tool
                - 处理tool result
                - 发送事件
    
    ### **一、 基础数据模型**
    
    引擎的运行依赖于两类核心数据，严格区分了“配置”与“运行时状态”。
    
    **1. 输入配置 (`query params` - 只读/初始化时确定)**
    
    - **上下文拼装**：消息数组、系统提示词、动态用户上下文、静态系统上下文。
    - **安全与执行**：权限检查函数、工具执行上下文、降级模型（如Claude 3.0）。
    - **资源预算**：输出token上限、最大工具调用轮次、Token预算。
    - **底层接口**：流式API、Tool执行器、Tool结果处理器。
    - **特殊标记**：是否跳过缓存写入（用于错误恢复/重试时，防止脏数据污染缓存）。
    
    **2. 运行时状态 (`query state` - 内存中动态变更)**
    
    - **消息快照**：独立的消息数组副本（断点重续时不污染引擎主消息数组）。
    - **容错计数器**：AutoCompact触发次数、是否已尝试reactive压缩、Max Output Tokens重试次数及动态阈值覆盖。
    - **控制流状态**：轮次计数、迭代原因（如 `max_output_tokens_recovery`）、Pending中的工具摘要。
    - **沙箱环境**：工具上下文（权限拦截器、中断控制器、文件缓存）。
    
    ### **二、 标准执行生命周期**
    
    这是引擎在**无错误情况下的理想执行路径**。
    
    1. **Turn 初始化**：清理上轮Skills -> 锁定工作目录 -> 检查持久化需求 -> 打卡计时。
    2. **预处理链路**：
        - `Tool Use 包装`：前置权限拦截，被拒工具加入黑名单。
        - `上下文构建`：拼接历史 + 注入引擎内部变量/方法。
        - `Prompt组装`：融合系统提示词与上下文。
    3. **存储策略（异步与前置）**：
        - 用户消息：**先持久化**，再发起请求（保障断点重续能力）。
        - 助手消息：**异步持久化**（不阻塞流式输出）。
    4. **进入 Query Loop**：将 `query state` 与 `params` 传入，启动循环。
    
    ### **三、 核心状态机**
    
    位于 `queryLoop` 内部，是一个不断接收流式数据并分支判断的过程。
    
    **1. 正常流式输出 (`Streaming → Complete`)**
    
    Token by token 接收，正常结束触发 `StopHooks`（保存日志、更新UI）。
    
    **2. 工具调用分支 (`EscalateTokens` -> `Collect -> Execute -> Inject`)**
    
    - 监听流式数据，收集到工具调用信号后，**立即暂停向用户的流式输出**。
    - 执行工具，将结果注入到上下文中，**重新发起请求**（再次进入 Loop）。
    
    **3. 异常与恢复分支 (`CheckRecovery` 机制)**
    
    这是该引擎最核心的工业级设计，针对四种典型故障有明确的降级策略：
    
    - 🛑 **输出溢出**：
        - 第一次*：仅扩大输出阈值，不改动上下文，原样重试。
        - 第二次*：通过提示词进行断点重续。
    - 🛑 **输入溢出**：
        - 第一级*：轻量级压缩，只处理工具调用和早期摘要。
        - 第二级*：Reactive 重量级压缩，对包括图片/视频在内的全模态上下文进行暴力压缩，然后重试。
    - 🛑 **模型不可用**：无缝切换到降级模型继续任务；若是严重 API Error 则触发优雅退出。
    - 🛑 **无法恢复的错误**：直接跳入 `StopHooks` 收尾。
    
    ### **四、 观测与事件总线**
    
    引擎在运行过程中，通过 `query event` 向外部世界（前端、账单、日志系统）广播状态，实现解耦。
    
    | **事件类型** | **生产者位置** | **消费者** | **作用** |
    | --- | --- | --- | --- |
    | **stream event** | 接收流式响应时 | 前端 UI | 逐字渲染，提升用户体验 |
    | **request start** | Loop 发起 API 请求前 | 调试/日志系统 | 记录请求体，用于全链路追踪 |
    | **message** | 收到完整回复/工具结果时 | 前端/账单系统 | 用于前端最终展示、Token 计费结算 |
    | **tool summary** | 工具执行完毕后 | 可观测系统 | 记录工具耗时、成功率等指标 |
    | **summary event** | 触发 Compact 压缩时 | 内存/DB管理 | 同步压缩后的上下文状态，释放内存 |
- 系统提示词组装
    
    1.静态系统默认提示词（工具描述、安全规范、行为指令）
    
    2.动态用户上下文（kv形式注入工作目录、平台、时间）
    
    3.静态系统上下文（MCP服务器列表）
    
    4.记忆机制操作指令（可选项）
    
    5.CLAUDE.md项目级追加
    

## 工具系统Tool Executor
{: #claude-code-tool-executor }

每个tool use都必须有个tool result，即使用户中断或错误都必须补一个

- Tools
    - File Read/Write/Edit/Glob/Grep Tool
    - AgentTool/SendMessageTool/TeamCreateTool
    - BashTool嵌入式搜索工具时跳过 Glob/Grep(hasEmbeddedSearchTools() )
    - Tool Search/MCP/SKillTool
    - WebFetch/WebSearch Tool
    - TaskCreate/EnterPlanModeTool/ExitPlanModeTool
    - CronCreate/TriggerRemote/SleepTool
- Tool Defination
    - field
        - name
        - search hint
        - input schema(command timeout run in background)
        - max result size
        - process status
    - function
        - call
        - description
        - check permermission
        - is concurrency safe/ is read only / is destructive/ is enabled
        - behavior（cancel/block-后续操作需要用户）
        - validate input
- Tool Result
    - new message
        - user message 模拟后续用户行为
        - assistant message 执行推理步骤
        - attachment message 文件url
        - system message 行为改变提示
    - context modifier 修改后续工具执行的上下文（非并发工具使用）
- Tool Permission Context
    - mode(default、plan、auto、bypass)
    - always (Allow、Ask、Deny) Rules
    - 执行流
        - Hook 预审： 如果配置了 PreToolUse hooks（用户在 `settings.json` 中定义的 shell 命令）。
        - 自动化分类器： 特定于 BashTool，使用分类器自动判断命令是否安全
        - alwaysDeny 规则： 如果工具调用匹配了任何"总是拒绝"规则，直接拒绝。
        - alwaysAllow 规则： 如果工具调用匹配了"总是允许"规则，直接放行。
        - 权限模式检查： 根据当前 `PermissionMode` 决定是否需要用户确认。
        - 交互式对话框： 弹出终端对话框让用户决定。用户可以选择"允许"、"拒绝"或"总是允许此类操作"。选择"总是允许"时，系统会通过 `persistPermissions()` 方法将规则持久化到配置文件中。
- Tool Registry
    - 获取内置工具
    - 获取mcp工具（mcp_serverName_toolName）
    - 根据permission context过滤
    - 去重合并
    - 工具名字排序，缓存稳定性，用于重建系统提示词
- Tool 组装
    - 工具数量阈值判断是选择核心注入其他延迟加载还是全量注入
    - 后续使用ToolSearchTool去搜索工具：精确选择，关键词搜索，前缀匹配
- Tool track
    - tool call id
    - tool block
    - parent assistant message
    - tool status:queued→executing→completed→yielded
    - concurrency safe
    - tool result
    - pending progress
    - tool context modifier
- Tool Execution
    - 工具入队，判断工具是否可执行
        - 查找工具定义
        - 判断并发安全
            - 若当前没有工具执行，直接执行
            - 若当前工具和正在执行的工具都是并发安全，则执行
            - 否则，排队等待
        - 权限系统（安全检查→快速路径→白名单→自动分类器→询问用户）
        - 执行真正的tool cal
        - 进度消息立即发送，工具结果按工具添加顺序发送，保证了并发执行但是给llm的消息是正确的。
    - 执行失败，取消相关影响的工具

## 上下文管理Context Manager
{: #claude-code-context-manager }

- Token 估算
    - (text length)*4/3 用于提前判断是否溢出
    - 纯API精确计算太慢，要等到输出结束
    - 混合方式，先把上轮对话之前的所有对话的assistant中的usage累加，正在处理的user和assistant可以估算。
    - 因为一轮执行是很长的，中间还包括工具调用，每轮工具调用之前进行估算。
- 阈值检测
    - 预留summary token余量=min(max output tokens, reserve for summary~=20000)
    - 计算有效窗口contextWindow-reserve tokens
    - 多级压力显示
        
        
        | **警告阈值** | 阈值 - 20,000 | ~147K | UI 显示黄色警告 |
        | --- | --- | --- | --- |
        | **自动压缩** | 有效窗口 - 13,000 | ~167K | 触发自动压缩流程 |
        | **阻塞限制** | 有效窗口 - 3,000 | ~177K | 阻止发送新消息，强制压缩 |
        | 有效窗口 | - | ~180k | - |
- 压缩策略
    - 第一层
        - Time Based Compact，用户离开会话很久，服务器的prompt cache已经失效，乘机将工具消息直接截断后再重建。
        - Cached MC，客户端内存消息不变，通过发起llm api侧cache edit指令（后续请求也得携带告知服务器端），让服务端缓存变化。这一次指令还是命中缓存的，llm会自动清理它缓存中的工具结果。后续消息虽然缓存失效了，但至少能节省一次。
    - 第二层，Session Memory Compact 不调用API，是由会话过程中，后台持续总结的记忆直接作为摘要+最新几条消息。
        - minTokens保留下限
        - maxTokens保留上限
        - minMessages保留消息下限
    - 第三层，Full Compact 给专门的压缩Agent，提示词如下
        
        ```jsx
        不要使用 Read、Bash、Grep、Glob、Edit、Write 或任何其他工具。
        上面的对话中已经包含了你需要的所有上下文。
        工具调用将被拒绝，并且会浪费你唯一的回合——你将无法完成任务。
        你的整个回复必须是纯文本：一个 <analysis> 块，然后是一个 <summary> 块。
        ```
        
        - 两阶段生成，先让模型在 `<analysis>` 标签中整理思路，然后在 `<summary>` 标签中输出最终摘要。
        - 用户的请求和意图
        - 关键技术概念
        - 文件和代码片段
        - 遇到的错误和修复方法
        - 所有用户消息（非工具结果）
        - 待完成任务
        - 当前进行的工作
        - 可选的下一步
    - Partial Compact，压缩某个message之前/后，前者prompt cache失效
    - 失败重试时，精确丢弃头部消息，直到满足缺口
- 文件缓存
    - LRU缓存，记录文件内容和时间戳；用于压缩后恢复上下文
    - 最多条目数，大小限制；路径规范；预览标志
    - 预压缩文件缓存快照以及记忆文件路径，之后选择性恢复
- 压缩后的上下文
    - 压缩发生位置，系统消息
    - 摘要
    - 近期消息
    - 关键文件
    - Hook Results（CLAUDE.md）

## 多Agent 编排
{: #claude-code-multi-agent }

- Agent Tool
    - 子Agent
        - description
        - prompt
        - sub_agent type
        - model
        - run_in_background
    - team
        - team name
        - sub agent name
        - permission mode
    - isolation
        - work tree
        - cwd
- Agent Allowed Tools
    - FILE_READ_TOOL_NAME、FILE_EDIT_TOOL_NAME、FILE_WRITE_TOOL_NAME
    - WEB_SEARCH_TOOL_NAME、WEB_FETCH_TOOL_NAME
    - TODO_WRITE_TOOL_NAME
    - GREP_TOOL_NAME、GLOB_TOOL_NAME、SHELL_TOOL_NAMES
    - SKILL_TOOL_NAME、TOOL_SEARCH_TOOL_NAME
    - SYNTHETIC_OUTPUT_TOOL_NAME
    - ENTER_WORKTREE_TOOL_NAME、EXIT_WORKTREE_TOOL_NAME

## 持久化记忆
{: #claude-code-memory }

- Memory.md
    - 用户记忆(user)
        - 保存时机：当了解到用户的角色、偏好、职责或知识领域时。
        - 使用场景：当工作需要根据用户画像来调整时。比如用户问你解释某段代码，你应该根据他们的背景知识来选择解释的深度和角度。
    - 行为指导(feedback)
        - 保存时机：用户纠正你的做法，或确认一个非显而易见的做法可行。
        - 内容结构：先写规则本身，然后写用户给出的原因，再写这条规则在什么场景生效。
    - 项目动态(project)
        - 记录关于正在进行的工作、目标、Bug、事故的信息——这些是无法从代码或 git 历史推导出来的。
        - 保存时机：了解到谁在做什么、为什么、截止日期是什么。注意要将相对日期转为绝对日期，让记忆在时间流逝后仍可理解。
    - 外部资源指针(reference)
        - 存储指向外部系统中信息位置的指针
- 格式

{% raw %}
```yaml
---
name: {{记忆名称}}
description: {{一行描述——用于在未来对话中判断相关性，所以要具体}}
type: {{user, feedback, project, reference}}
---

{{记忆内容——feedback/project 类型建议结构化为：规则/事实 + **Why:** + **How to apply:**}}
```
{% endraw %}

## MCP集成
{: #claude-code-mcp }

## 插件与技能
{: #claude-code-plugins-skills }
