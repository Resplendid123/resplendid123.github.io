---
layout: "note"
nav: "notes"
title: "第三章 栈、队列、数组"
course: "DS"
course_title: "数据结构"
course_url: "/notes/ds/"
chapter: "03"
permalink: "/notes/ds/03-stack-queue-array/"
tags: ["notes", "ds", "data-structures"]
description: "数据结构：第三章 栈、队列、数组"
date: "2024-06-01 16:24:00 +0800"
archive: true
search: true
previous_note_title: "第二章 线性表"
previous_note_url: "/notes/ds/02-linear-list/"
next_note_title: "第四章 串"
next_note_url: "/notes/ds/04-string/"
toc:
  - id: section-1
    label: "基本概念：栈、队列、串是操作受限的线性表，数组是线性表的推广。"
---

> **考纲：基本概念、实现（顺序存储，链式存储）、多维数组的存储、特殊矩阵的压缩存储、应用**

## 基本概念：栈、队列、串是操作受限的线性表，数组是线性表的推广。
{: #section-1 }

![]({{ '/assets/notes/ds/image002.png' | relative_url }})
n个不同元素进栈，出栈元素不同排序个数为（n个元素能构成多少种不同的二叉树）

### 栈基本操作：

`InitStack(&S);StackEmpty(S);Push(&S,x);Pop(&S,&x);GetTop(S,&x);DestroyStack(&S)`

### 顺序栈

栈空条件：S.top==-1（入栈时先++）;栈满条件：S.top=Maxsize-1（出栈时后--）; 栈长：S.top+1（top始终指向栈顶元素）。入栈可能发生上溢，受限数组上界。

**代码：**

`typedef struct SqStack{`

`    ``int data[maxSize];`

`    ``int top;`

`} SqStack;`

### 共享栈

两个栈共享一个一维数组空间，栈顶相接。栈空：top1=-1或top2=Maxsize；栈满：top2-top1=1。

### 链栈

不存在上溢，规定所有操作在单链表表头进行，因此栈顶指针一定是链头，每次出栈入栈都要修改栈顶指针。无论是顺序栈还是链式栈都只能顺序访问。

**定义：**

`typedef struct L``ink``Node{`

`    ``int data;`

`    ``struct L``ink``Node *next;`

`} L``inkStack``;`

### 队列基本操作：

`InitQueue(&Q);QueueEmpty(Q);EnQueue(&Q,x);DeQueue(&Q,&x);GetHead(Q,&x)`

### 队列的顺序存储：

队头指针指向队头元素，队尾指针指向队尾元素的下一个位置。存取元素时，队头出、队尾入。

初始时：Q.front=Q.rear=0，作为判空条件。Q.rear=Maxsize不能作为队满条件，因为出队的位置空闲，但上溢（假溢）。

**定义：**

`typedef struct {`

`    ``int data[maxSize];`

`    ``int front;``  `

`    ``int rear;``  `

`}SqQueue;`

### 用循环队列解决上述问题:

`初始：``Q.front=Q.rear=0`
`入队：``Q.rear=(Q.rear+1)%Maxsize`

`出队：``Q.front=(Q.front+1)%Maxsize`

`队长：``(Q.rear+Maxsize-Q.front)%Maxsize`

`判空：``Q.front=Q.rear``（不一定是``0``），当队尾赶上队头，同样可作为队满条件。`

**判满：**

**1.牺牲一个单元区分队空/队满**

队满：（Q.rear+1）%Maxsize==Q.front

**2.增加size成员，表示元素个数**

**队空：Q.size=0，队满：Q.size=Maxsize；**

**3.增加tag成员**

删除成功置tag=0，若导致Q.front=Q.rear，则为队空，插入成功置tag=1，若导致Q.front=Q.rear，则为队满。

### 链队列

一般用带头结点的头+尾2个指针。

`判空：``Q.front=NULL``或`` Q.rear==NULL``。`

入队时，修改新建节点，并修改尾指针；

出队时，删除节点，修改头指针。当出队最后一个元素时，需要修改头尾指针都指向头结点。

**队结点类型定义：**

`typedef struct QNode {`

`    ``int data;``  `

`    ``struct QNode *next;``   `

`}QNode;`

**链式队列定义：**

`typedef struct {`

`    ``QNode *front;``  `

`    ``QNode *rear;`

`}LiQueue;`

### 双端队列

输出受限&&输入受限，其中一端只允许插入（删除）

**2个队列模拟栈：**

push时，将元素入队其中一个队列；pop时，将非空队列依次出队，入队另一个队列，直至非空队列只剩一个元素，实现后入先出。

**1个队列模拟栈：**

push时，将队列中前面的元素重新跟在新元素后入队。

**2个栈模拟队列：**

push时，将元素先入输入栈，pop出队时，若输出栈非空，则将输入栈中元素全部依次pop，push入输出栈中，而后pop栈顶元素。

### 栈应用：

**括号匹配：**

将输入的括号读入栈，当元素为左括号时，入栈对应的右括号，当入栈右括号时，匹配与栈顶是否相同，相同则出栈（说明是右括号匹配对应左括号）。失败情况：不匹配、匹配完成栈中还有元素、遇到右括号时栈空。

**代码：**

`Bool BracketsCheck(char *str){`

`InitStack(S);`

`int i=0;`

`while(str[i]!='\0'){`

`Switch(str[i]){`

`Case '(': Push(S,'('); break;`

`Case '[': Push(S,'['); break;`

`Case '{': Push(S,'{'); break;`

`Case ')': Pop(S,e);`

`if(e!='(') return false;`

`Break;`

`Case ']': Pop(S,e);`

`if(e!='[') return false;`

`Break;`

`Case '}': Pop(S,e);`

`if(e!='{') return false;`

`Break;`

`Default;`

`Break;`

`}`

`i++;`

`}`

`if(!isEmpty(S)){`

`printf("``括号不匹配``\n");`

`return false;`

`}`

`else{`

`printf("``括号匹配``\n");`

`return true;`

`}`

`}`

**中缀转后缀：**

`1.``操作数直接加入后缀表达式；`

`2.``运算符优先级``高``于栈顶入栈，左括号直接入栈；`

`3.``优先级``小于等于``栈顶的运算符和右括号，依次弹出栈顶，直到栈顶运算符优先级低于它或者弹出左括号为止，再入栈；`

`最后剩下的出栈。检查方法可画二叉树，后序遍历即为后缀表达式。`

![]({{ '/assets/notes/ds/image003.png' | relative_url }})

**后缀求值：**

从左往右扫描，操作数直接入栈，遇到运算符弹出两个操作数，运算结果入栈。

**前缀求值：**

从右往左扫描，先弹出的是左操作数。

**递归：**

重复计算多，效率低，但代码简洁。

### 队列应用：

**层次遍历：入队根节点。队空，遍历完毕。出队第一个，而后入队它的孩子。**

**缓冲区：主机外设速度不匹配。**

**调度队列：资源竞争。**

页面替换算法

广度优先算法

### 数组：

数组是线性表的推广，一维数组可视为一个线性表，二维数组可视为其元素是定长数组的线性表。数组一旦被定义，其维数和维界就不能改变，只有存取和修改操作。

二维数组
按行优先/按列优先存储。

**压缩存储：**

值相同的元素分配一个存储空间，0元素不分配。

**特殊矩阵：**

许多相同元素和0元素且分布有规律的矩阵。

**对称矩阵：**

占用n(n+1)/2 (i\>=j)

**上下三角矩阵：**

占用n(n+1)/2+1 (i\>=j)，这一个+1是上/下三角相同元素的占用空间。

**三对角矩阵：**

\|i-j\|\>1时,aij=0，且a(i, j)与B\[n\]对应关系为：k = 2i + j - 3。

**稀疏矩阵：**

需要保存三元组表，矩阵行数，列数，非零元素个数（用于判断矩阵大小）；存储三元组表可以用十字链表或数组存储。

三元组表（行标，列标，值）：存非0元素，压缩存储后失去随机存取特性。

![]({{ '/assets/notes/ds/image004.png' | relative_url }})
