---
layout: "note"
nav: "notes"
title: "第二章 线性表"
course: "DS"
course_title: "数据结构"
course_url: "/notes/ds/"
chapter: "02"
permalink: "/notes/ds/02-linear-list/"
tags: ["notes", "ds", "data-structures"]
description: "数据结构：第二章 线性表"
date: "2024-05-30 14:55:00 +0800"
archive: true
search: true
previous_note_title: "第一章 绪论"
previous_note_url: "/notes/ds/01-introduction/"
next_note_title: "第三章 栈、队列、数组"
next_note_url: "/notes/ds/03-stack-queue-array/"
---

> **考纲：基本概念、实现（顺序存储，链式存储）、应用**

## 基本概念：相同数据类型的n个数据元素的有限序列，n=0为空表。a1为表头。an为表尾，除第一个元素，每个元素都有一个直接前驱；除最后一个元素，每个元素都有一个直接后继。

### 基本操作：

`InitList(&L);Length(L);LocateElem(L,e);GetElem(L,i);ListInsert(&L,i,e);ListDelete(&L,i,&e);PrintList(L);Empty(L);DestroyList(&L)`

### 顺序表示：

顺序表

**优点：**

通过首地址和元素序号就能随机访问、存储密度高。

**缺点：**

平均时间复杂度：O(n)

插入平均移动n/2个元素，删除平均移动（n-1）/2个元素，需要连续分配空间。

顺序查找（按值查找）等概率平均比较次数（n+1）/2，按序号查找O(1)。

**定义：**

`typedef struct Sqlist{`

`    ``int data[maxSize];`

`    ``int length;`

`}Sqlist;`

` `

`SqList L;`

`L.data=(ElemType*)malloc(sizeof(ElemType)*MaxSize); //C``语言 `

`L.data=new ElemType[MaxSize]; //C++ `` ``int *A=new int[n];`

### 链式表示：

单链表

单链表长度不包括头结点，头结点位序为0。头插法输入数据和元素结点顺序相反；尾插法需要加入一个临时尾指针。

**定义：**

`typedef struct LNode{`

`    ``int data;`

`    ``struct LNode *next;`

`}LNode``，``*Linklist``;`

`Linklist`` L;``//``定义链表`

`Lnode *p``；``//``定义结点`

` `

双链表

为了快速对前驱结点操作，引入了双链表。并没有提高查找速度。

循环单链表

**判空：最后一个结点指针是否指向头结点（t=h）；有时只设尾指针，对表尾插入元素只需要O(1)。**

循环双链表

**判空：头结点前驱和后继都是指向头结点（h-\>prior=h-\>next=h）。**

静态链表

用数组描述链式存储结构，其中指针域是结点数组中的相对地址（数组下标--游标）。预先分配内存，适合FAT文件分配表、内存分配回收表；插入删除无需移动元素，不能随机存取。用next=-1作为结束标志。

**定义：**

`typedef struct{`

`    ``int data;`

`    ``int next;`

`} ``SLinkList[Maxsize]``;`

**顺序表和链表对比：**

1.顺序表可以顺序存取和随机存取，但链表只能从表头开始顺序存取。

2.按值查找：顺序表无序时为O(n)，顺序表有序可以采用折半查找O(logn)。

3.按序号查找：顺序表为O(1)，链表为O(n)。
4.顺序存储动态分配需要移动大量元素，若没有足够空间，会导致分配失败。链表存储密度低，结点内部的存储单元地址连续，操作灵活高效。
