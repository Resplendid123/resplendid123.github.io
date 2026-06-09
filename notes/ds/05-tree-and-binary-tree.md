---
layout: "note"
nav: "notes"
title: "第五章 树与二叉树"
course: "DS"
course_title: "数据结构"
course_url: "/notes/ds/"
chapter: "05"
permalink: "/notes/ds/05-tree-and-binary-tree/"
tags: ["notes", "ds", "data-structures"]
description: "数据结构：第五章 树与二叉树"
date: "2024-06-04 14:35:00 +0800"
archive: true
search: true
previous_note_title: "第四章 串"
previous_note_url: "/notes/ds/04-string/"
next_note_title: "第六章 图"
next_note_url: "/notes/ds/06-graph/"
toc:
  - id: section-1
    label: "线索二叉树："
---

> **考纲：基本概念、二叉树定义特征、顺序存储和链式存储、遍历、线索二叉树、树与森林（存储结构、森林与二叉树转换、遍历）、哈夫曼树、哈夫曼编码、并查集及应用**

## 基本概念：树是n个结点的有限集，n=0为空树。非空树中，只有一个根结点，其余结点可分为m个不相交的有限集，每个集合本身也是一颗树。树是递归定义的，同时也是分层的。根节点没有前驱，其余结点都只有一个前驱，所有结点都可以由0个或多个后继。

### 树的基本术语：

结点的度：孩子个数；树的度：最大孩子个数。

分支结点（非终端结点）：度\>0；叶结点（终端节点）：度=0。

树的高度（深度）是树中结点的最大层数，结点的深度是结点所在层次，结点的高度是以该结点为根的子树的高度。

有序树：树中结点各子树从左到右有次序，不能互换。

森林是m（\>=0）棵互不相交的树的集合。

### 树的性质：

### 1.结点数n=度数和+1=边数+1

2.度为m，n个结点的树:（m^(h-1)-1）/（m-1）\<结点个数n\<=（m^h-1）/（m-1)。

3.度为m的树至少有m+1个结点。

### 二叉树特征：

二叉树是有序树。非空二叉树结点数n0=n2+1，空二叉树就不满足该等式。

**满二叉树：**

一颗高度为h，且含有2^h-1个结点的二叉树称为满二叉树。双亲为⌊i/2⌋；若有左孩子，则左孩子为2i；若有右孩子，则右孩子为2i+1。

**完全二叉树：**

![]({{ '/assets/notes/ds/image005.png' | relative_url }})

**二叉排序树（二叉搜索树）：**

任意结点的左子树关键字均小于根，右子树均大于根。

**平衡二叉树：**

任意结点的左右子树高度差不超过1。

**正则二叉树：**

树中只有度为0或2的结点。

### 顺序存储：

适合满二叉树与完全二叉树。一般二叉树需要空结点维护左右次序。最坏情况下，存储高为h的单支树需要2^h-1个存储单元。

### 链式存储：

n个结点的二叉链表中，含有n+1个空链域。利用这些空指针可以组成线索链表。二叉链表通过增加父结点指针可变成三叉链表。

**定义：**

`typedef struct BTNode {`

`    ``char data;``   `

`    ``struct BTNode *lchild;``  `

`    ``struct BTNode *rchild;``  `

`}BTNode``,*BTree``;`

### 二叉树的遍历：

遍历时间复杂度O(n)，递归深度是树的深度。非递归算法可用栈来进行先序、中序遍历。

已知中序遍历和先序、后序、层序中的一种才能唯一确定一颗二叉树。先序、中序和后序分别对应前缀、中缀、后缀表达式构造的二叉树。

**先序遍历：**

先序顺序类似函数递归调用。

**递归：**

`void preorder(BTNode *p) {`

`    ``if (p != nullptr) {``  `

`        ``printf("%c ", p->data);`

`        ``preorder(p->lchild);`

`        ``preorder(p->rchild);`

`    ``}`

`}`

**非递归：**

`void preorder``2``(BTree T) {`

`InitStack(S);Btree p=T;`

`While (p || !isEmpty(S)) {`

`if`` (p){`

`printf("%c",p->data);`

`Push(S,p);`

`p=``p->lchild``;`

`}`

`else{`

`Pop(S,p);`

`p=``p->rchild``;`

`}`

`}`

`}`

**中序遍历：**

**递归：**

`void inorder(BTNode *p) {`

`    ``if (p != nullptr) {`

`        ``inorder(p->lchild);`

`        ``printf("%c ", p->data);`

`        ``inorder(p->rchild);`

`    ``}`

`}`

**非递归：**

`void Inorder``2``(BTree T) {`

`InitStack(S);Btree p=T;`

`While (p || !isEmpty(S)) {`

`if`` (p){`

`Push(S,p);`

`p=``p->lchild``;`

`}`

`else{`

