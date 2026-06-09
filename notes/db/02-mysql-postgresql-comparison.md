---
layout: "note"
nav: "notes"
title: "MySQL 与 PostgreSQL 对比"
course: "DB"
course_title: "数据库"
course_url: "/notes/db/"
chapter: "02"
permalink: "/notes/db/02-mysql-postgresql-comparison/"
tags: ["notes", "db", "mysql", "postgresql", "database"]
description: "数据库：MySQL 与 PostgreSQL 对比"
date: "2026-06-09 10:02:00 +0800"
archive: true
search: true
toc:
  - id: mysql-pg-architecture
    label: "架构与进程模型"
  - id: mysql-pg-storage-index
    label: "存储引擎与索引结构"
  - id: mysql-pg-mvcc
    label: "MVCC 与垃圾回收"
  - id: mysql-pg-isolation
    label: "事务与隔离级别"
  - id: mysql-pg-logging
    label: "日志与复制机制"
  - id: mysql-pg-sql-types
    label: "SQL 标准与扩展"
  - id: postgresql-indexes
    label: "PostgreSQL 索引"
  - id: postgresql-update-flow
    label: "PostgreSQL 更新流程"
previous_note_title: "MySQL 八股"
previous_note_url: "/notes/db/01-mysql-interview/"
next_note_title: "Redis 八股"
next_note_url: "/notes/db/03-redis-interview/"
---

