---
layout: "note"
nav: "notes"
title: "Kafka"
course: "MQ"
course_title: "消息队列"
course_url: "/notes/mq/"
chapter: "01"
permalink: "/notes/mq/01-kafka/"
tags: ["notes", "mq", "kafka", "message-queue"]
description: "消息队列：Kafka"
date: "2026-06-09 10:04:00 +0800"
archive: true
search: true
---

## 1. 先建立整体画面：Kafka 是什么？解决什么问题？

- Kafka 是一个分布式消息系统，常见用途包括：解耦、削峰填谷、异步处理、日志/事件流（Event Streaming）。
- 你可以把它理解为：生产者把消息写进 Topic，消费者从 Topic 里按顺序读消息。

## 2. 两种常见使用模型

### 2.1 点对点（“任务队列”）

- 一个 Topic 的消息最终只会被同一个消费者组（同一个业务服务的一组实例）处理一次。

### 2.2 发布-订阅（“广播”）

- 多个不同消费者组可以同时消费同一个 Topic，各自独立维护进度（offset）。

---

## 3. Kafka 的核心抽象：Topic、Partition、Offset

### 3.1 Topic

- 逻辑上的消息集合。

### 3.2 Partition（分区）

- 一个 Topic 会被切成多个 Partition。
- 分区内保证顺序（FIFO）；跨分区不保证全局顺序。
- 分区是 Kafka 并行度的核心：生产和消费都可以按分区并行。

### 3.3 Offset（偏移量）

- Offset 是分区级别的、单调递增的序号，从 0 开始。
- 生产端写入后由分区的 Leader 统一分配 offset。
- 消费端读取进度（consumer offset）由消费者组维护。

---

## 4. 角色与职责：Producer / Consumer / Consumer Group / Broker

### 4.1 Producer（生产者）

- 负责发送消息到 Topic。
- Kafka 默认使用 murmur2 对 key 做哈希，来决定写入哪个分区（同 key → 同分区 → 更容易保持业务顺序）。
- 超时配置

![]({{ '/assets/notes/mq/kafka-producer-timeouts.png' | relative_url }})

### 4.2 Consumer（消费者）

- 从分区拉取消息（poll）。
- 一个分区在同一个消费者组内，同一时刻只能被一个消费者实例消费。
- 超时配置

### 4.3 Consumer Group（消费者组）

- 通常对应“同一业务服务的多实例”。
- 同组内通过分区分配实现水平扩展；同组内共享一个逻辑消费进度。
- 不同消费者组之间互不影响：各自有各自的 consumer offset。

### 4.4 Broker（服务端节点）

- Kafka 集群中的一个节点称为一个 broker。
- 每个分区会有一个 Leader 副本，负责读写请求；其他副本为 Follower，用于容灾与复制。

---

## 5. 分区策略

### 5.1 按 key 分区：用来“保证业务顺序”

- Kafka 默认用 murmur2(key) % partitionCount 来选择分区。
- 适用：同一业务实体需要顺序（例如同一订单的状态流转、同一商品库存增减）。

### 5.2 指定分区：用来“做业务隔离/专用通道”

- 适用：VIP 通道、隔离不同业务线、隔离不同 SLA。

### 5.3 粘性分区（sticky partition）：用来“最大化批次吞吐”

- 目标：尽量让批次更大、吞吐更高。
- 代价：不以 key 为主，通常不强调顺序语义。

---

## 6. 批量发送、吞吐与 offset 分配

- 生产者通常会积攒多个消息形成 batch 再发送，从而减少请求次数，提高吞吐。
- Leader Broker 在写入时为 batch 记录一个起始 offset，然后 batch 内每条消息用“offset 差值”存储。
- 多个生产者并发：
    - 每条消息独立路由到某个分区。
    - 相同分区内按到达顺序连续分配 offset。
    - 不同分区的 offset 编号互相独立。

---

## 7. Consumer offset、提交方式与重复消费问题

### 7.1 consumer offset 存储在哪里？

- consumer offset 是“读头”，与分区的“写 offset”不同。
- Kafka 用一个特殊的内部 topic `__consumer_offsets` 来存储各消费者组对各分区的提交进度。

### 7.2 提交方式

1. 自动提交：按 interval 周期提交当前负责分区的 offset。
2. 手动提交：应用在处理完成后显式提交。

### 7.3 典型问题：消费者实例挂了/扩缩容导致 rebalance

- 例：实例 1 挂了，rebalance 后实例 2 接管这个分区，从哪里继续消费？
    - 从 `__consumer_offsets` 读取“上次提交的 offset”开始。
- 风险：如果实例 1 在崩溃前处理了消息但没来得及提交 offset，就会造成重复消费。

### 7.4 常见缓解策略（按“先工程化、再业务兜底”）

1. 优雅退出：在 rebalance 回调中尽可能提交最后处理完成的 offset。
2. 业务幂等：数据库唯一约束、幂等键、去重表/状态表、分布式锁等。
3. 事务/一致性方案：把“业务处理 + offset 提交”纳入更强的一致性控制（根据具体场景权衡复杂度）。

---

## 8. 可靠性：重试、幂等性与超时参数