`Pop(S,p);`

`printf("%c",p->data);`

`p=``p->rchild``;`

`}`

`}`

`}`

` `

**后序遍历：**

后序遍历多用于求路径、祖先等，栈中剩余元素都是结点的祖先。

**递归：**

`void postorder(BTNode *p) {`

`    ``if (p != nullptr) {`

`        ``postorder(p->lchild);`

`        ``postorder(p->rchild);`

`        ``printf("%c ", p->data);`

`    ``}`

`}`

**非递归：**

`void postorderNonrecursion(BTNode *bt) {`

`    ``if (bt != nullptr) {`

`        ``BTNode *Stack1[maxSize]; int top1 = -1;`

`        ``BTNode *Stack2[maxSize]; int top2 = -1;``  `

`        ``BTNode *p;`

`        ``Stack1[++top1] = bt;`

`        ``while (top1 != -1) {`

`            ``p = Stack1[top1--];`

`            ``Stack2[++top2] = p;``  ``// ``每一次入栈是中左右，出栈顺序是中右左`

`            ``if (p->lchild) {`

`                ``Stack1[++top1] = p->lchild;`

`            ``}`

`            ``if (p->rchild) {`

`                ``Stack1[++top1] = p->rchild;`

`            ``}`

`        ``}`

`        ``// ``循环结束，栈``2``中是逆后序遍历`

`        ``while (top2 != -1) {`

`            ``p = Stack2[top2--];`

`            ``printf("%c\n", p->data);`

`        ``}`

`    ``}`

`}`

**层次遍历：**

`void LevelOrder(BTree T){`

`InitQueue(Q);`

`BTree p;`

`EnQueue(Q,T);`

`while(!isEmpty(Q)){`

`DeQueue(Q,p);`

`printf("%c",p->data);`

`if(p->lchild!=null){`

`EnQueue(Q,p->lchild);`

`}`

`if(p->rchild!=null){`

`EnQueue(Q,p->rchild);`

`}`

`}`

`}`