## 1. 架构与进程模型
{: #mysql-pg-architecture }

**MySQL**：单进程多线程架构 (Single Process, Multiple Threads)。

- **原理**：每个客户端连接对应一个后台线程。
- **优劣**：线程上下文切换开销较小，内存占用低；但单个线程的致命错误（如内存越界）可能导致整个 MySQL 服务崩溃。

**PostgreSQL**：多进程架构 (Multiple Processes)。

- **原理**：每个客户端连接由系统 fork 出一个独立的后端进程 (Backend Process)。
- **优劣**：进程间隔离性极好，稳定性极高（某个进程崩溃不影响整体）；缺点是创建连接开销大，高并发下内存消耗高，生产环境中通常必须搭配连接池（如 PgBouncer）。

## 2. 存储引擎与索引结构
{: #mysql-pg-storage-index }

**MySQL (InnoDB)**：

- **聚簇索引 (Clustered Index)**：数据实际上存储在主键 B+ 树的叶子节点上。
- **二级索引 (Secondary Index)**：叶子节点存储的是主键的值。查询二级索引时，通常需要进行“回表”操作（先查二级索引获取主键，再走主键索引查数据）。
- **架构**：采用插件式存储引擎架构，Server 层与存储引擎层解耦。

**PostgreSQL**：

- **堆表 (Heap Table)**：数据按写入顺序存储在无序的堆文件（空闲空间映射表+数据→有空位就写）中，**没有聚簇索引**的概念。
- **非聚簇索引**：所有的索引（包括主键）叶子节点存储的都是指向实际数据行的物理指针（Tuple ID）。查询任何索引都直接通过 TID 定位到物理数据行，不存在二级索引“回表”的二次树查找开销。
- **索引类型极其丰富**：B-Tree(默认)、Hash、GIN（倒排索引，处理 JSONB 极佳）、GiST（搜索树，处理地理空间数据）、SP-GiST（空间分区） 和 BRIN（块范围索引）。

## 3. MVCC (多版本并发控制) 与垃圾回收
{: #mysql-pg-mvcc }

这是两者底层设计差异最大的地方。

**MySQL (InnoDB)**：基于 **Undo Log (回滚日志)**。

- **原理**：更新一条记录时，会原地修改表中的数据行，并将修改前的旧数据提取出来写入 Undo Log 中，通过回滚指针（Rollback Pointer）串联形成版本链。
- **优劣**：数据表文件体积相对稳定；但长事务会阻碍 Undo Log 的清理，导致 Undo 表空间极度膨胀。

**PostgreSQL**：基于 **Append-only (追加写)**。

- **原理**：更新一条记录时，**不会修改原数据**，而是在堆表中插入一条新版本的数据行。新老版本的数据存放在同一个表文件中，通过隐藏的事务 ID 字段（`xmin`, `xmax`）来判断对不同事务的可见性。
- **优劣**：事务回滚极快（只需标记事务状态即可，无需根据日志恢复数据）；致命缺点是频繁的 UPDATE/DELETE 会产生大量无用的磁盘“死元组”（Dead Tuples），导致表膨胀（Table Bloat）。必须依赖底层的 **VACUUM** 进程定期进行垃圾回收清理。

## 4. 事务与隔离级别
{: #mysql-pg-isolation }

**MySQL (InnoDB)**：

- 默认隔离级别是 **Repeatable Read (可重复读)**。
- 早期Binlog只支持Statement，若是RC，主从的sql执行顺序可能不一致（binlog按照事务提交顺序来同步的）；但是RR，通过间隙锁保证执行顺序一致。
- Eg：A先读100，B更新为50，A执行100-20，A提交，B提交。主库80，从库50。
- **READ COMMITTED** 会导致一个问题，那就是如果事务后续计算依赖一开始读的数据，一旦变更，计算就会出错。
- **幻读处理**：在 RR 级别下，通过 MVCC 解决“快照读”的幻读，通过 **Next-Key Lock (间隙锁 + 记录锁)** 锁住数据间隙，防止插入新数据，解决“当前读”的幻读（当前读要求基于最新数据更新，快照读无法满足只能上锁）。由于间隙锁的存在，容易在并发写入时引发死锁。

| **隔离级别** | **MVCC 快照策略 (主要影响普通`SELECT`)** | **锁策略 (主要影响`UPDATE`/`DELETE`)** | **主要解决的问题** |
| --- | --- | --- | --- |
| **READ UNCOMMITTED** | 无，直接读最新数据 | 基本不加锁 | 性能最大化 |
| **READ COMMITTED** | **语句级**：每条`SELECT`都生成新快照 | 无间隙锁，支持“半一致性”读 | 解决脏读 |
| **REPEATABLE READ** | **事务级**：整个事务复用第一个快照 | **有间隙锁**，锁范围更大，更持久 | 解决脏读、不可重复读 |
| **SERIALIZABLE** | 普通`SELECT`也加读锁，退化为“当前读” | 极其严格，读写完全互斥 | 解决所有并发问题 |

**PostgreSQL**：

- 默认隔离级别是 **Read Committed (读已提交)**。
- **幻读处理**：在 Repeatable Read 级别下，仅通过 MVCC 快照就能彻底阻止幻读，**不需要引入间隙锁，因为Postgre SQL不存在当前读，所有读操作都是事务开始时的快照**。若事务执行期间数据被另一个数据修改，会直接跑出不可串行化错误，依赖业务重试。
- 因此在相同的 RR 级别下，PG 的并发写入性能往往更好，因为依赖主动冲突检测抛出异常回滚事务，更依赖业务层逻辑控制并发冲突。
- **Serializable**：PG 实现了基于 SSI（可串行化快照隔离）的真正的串行化级别，开销远低于传统基于锁的串行化。通过检测冲突环，回滚事务，乐观重试。

## 5. 日志与复制机制
{: #mysql-pg-logging }

**MySQL**：

- 依赖 **Binlog (归档日志)** 进行主从复制（逻辑复制，基于 Statement 或 Row），同时底层 InnoDB 依赖 **Redo Log (重做日志)** 进行崩溃恢复。需要通过两阶段提交 (2PC) 保证两者的强一致性。

**PostgreSQL**：

- 统一使用 **WAL (Write-Ahead Logging)** 预写日志。WAL 既用于底层的崩溃恢复，也直接用于流复制 (Streaming Replication)。
- 支持物理复制（直接复制字节，主从一致性极其可靠）以及逻辑复制（订阅发布模式）。
- 不需要UndoLog，因为磁盘死元组就是回滚来源；Mysql的Read View是内存结构
- WAL替代了Mysql的Binlog和RedoLog
- 主从数据一致，通过发送，接受，重放进程实现。两种模式：同步确认和异步

## 6. SQL 标准、数据类型与扩展 (Extensions)
{: #mysql-pg-sql-types }

**MySQL**：语法较为宽松、灵活，注重实用性，过去对复杂 SQL 的支持较弱，适合绝大多数互联网 Web CRUD 场景。

**PostgreSQL**：

- 被称为“最先进的开源关系型数据库”，极其严谨地遵循 SQL 标准。
- **数据类型强大**：原生支持 Array、JSONB（结合 GIN 索引，吊打大部分 NoSQL）、UUID、网络地址（CIDR/INET）等。
- **扩展生态无敌**：提供可插拔的扩展接口。
    - **PostGIS**（空间地理数据库的事实标准）
    - **TimescaleDB**（时序数据库扩展：热行冷列-列式存储压缩、聚合分析、实时监控）
    - **pgvector**（当下 AI 时代最火的向量检索扩展）。

---

## PostgreSQL索引
{: #postgresql-indexes }

- B-树
    - PostgreSQL记录堆表无序，通过索引表直接定位页号和页内偏移量。范围查询仍然要多次回表，通过覆盖索引来解决。
    - 实质上是B+树，叶子节点只需存储TID
- Hash
    - 专门为了等值查询，不支持排序，范围查询
    - 通过hash计算，固定索引长度（适合冗长的查询字段），回表确认解决hash冲突
    - 自动扩容，整理溢出桶
    - 适合数据不重复，插入少量
- GIN(Generalized Inverted Index)
    - Entry Tree：每个叶子节点存储（元素，TID列表）
    - Posting Tree：当TID列表过长时，单独存为一颗树，原来Entry存指针
    - GIN索引根据字段类型智能选择操作符，JSONB按照结构分词；Array按照数组元素分词；TsVector（全文检索）词根分词精准匹配
- GiST(Generalized Search Tree)
    - 几何、空间、范围、IP、模糊文本的邻近搜索
- BRIN(Block Range Index)
    - 将物理上有序的数据，比如created time索引可以划分区块记录最小和最大值的区域快速查找

## Postgre SQL更新数据流程
{: #postgresql-update-flow }

- 每一行记录有两个隐藏字段
    - xmax代表删除/更新这行数据的事务id
    - xmin代表插入这行数据的事务id
- 通过索引定位记录，遍历版本链查找最新可见版本
    - 检查该版本状态，若为aborted，代表该版本回滚了，则不可见。
    - 若版本xmin=自己快照的xmin，代表自己事务创建的版本，则可见
    - 若版本xmin≥自己快照的xmax，代表当前是该版本快照之后才开始的事务，则不可见
    - 若版本xmin<自己快照的xmin，代表当前事务是该版本快照开始前就结束了，则可见
    - 若版本xmin在活跃事务中，代表该版本尚未提交，则不可见
    - 若版本xmin不在活跃事务中，代表xmin是快照时刻之前提交的事务，则可见
    - 
- 对该版本记录加锁，若别的事务持有锁，则等待，释放后重新查找最新可见版本
- 冲突检测：
    - 若RC，不用检测；
    - 若RR，检查旧版本xmin是否属于当前事务开始后提交的事务，若是则代表有冲突，被别人抢先提交了。
- 旧版本的xmax改成自己事务id，填充新版本，xmin改成自己，建立版本链
- 新增索引指针，旧条目留给Vaccum清理
- 写入WAL
- 提交阶段，标记Committed，释放行锁