### 8.1 为什么要幂等？

- 网络抖动或超时可能导致生产者重试，同一批消息可能被写入两次。

### 8.2 生产者幂等性

- 开启幂等性后，broker 会识别重复的重试写入，尽量避免“重复写入”。

### 8.3 超时参数

- 批次发送前等待时间：通常用于提升吞吐（等更多消息凑成 batch）。
- 投递/请求超时：通常用于可靠性与失败快速暴露。

---

## 9. 存储层：Segment 与日志压缩（Log Compaction）

### 9.1 Segment（分段文件）

- 一个分区在磁盘上由多个 segment 文件组成。
- Active segment：当前写入的段；达到条件后滚动（roll）生成新段。
- 你原笔记：例如“每 7 天关闭一个 segment（除 active segment）”属于常见的 roll 策略直觉。

### 9.2 Log Compaction（日志压缩）

- 保留每个 key 的最新记录，用于构建“最终状态”。
- 若消息没有 key，则无法按 key 压缩，通常就无法达到“只保留最新状态”的效果。

---

## 10. Kafka Streams 与本地状态（RocksDB）

- Kafka Streams 是在应用侧做流处理的库。
- 常见形态：
    - 本地状态存储：RocksDB。
    - 通过 changelog topic 持久化与恢复状态。
- 对 changelog topic 进行 compact，可以只保留同 key 的最新状态更新，利于恢复效率。

---

## 11. 架构与复制：Leader/Follower 与同步

- 每个分区有一个 Leader 副本负责读写。
- Follower 从 Leader 同步数据，用于容灾。
- offset 的产生以 Leader 为准；副本复制保持与 Leader 的日志一致。

---

## 12. Rebalance 与心跳

- Rebalance：消费者组成员变化（实例上下线、订阅变化等）后，重新分配分区。
- 心跳/活性：消费者通过心跳与 poll 机制让 coordinator 知道“我还活着”。

---

## 13. Kafka 的“零拷贝”与 IO：

下面把你最硬核的 IO 笔记单独整理成一条清晰主线：

### 13.1 传统 IO：多次切换、多次拷贝（直觉版本）

目标：把磁盘文件数据发送到网卡。

1. `read()`：用户态 → 内核态，发起 IO。
2. 磁盘 → Page Cache（DMA）。
3. Page Cache → 用户缓冲（CPU 拷贝），返回用户态。
4. `write()`：用户态 → 内核态。
5. 用户缓冲 → Socket 缓冲（CPU 拷贝）。
6. 返回用户态。
7. Socket 缓冲 → 网卡缓冲（DMA）。

### 13.2 零拷贝（sendfile）：更少系统调用与上下文切换

- 典型路径：`sendfile()` 直接在内核态把 Page Cache 数据送入 socket。
- 仍可能存在“内核缓冲 → 内核 Socket 缓冲”的一步 CPU 拷贝。
- 若支持 SG-DMA（Scatter-Gather），可能进一步减少这一步。

### 13.3 零拷贝（mmap）：把文件映射到用户空间地址

- `mmap()` 让用户空间可以直接“看到”Page Cache 的数据（地址映射），减少一次显式拷贝。
- 但后续 `write()` 仍需要进入内核把数据送入 socket。

### 13.4 Kafka 中两类典型使用点

- Broker 加载日志文件：更偏向 `mmap`（便于利用 Page Cache / 映射读取）。
- Broker 向 Consumer 发送消息、向 follower 同步：更偏向 `sendfile`（更直接地走内核网络发送路径）。

---

## 14. 选举与一致性：Zab → KRaft

### 14.1 旧版：Zab

- 可理解为 ZooKeeper 体系下的 Leader 选举与原子广播相关协议。

### 14.2 新版：KRaft

下面是你原始流程，保留并稍作排版：

- 步骤 1：Follower 检测到 Leader 心跳超时
    - 任期号 +1
    - 切换到 Candidate
    - 给自己投票，并发送 RequestVote RPC 给其他节点
- 步骤 2：其他节点收到投票请求
    - 如果 Candidate 的日志更完整（最后一条日志的任期和索引更大）
    - 并且这个任期还没投过票
    - 则投票给该 Candidate
- 步骤 3：Candidate 收到多数票
    - 成为 Leader
    - 开始发送心跳维持领导权
- 步骤 4：如果超时未收到多数票
    - 任期号再 +1
    - 重新发起选举

---

## 15. 架构流程图：

![]({{ '/assets/notes/mq/kafka-architecture-flow.png' | relative_url }})

## 16.拉取流程：

![]({{ '/assets/notes/mq/kafka-pull-flow.png' | relative_url }})

## 17.推送流程：

![]({{ '/assets/notes/mq/kafka-push-flow-1.png' | relative_url }})

![]({{ '/assets/notes/mq/kafka-push-flow-2.png' | relative_url }})

## 18.Offset管理

### 18.1 重复消费

![]({{ '/assets/notes/mq/kafka-offset-duplicate-consumption.png' | relative_url }})

### 18.2 丢失消息

![]({{ '/assets/notes/mq/kafka-offset-message-loss.png' | relative_url }})