## 线索二叉树：
{: #section-1 }

### 需要将二叉链表中的n+1个空指针改为指向前驱和后继的线索，线索化的实质是遍历一次二叉树。根据不同的遍历过程（分为先序、中序、后序，其前驱后继不同），检查当前结点的左指针是否为空，为空则指向pre结点，检查pre的右指针是否为空，为空则指向当前结点。

**定义：**

`typedef struct TBTNode{`

`    ``char data;`

`    ``int ltag, rtag;``        ``//tag==0``表示孩子；``tag==1``表示线索`

`    ``struct TBTNode *lchild;`

`    ``struct TBTNode *rchild;`

`}TBTNode;`

` `

### 线索化递归算法：

`void CreateInThread(ThreadTree T){`

`ThreadTree pre=Null;`

`if(T!=Null){`

`InThread(T,pre);`

`pre->rchild=null;``      ``//``处理遍历的最后一个结点`

`pre->rtag=1;`

`}`

`}`

`void InThread(ThreadTree &p,ThreadTree &pre){`

`if(p!=NULL){`

`InThread(p->lchild,pre);`

`if(p->lchild==NULL){`

`p->lchild=pre;``     ``//``建立当前结点的前驱线索`

`p->ltag=1;`

`}`

`if(pre!=NULL&&pre->rchild==NULL){``     ``//``前驱结点非空且其右子树为空`

`pre->rchild=p;``     ``//``建立前驱结点的后继线索`

`pre->rtag=1;`

`}`

`pre=p;`

`InThread(p->rchild,pre);`

`}`

`}`

` `

中序遍历可以增加一个头结点，让其左指针指向根节点，右指针指向最后遍历的结点。同时让第一个结点的左指针和最后一个结点的右指针指向头结点。可以双向遍历线索二叉树。

![]({{ '/assets/notes/ds/image006.png' | relative_url }})

### 线索二叉树的中序遍历：

**最左下结点：依次往它的左孩子找就是。**

`ThreadNode *FirstNode(ThreadNode *p){`

`while(p->ltag==0) p=p->lchild;`

`return p;`

`}`

**后继：如果右孩子tag为1，那么指向就是tag；若有右孩子，那么右子树的最左下结点就是其后继。**

`ThreadNode *NextNode(ThreadNode *p){`

`if(p->rtag==0) return FirstNode(p->rchild);`

`else return p->rchild;`

`}`

**不含头结点的中序遍历：**

`void Inorder(ThreadNode *T){`

`for(Threadnode *p=FirstNode(T);p!=NULL;p=p->NextNode(p))`

`printf("%c",p->data);`

`}`

### 先序遍历：

### 根节点是第一个结点，若有左孩子，其后继就是左孩子。若没有左孩子，其右孩子就是后继，若为叶节点，其右指针指向后继。

### 后序遍历：

### 若是根节点，没有后继；若是其双亲的右孩子，或是其双亲的左孩子但其双亲没有右孩子，后继是双亲；若是其双亲的左孩子，且双亲有右孩子，其后继为双亲右孩子的后序遍历的第一个结点，需要栈的支持。

查找先序的前驱和后序的后继需要知道双亲，比如节点只有右孩子，没有左孩子，其前驱是右孩子，但后继是其双亲，但此时右指针已经被右孩子占用了。因此需采用带标志位的三叉链表作为存储结构。

### 树的顺序存储：

**双亲表示法：**

数组（data结点字符、parent对应双亲的下标），根结点位序0（Root，-1）。

数组下标在二叉树的顺序存储中既代表结点编号，又表示了各个结点的关系（如左右顺序）。

**优点：访问双亲快；缺点：访问结点的孩子需要遍历整个数组。**

### 树的链式存储：

**孩子表示法：**

数组（data结点字符、\*firstChild指向第一个孩子的指针），

每个结点都有一个孩子链表，每个结点的头指针又组成一个线性表，可采用顺序存储便于查找。

**优点：访问孩子快；缺点：访问结点的双亲需要遍历所有孩子结点的链表。**

**孩子兄弟表示法（二叉树表示法）：**

### 二叉链表存储，其中包括结点data，第一个孩子指针，下一个兄弟的指针。

### 优点：方便实现树转二叉树，同一存储结构，不同逻辑结构，查孩子、兄弟快；缺点：查双亲，需增设一个parent指针。

**定义：**

`typedef struct ``CS``Node {`

`    ``char data;``   `

`    ``struct ``CS``Node *``firstC``hild;``  `

`    ``struct ``CS``Node *``nextSibling``;``  `

`}``CS``Node``,*CSTree``;`

### 树转二叉树：

兄弟之间连线；每个结点只保留与第一个孩子的连线，顺时针旋转45°。

### 森林转二叉树：

每棵树转为二叉树；树根之间连线；顺时针转45°。

### 二叉树转森林：

根的右链断开；每棵树的子树的左孩子的右孩子与自身连线并断开兄弟连线。

### 树的遍历：

**先根遍历：**

先访问根，而后先根遍历每一棵子树；遍历序列与转换后的二叉树的先序遍历相同。

**解释：**

先访问根然后再访问孩子，转换后相当于先访问根再访问左子树；然后从左到右访问双亲结点的每个孩子，转换二叉树后，相当于先根后右子树。总体根-\>左-\>右。

**后根遍历：**

先后根遍历每一棵子树，最后访问根；遍历序列与转换后的二叉树的中序遍历相同。

**解释：**

从左到右访问双亲结点的每个孩子，转换二叉树后，相当于先根后右子树；访问完子树后最后访问根，转换后相当于先访问左子树再访问根。总体左-\>根\>右。

### 森林的遍历：

先序遍历森林：从第一个子树开始依次先序遍历。与转换后的二叉树的先序遍历相同。

中序遍历森林：中序遍历子树，访问第一棵树的根，中序遍历其余森林。（类似后根）与转换后的二叉树的中序遍历相同。

### 哈夫曼树：

WPL树的带权路径长度=树中所有叶结点的带权路径长度之和=所有分支结点的权值之和。哈夫曼树WPL最小，即最优二叉树。

构造哈夫曼树：取最小的两个权值，合并加入集合中，选到集合中只剩一个树。

哈夫曼编码是前缀编码：没有一个编码是另一个编码的前缀。

左右是0还是1没有规定，因此构造出的哈夫曼树不唯一，但WPL相同且最优。

当哈夫曼树是满二叉树时，即代表没有更优的编码，其效率等同固定长度编码。

### 并查集：

采用树的双亲表示法作为存储结构，初始化数组每个结点双亲为-1。

**FIND：**

判断元素是否属于同一集合，即查找每个结点所属树的根是否相同。时间复杂度是O(d)，树的深度。极端情况下，单支树查找根的操作是O(n)。

**代码：**

`int Find(int S[],int x){`

`while(S[x]>=0)`

`x=S[x];`

`return x;`

`}`

**UNION：**

根的值仍为-1，其他结点值为结点的根的下标。每次操作前需要一层层往上寻根，合并前提是根不同，即集合不相交。合并时，将一个结点的根的双亲指向另一个结点的根。因此未优化时，将n个独立元素合并为一个集合的最坏时间复杂度是O(n²)。

**代码：**

`int Union(int S[],int x1,int x2){`

`if(Find(x1)==Find(x2)) return;`

`S[Find(x2)]=Find(x1);`

`}`

` `

**优化1：小树合并到大树**

![]({{ '/assets/notes/ds/image007.png' | relative_url }})

**代码：**

`void Union(int S[],int Root1,int Root2){`

`if(Root1==Root2) return;`

`if(S[Root2]>S[Root1]){`

`S[Root1]+=S[Root2];`

`S[Root2]=Root1;`

`}`

`else{`

`S[Root2]+=S[Root1];`

`S[Root1]=Root2;`

`}`

`}`

**优化2：压缩路径**

进一步优化find操作，将根到元素x路径上的所有元素都变成根的孩子。优化后，FIND最坏O(α(n))，UNION最坏O(nα(n))，接近O(4n)。

**代码：**

`int Find(int S[],int x){`

`int root=x;`

`while(S[root]>=0)``     ``//``原因在于存在路径上的元素非根但大于``0`

`root=S[root];`

`while(x!=root){`

`int temp=S[x];``  ``//``暂记非根父节点`

`S[x]=root;``   ``//``本节点变成根的孩子`

`x=temp;``   ``//``从父节点开始继续向上遍历`

`}`

`return root;`

`}`

应用：克鲁斯卡尔检测环路，无向图连通性，无向图是否有环。

**无向图连通性：**

**DFS:**

`void DFS(MGragh G``，``int i){`

`printf("%d",G.vex[i].no)`

`visited[i]=1;`

`for(j=0;j<G.vexnum;j++){`

`if(visited[j]==0 && G.edge[i][j]==1){`

`DFS(G,j);`

`}`

`}`

`}`

` `

`bool visited[MAX_VERTEX_NUM];`

`void DFSTraverse(Gragh G){`

`for(i=0;i<G.vexnum;++i){`

`visited[i]=0;`

`}`

`bool flag=false;`

`int c``ount = 0;`

`DFS(G,i); //``无向图判断连通只需从一个顶点调用一次``DFS`

`if(``c``ount == ``G.vexnum``)`` ``flag = true;                                `

`return flag;`

`}`

` `

**并查集：**

`#include <iostream>`

`#include <vector>`

`using namespace std;`

` `

`#define MAX_NODES 1000``  `

`int parent[MAX_NODES]; `

` `

`int Find(int x) {`

`    ``if (parent[x] < 0) {`

`        ``return x;``  `

`    ``} else {`

`        ``parent[x] = Find(parent[x]);``  `

`        ``return parent[x];`

`    ``}`

`}`

` `

`void Union(int x, int y) {`

`    ``int rootX = Find(x);`

`    ``int rootY = Find(y);`

`    ``if (rootX != rootY) {`

`        ``if (parent[rootX] < parent[rootY]) { `

`            ``parent[rootX] += parent[rootY];`

`            ``parent[rootY] = rootX;`

`        ``} else {`

`            ``parent[rootY] += parent[rootX];`

`            ``parent[rootX] = rootY;`

`        ``}`

`    ``}`

`}`

` `

`bool isGraphConnected(int n, ``Graph G``) {`

`    ``for (int i = 0; i < n; i++) {`

`        ``parent[i] = -1;`

`    ``}`

`    ``for (int i = 0; i < n; i++) {`

`        ``for (int j = 0; j < n; j++) {`

`            ``if (adj[i][j] == 1) {``  `

`                ``Union(i, j);`

`   ``if(!Union(parent, u, v)) { `

`      ``return true;// ``如果无法合并，说明有环 `

` ``  ``}`

`            ``}`

`        ``}`

`    ``}`

`//``判断是否是连通图`

`    ``int root = Find(0);``  `

`    ``for (int i = 1; i < n; i++) {`

`        ``if (Find(i) != root) {`

`            ``return false; `

`        ``}`

`    ``}`

`    ``return true;``  `

` `

` ``   ``//``统计连通分量的数量`

`    ``int count = 0;`

`    ``for (int i = 0; i < n; i++) {`

`        ``if (parent[i] < 0) {``  `

`            ``count++;`

`        ``}`

`    ``}`

` `

`}`

` `

**Kruskal算法：**

`void getEdges(int Graph[][]){`

`vector<Edge> edges;`

`for (int i = 0; i < n; i++) {`

`for (int j = i + 1; j < n; j++) { `

`if (graph[i][j] != 0) { `

`edges.push_back({i, j, graph[i][j]});`

`}`

`}`

`}`

`}`

`int Kruskal(int n, vector<Edge>& edges) {`

`for (int i = 0; i < n; i++) {`

`        ``parent[i] = -1;`

`    ``}`

`    ``sort(edges.begin(), edges.end());`

`    ``int mstWeight = 0;``  `

`    ``int edgeCount = 0;``  `

`for ``(``const auto& edge : sortedEdges) {`

`if (Find(edge.u) != Find(edge.v)) { `

`Union(edge.u, edge.v);``          `

`mstWeight += edge.w;``           `

`edgeCount++;``                    `

`if (edgeCount == n - 1) break;`

`}`

`}`

`return mstWeight;`

`}`

` `
