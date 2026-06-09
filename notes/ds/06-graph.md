---
layout: "note"
nav: "notes"
title: "第六章 图"
course: "DS"
course_title: "数据结构"
course_url: "/notes/ds/"
chapter: "06"
permalink: "/notes/ds/06-graph/"
tags: ["notes", "ds", "data-structures"]
description: "数据结构：第六章 图"
date: "2024-06-07 15:39:00 +0800"
archive: true
search: true
previous_note_title: "第五章 树与二叉树"
previous_note_url: "/notes/ds/05-tree-and-binary-tree/"
next_note_title: "第七章 查找"
next_note_url: "/notes/ds/07-search/"
toc:
  - id: section-1
    label: "基本概念：图至少有一个顶点"
  - id: section-2
    label: "图的遍历："
---

> **考纲：基本概念、存储与基本操作（邻接矩阵、邻接表、邻接多重表、十字链表）、遍历（深度优先、广度优先）、最小生成树、最短路径、拓扑排序、关键路径**

## 基本概念：图至少有一个顶点
{: #section-1 }

### 有向图：弧是顶点的有序对。\<v,w\>v弧尾，w弧头，v到w的弧，也称v邻接到w。顶点入度和+出度和=边数。

### 无向图：边是顶点的无序对。顶点度数和=边数\*2。

### 简单图：不存在顶点自环和重复边（可以是有向图）；多重图：允许顶点自环，某两顶点边数大于1。

### 完全图：对于无向图，有n（n-1）/2条边，有向图有n（n-1）条弧。

### 生成子图：包含图全部顶点的子图。

### 连通图与连通分量：

任意两个顶点都有路径是连通图，无向图中极大连通子图称为连通分量。若一个图有n个顶点，边数\<n-1，必是非连通图，无向图连通图最少n-1条边，有向图连通图最少n条边（成环）。非连通图最多有(n-1)\*(n-2)/2条边。

有向图中，任意顶点可以互通是强连通图。极大强连通子图称为有向图的强连通分量，强连通分量应尽可能包含更多的点和边。

### 生成树：

### 包含图全部顶点的一个极小连通子图，其中权值和最小的生成树是最小生成树；无向图的生成树不一定是连通分量，因为连通分量是极大连通子图。

### 简单路径与简单回路：

顶点不重复出现的路径是简单路径，回路中除第一个和最后一个顶点外，顶点不重复出现的回路是简单回路。

### 路径与环：

距离即最短路径，最短路径一定是简单路径。n个顶点有n-1条以上的边一定有环。

带权图称为网，稀疏图边数少，稠密图边数多。

### 有向树：一个顶点入度为0，其余入度为1的树是有向树。

### 邻接矩阵

一维顶点表（可省）和二维边表，无向图的邻接矩阵是对称矩阵可采用压缩存储，空间复杂度O(V²)。

无向图第i行或第i列非零元素个数是顶点的度；有向图第i行非零元素个数是顶点i的出度，第i列是入度。

适合稠密图，删除边方便，删除顶点需要移动大量数据。

邻接矩阵表示唯一。

带权图（网），不存在的边可以0或者∞表示，存在的边用权值。

![]({{ '/assets/notes/ds/image008.png' | relative_url }})

**定义：**

`typedef struct {`

`    ``int no;``  ``// ``顶点编号`

`    ``char info;``  ``// ``顶点的其他信息`

`}VertexType;``  ``// ``顶点类型`

` `

`typedef struct {`

`    ``int edges[maxSize][maxSize];``  ``// ``边表，有权图将``int``改为``float`

`    ``int ``vexnum``, ``arcnum``;``  `` `

`    ``VertexType vex[maxSize];``  ``// ``顶点表`

`}MGraph;``  `

### 邻接表

为每个顶点建立一个边表，边表的头指针和顶点的数据信息采用顺序存储，称为顶点表（类似孩子表示法）。

对于无向图所需存储空间O（V+2E），有向图O（V+E）。

无向图计算顶点的度只需计算对于顶点的边表结点个数；有向图顶点的入度要遍历整个邻接表。

适合稀疏图，邻接表不唯一（除非给出确定的图示），无向图删除边和顶点都不方便。逆邻接表和邻接表的结点个数相同（入度=出度）。

**定义 ：**

`typedef struct ArcNode{`

`    ``int adjvex;``  ``// ``该边所指向的顶点的位置`

`    ``struct ArcNode *nextarc;``  ``// ``指向下一条边的指针`

`    ``int info;``  ``// ``该边的相关信息（如权值）`

`}ArcNode;`

` `

`typedef struct {`

`    ``char data;``  ``// ``顶点信息`

`    ``ArcNode *firstarc;``  ``// ``指向第一条边的指针`

`}VNode;`

` `

`typedef struct{`

`    ``VNode adjlist[maxSize];``  ``// ``邻接表`

`   `` ``int vexnum, arcnum;``  `

`}AGraph;``  ``// ``图的邻接表类型`

### 十字链表

有向图的链式存储结构，为了方便求顶点的度，引入十字链表。十字链表不唯一，空间复杂度O（V+E）。

**弧结点：**

有5个域，tailvex，headvex，弧尾-\>弧头（起点到终点），hlink指向弧头相同的下一个结点（终点相同的入边），tlink指向弧尾相同的下一个结点（起点相同的出边），info（图示省略）。

**顶点结点：**

3个域，采用顺序存储。data，firstin指向以该顶点为弧头的第一个结点（第一条入边），firstout指向该顶点为弧尾的第一个弧结点（第一条出边）。

**手工模拟：**

先画邻接表，每个结点的最后一条出边指针置为空。再画入边，每个结点的最后一条入边指针置为空。

![]({{ '/assets/notes/ds/image009.png' | relative_url }})

邻接多重表：

无向图的链式存储结构，为了省去每条边存储两次的问题，引入了邻接多重表。邻接多重表不唯一，空间复杂度O（V+E）。

**边结点：**

5个域，ivex，ilink指向下一条依附该顶点的边，jvex，jlink指向下一条依附该顶点的边，info。

**顶点结点：**

2个域采用顺序存储data，firstedge指向第一条依附于该顶点的边。

**手工模拟：**

先写出不同的边结点，分别对于每个边的两个顶点连接下一个与该顶点有关的边，最后一个边对应位置置为空。

![]({{ '/assets/notes/ds/image010.png' | relative_url }})

## 图的遍历：
{: #section-2 }

### 广度优先：

从顶点出发依次访问未访问过的各个邻接顶点，然后依次访问邻接顶点的未被访问过的邻接点。Dijkstra和Prim都是用了这个思想。为了实现逐层访问，算法需要一个辅助队列记忆下一层顶点，是非递归算法，类似二叉树的层次遍历。

最坏空间复杂度为O（V），时间复杂度邻接矩阵是O（V²），邻接表是O（V+E）。

基于邻接矩阵的BFS序列唯一，邻接表序列不唯一，因此广度优先生成树是唯一的。

**代码：**

`bool visited[MAX_VERTEX_NUM];`

`void BFSTraverse(Gragh G){`

`for(i=0;i<G.vexnum;++i){`

`visited[i]=0;`

`}`

`InitQueue(Q);`

`for(i=0;i<G.vexnum;i++){`

`if(!visited[i]){``     ``//``对每个连通分量调用一次``BFS`

`BFS(G,i);`

`}`

`}`

**邻接矩阵实现BFS：**

`void BFS(MGragh G``，``int i){`

`printf("%d",G.vex[i].no)`

`visited[i]=1;`

`Enqueue(Q,i);`

`while(!isEmpty(Q)){`

`Dequeue(Q,v);`

`for(w=0;w<G.vexnum;w++){`

`if(visited[w]==0 && G.edge[v][w]==1){`

`printf("%d",G.vex[w].no)`

`visited[w]=1;``     `

`EnQueue(Q,w);`

`}`

`}`

`}`

`}`

**邻接表实现BFS：**

`void BFS(ALGragh G``，``int i){`

`printf("%c",G.adjlist[i].data)`

`visited[i]=1;`

`Enqueue(Q,i);`

`while(!isEmpty(Q)){`

`Dequeue(Q,v);`

`for(p=G.adjlist[v].firstarc;p!=NULL;p=p->nextarc){`

`w=p->adjvex;`

`if(visited[w]==0){`

`printf("%c",G.adjlist[w].data)`

`visited[w]=1;``     `

`EnQueue(Q,w);`

`}`

`}`

`}`

`}`

### BFS求解单源最短路径：

### 前提：权值相等或者无权图，不适用于有权图。

`void BFS_Min_Distance(Gragh G,int u){`

`for(i==0;i<G.vexnum;++i){`

`dist[i]=0x3f;`

`}`

`visited[u]=1;`

`dist[u]=0;`

`EnQueue(Q,u);`

`while(isEmpty(Q)){`

`DeQueue(Q,u);`

`for(w=FirstNeighbor(G,u);w>=0;w=NextNeighbor(G,u,w)){`

`if(!visited[w]){`

`visited[w]=true;`

`dist[w]=dist[u]+1;`

`EnQueue(Q,w);`

`}`

`}`

`}`

`}`

### 深度优先：

从起始顶点开始访问未被访问的任意一个邻接点，当不能继续访问时，回退顶点依次搜索。是递归算法，类似树的先根遍历。

空间复杂度为O（V），时间复杂度邻接矩阵是O（V²），邻接表是O（V+E）。

基于邻接矩阵的DFS序列唯一，邻接表序列不唯一。

**代码：**

`bool visited[MAX_VERTEX_NUM];`

`void DFSTraverse(Gragh G){`

`for(i=0;i<G.vexnum;++i){`

`visited[i]=0;`

`}`

`for(i=0;i<G.vexnum;i++){`

`if(!visited[i]){``     ``//``对每个连通分量调用一次``DFS`

`DFS(G,i);`

`}`

`}`

**邻接矩阵实现：**

`void DFS(MGragh G``，``int i){`

`printf("%d",G.vex[i].no)`

`visited[i]=1;`

`for(j=0;j<G.vexnum;j++){`

`if(visited[j]==0 && G.edge[i][j]==1){`

`DFS(G,j);`

`}`

`}`

`}`

**邻接表实现：**

`void DFS(ALGragh G``，``int i){`

`printf("%c",G.adjlist[i].data)`

`visited[i]=1;`

`for(p=G.adjlist[i].firstarc;p!=NULL;p=p->nextarc){`

`j=p->adjvex;`

`if(visited[j]==0){`

`DFS(G,j);`

`}`

`}`

`}`

有向图连通图分为强连通和非强连通的，与连通分量数量是有关的。非强连通图，若从起始顶点到其他顶点都有路径才能生成深度优先生成树，而且只需调用一次DFS/BFS，否则DFS/BFS调用次数和起始顶点有关，且是生成森林。强连通图，则从任意顶点开始都只需一次DFS/BFS就能生成深度优先生成树。

深度优先和拓扑排序（关键路径第一步）可以检测有向图是否存在环。

深度优先算法中增设path数组记录路径，若某顶点的邻居已经被访问，且path中有它，则存在环。

### 最小生成树：

带权连通无向图中，权值和最小的生成树是最小生成树，但不保证任意两个顶点间的路径是最短路径。

图中若存在权值相同的边，最小生成树可能不唯一。以下两种算法基于贪心策略。

**Prim：**

从某一顶点开始，每次加入集合中距离所有点里最近的点（与Dijkstra不同），并将这条边也加入树，直至所有顶点加入集合。时间复杂度是O（V²），不依赖于边数E，适用于稠密图，邻接矩阵。

**Kruskal：**

![]({{ '/assets/notes/ds/image011.png' | relative_url }})

1、初始化生成树的边集A为空集：O(1)

2、对集合中的每一个顶点，都将它的集合初始化为自身：O(V)

3、将边按权值进行排序：O(ElogE）

每次边加入集合Union操作前，需要判断是否属于一个集合的Find操作需要o(α(V)) ，一共O(V+E)α(V)

### 最短路径（带权有向图）：

**Dijkstra求单源最短路径：**

**算法思想：**

设置三个数组

final：记录各顶点i是否已经找到最短路径。

dist：记录从源点到其他顶点i的当前最短路径长度。

path：表示从源点到顶点i之间最短路径的前驱结点。算法最后可以通过该数组追溯最短路径。

**算法步骤如下：**

初始化：dist从源点到0其他顶点的距离也就是edges\[0\]\[i\]的权值，S集合中只有源点v0。

从V-S集合中选择距离源点最近的顶点加入集合。

每次加入一个顶点，以这个顶点为基础修改源点到其他顶点的最短路径长度，即dist数组。更新依据dist\[j\]+acrs\[j\]\[k\]\<dist\[k\]。

**时间复杂度：**

邻接矩阵和邻接表都是O（V²），Dijkstra不适用于边是负权值，适合稠密图。若要求任意顶点间最短路径，需要再套一层循环。

**代码：**

`void Dijkstra(MGraph ``G``, int v, int dist[], int path[]) {`

`int final[maxSize];`

`int min, i, j, k;`

`for (i = 0; i < G.vexnum; ++i) {`

`dist[i] = G.edges[v][i];`

`final[i] = 0;``        `

`if (G.edges[v][i] < INF) {``          `

`path[i] = v;`

`}`

`else {`

`path[i] = -1;`

`}`

`}`

`final[v] = 1;`

`path[v] = -1;`

`//``算法一共``num-1``轮`

`for (i = 0; i < G.vexnum-1; ++i) {`

`min = INF;`

`f``or (j = 0; j < G.vexnum; ++j) {``    ``//``在未找到最短路径的顶点中，找到距离源点最近的顶点``k`

`if (final[j] == 0 && dist[j] < min) {`

`k = j;`

`min = dist[j];`

`}`

`}`

`final[k] = 1; `

`for (j = 0; j < G.vexnum; ++j) {``    ``//``更新未取得最短路径的顶点的最短路径和前驱。`

`if (final[j] == 0 && dist[k]+G.edges[k][j] < dist[j]) {`

`dist[j] = dist[k] + G.edges[k][j];`

`path[j] = k;`

`}`

`}`

`}`

`}`

**Floyd求任意顶点间最短路径：**

**算法思想：**

![]({{ '/assets/notes/ds/image012.png' | relative_url }})

**代码：**

`void Floyd(MGraph G, int path[][maxSize]) {`

`int i, j, k;`

`int A[maxSize][maxSize];`

`for (i = 0; i < G.vexnum; ++i) {`

`for (j = 0; j < G.``vexnum``; ++j) {`

`A[i][j] = G.edges[i][j];`

`path[i][j] = -1;`

`}`

`}`

`for (k = 0; k < ``G.vexnum``; ++k) {`

`for (i = 0; i < ``G.vexnum``; ++i) {`

`for (j = 0; j < ``G.vexnum``; ++j) {`

`if (A[i][j] > A[i][k] + A[k][j]) {`

`A[i][j] = A[i][k] + A[k][j];`

`path[i][j] = k;`

`}`

`}`

`}`

`}`

`}`

可以将邻接矩阵权值都改为相反数，利用Floyd求解最长路径长度。

**注意：边若都是正权值，两个算法都是可以适用存在回路的有向图。**

### 有向无环图（DAG图）：

构建公共子表达式（编译原理），节省存储空间。

### 拓扑排序：

**AOV网：顶点表示活动的网络，边没有权值。**

每个顶点只出现一次且图中不存在排在后面的顶点到排在前面顶点的路径。

每个AOV网对应一个或多个拓扑排序（多个后继出入栈顺序不同）。

**算法：**

选一个入度为0的顶点入栈，删除从它出发的边，与之关联的顶点入度-1。邻接表时间复杂度O(V+E)，邻接矩阵O(V²)。如果图中有环，则栈中一直存在一个顶点，无法删除，因此可以判断图中有环。

**BFS实现思路：**

也可以通过队列实现拓扑排序，出队序列就是拓扑序列。找到所有入度为0的顶点，将其加入队列，依次出队顶点，减去与之相邻顶点的入度，若减为0入队。

**数组实现思路：**

1.增加数组统计顶点入度，邻接表根据双层循环遍历统计；

2.外层循环遍历入度数组寻找入度为0的顶点，若一轮内未找到入度为0的顶点且还未全部遍历完，则认定为有环。内层循环遍历该顶点的邻接表，将其指向边的顶点的入度--。

**代码：**

`bool`` Top``o``Sort(``AL``Graph G) {`

`InitStack(S);`

`int i;`

`for(int i=0;i<G.vexnum;i++){`

`if(indegree[i]==0){``    ``//``适合逆邻接表`

`Push(S,i);`

`}`

`}`

`int count=0;`

`while(!isEmpty(S)){`

`Pop(S,i);`

`printf("%d",i);`

`count++;``     ``//``记录已经输出顶点数`

`for(p=G.adjlist[i].firstarc;p!=NULL;p=p->nextarc){`

`v=p->adjvex;`

`if((--indegree[v])==0){`

`Push(S,v);`

`}`

`}`

`}`

`if(count<G.vexnum) return false;``   ``//``图中有回路`

`else return true;`

`}`

**利用深度优先搜索实现拓扑排序：**

设置一个结束时间标记，最后按照结束时间从大到小排列，就可以得到拓扑排序。

**代码：**

`bool visited[MAX_VERTEX_NUM];`

`void DFSTraverse(Gragh G){`

`for(i=0;i<G.vexnum;++i){`

`visited[i]=0;`

`}`

`time=0``；`

`for(i=0;i<G.vexnum;i++){`

`if(!visited[i]){``     `

`DFS(G,i);`

`}`

`}`

` `

`void DFS(ALGragh G``，``int i){`

`visited[i]=1;`

`for(p=G.adjlist[i].firstarc;p!=NULL;p=p->nextarc){`

`j=p->adjvex;`

`if(visited[j]==0){`

`DFS(G,j);`

`}`

`}`

`time++;``      ``//``若直接``printf``，就是逆拓扑排序`

`finishTime[i]=time;`

`}`

**逆拓扑排序：**

选一个出度为0的顶点入栈并输出，删除以它为终点的边，与之关联的顶点出度-1。

DFS输出语句在退出递归之前，实现逆拓扑序列输出。

邻接矩阵是三角矩阵，则存在拓扑序列；反之不一定，因为可以通过人为改变顶点编号，使之成为三角矩阵。

### 关键路径：

**AOE网：以顶点表示事件，以有向边表示活动，边上权值表示完成该活动的开销。网中只有一个入度为0的顶点和一个出度为0的顶点。**

从源点到汇点的所有路径中，具有最大路径长度的路径是关键路径，路径上的活动称为关键活动。完成整个活动的最短时间就是关键路径长度。

**事件Vk的最早发生时间Ve(k)：**

源点V1到顶点Vk的最长路径长度，决定了从Vk开始的活动的最早开工时间。从前往后算。

![]({{ '/assets/notes/ds/image013.png' | relative_url }})

![]({{ '/assets/notes/ds/image014.png' | relative_url }})

**事件Vk的最迟发生时间Vl(k)：**

不推迟工程的前提下，保证后继事件Vj能在其最迟发生时间发生时，该事件的最迟必须发生时间。从后往前算。

![]({{ '/assets/notes/ds/image015.png' | relative_url }})

![]({{ '/assets/notes/ds/image016.png' | relative_url }})

**活动ai的最早开始时间e(i)：**

该活动弧的起点的事件的最早发生时间。\<Vk,Vj\>活动ai的e(i)=Ve(k)

**活动ai的最迟开始时间l(i)：**

该活动弧的终点的事件的最迟发生时间与该活动所需时间之差。l(i)=Vl(j)-Weight\<Vk,Vj\>

**活动的时间余量d(i)=l(i)-e(i)：**

不增加工程总时间情况下，活动ai可以拖延的时间。

可以通过缩短关键路径长度缩短整个工程时间，但不能无限制缩短，因为可能成为非关键路径。关键路径可能不唯一，只缩短某个关键活动不一定能缩短整个工程时间，因此要缩短所有关键路径都包含的关键活动才行。

**求关键路径：求Ve和Vl需要用到拓扑和逆拓扑，因此邻接表时间复杂度O(V+E)，邻接矩阵O(V²)。**
