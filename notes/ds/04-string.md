---
layout: "note"
nav: "notes"
title: "第四章 串"
course: "DS"
course_title: "数据结构"
course_url: "/notes/ds/"
chapter: "04"
permalink: "/notes/ds/04-string/"
tags: ["notes", "ds", "data-structures"]
description: "数据结构：第四章 串"
date: "2024-06-03 16:23:00 +0800"
archive: true
search: true
previous_note_title: "第三章 栈、队列、数组"
previous_note_url: "/notes/ds/03-stack-queue-array/"
next_note_title: "第五章 树与二叉树"
next_note_url: "/notes/ds/05-tree-and-binary-tree/"
toc:
  - id: section-1
    label: "基本概念：串是由零个或多个字符组成的有限序列（内容受限的线性表），字符个数=0时为空串。串的数据对象限定为字符集，基本操作以子串为对象。"
---

> **考纲：模式匹配**

## 基本概念：串是由零个或多个字符组成的有限序列（内容受限的线性表），字符个数=0时为空串。串的数据对象限定为字符集，基本操作以子串为对象。
{: #section-1 }

### 存储结构：

**顺序存储：**

定长字符数组，串长用“\0”不计入串长的结束标记字符隐含表示。

**定义：**

`typedef struct {`

`    ``char str[maxSize+1];``  ``// ``多出一个``'\0'``作为结束标记`

`    ``int length;`

`}``S``Str;`

**堆分配：**

**定义：**

`typedef struct {`

`    ``char *ch;``  ``// ``指向动态分配存储区首地址的字符指针`

`    ``int length;``  `

`}``H``Str;`

**块链存储:**

每个结点存放1个或多个字符。

### 简单匹配（求子串（模式串）在主串中的位置）：

匹配到子串结尾，则匹配成功；反之，将子串移动到主串下一位重新匹配（主串指针回溯）。

最坏时间复杂度O(mn)——当每次都是匹配到子串最后一位不符，而后主串指针回溯，相当于主串每个字符都和子串每个字符匹配一次。

朴素匹配只有在出现很多部分匹配的情况下，频繁回溯开销大，一般情况下也接近O(m+n)。

**代码：**

`int Index(Sstring S,Sstring T){``     ``//``主串``S``，模式串``T`

`int i=1;j=1;`

`while(i<=S.length &&j<=T.length){`

`if(S.ch[i]==T.ch[j]){`

`++i; ++j;`

`}`

`else{`

`i=i-j+2;``     ``//``主串回溯到下一个位置，模式串从头开始`

`j=1;`

`}`

`}`

`if(j>T.length) return i-T.length;`

`else return 0;`

`}`

### KMP：

**算法思想：**

主串指针不必回溯，模式串指针根据next数组部分回溯（如果已匹配相等的前缀序列中有某个后缀正好是模式的前缀，可以将模式串向后滑动到与这些相等字符对齐的位置）。KMP时间复杂度是O(m+n),其中求next数组O(n),匹配O(m)。

**next数组：**

**数组含义:**

当子串第j个字符发生匹配失败时，跳到子串的next\[j\]处重新与主串当前位置比较。

**next\[1\]=0：**

当主串和模式串第一个字符就不同时，应将主串当前字符和子串第一个字符前面的空对齐，即模式串右移，即主串的下个位置和模式串的第一个位置继续比较。即算法中++i,++j。

**next\[j\]=k：**

表明匹配失败时应该去找模式串第k个字符，那么如何求next\[j+1\]就需要通过递推关系。

若第j个字符和第k个字符相等，那么前k-1位组成的串的最长相等前后缀+1，即next\[j+1\]=next\[j\]+1,即模式串第j+1位字符匹配失败从k+1位开始比较。

反之，若不等，则问题转换为找更小的公共前后缀，即等于用前缀去匹配后缀，应将模式串第next\[k\]个字符和第j个字符比较，若不相等，则继续嵌套next\[next\[k\]\]与其比较。都不满足，即不存在更短的相等前后缀，让next\[j+1\]=1。

**求next数组算法实现：**

`void get_next(Sstring T,int next[]){`

`int i=1;j=0;`

`next[1]=0;`

`while(i<T.length){`

`if(j==0||T.ch[i]==T.ch[j]){`

`++i;++j;`

`next[i]=j;``     ``//next[j+1]=next[j]+1`

`}`

`else`

`j=next[j];`

`}`

`}`

**KMP算法实现：**

`int Index_KMP(Sstring S,Sstring T){`

`int i=1;j=1;`

`int next[T.length+1];`

`get_next(T,next);`

`while(i<=S.length&&j<=T.length){`

`if(j==0||S.ch[i]==S.ch[j]){`

`++i;++j;`

`}`

`else`

`j=next[j];`

`}`

`if(j>T.length) return i-T.length;`

`else return 0;`

`}`

**nextval数组：**

但是上述算法仍然存在缺陷，当next\[j\]位字符和j位字符相等时，匹配失败时将重复比较仍会失败的相同字符。例如第j位是a,当前主串的位是b，不符合找next\[j\]与b比较，next\[j\]这一位仍然和刚刚第j位一样是a，就会重复比较。因此不应该出现这样的情况，算法需要加一步出现相等情况时，递归修正next\[next\[j\]\]直至不相等为止。

`if(j==0||T.ch[i]==T.ch[j]){`

`++i;++j;`

`if(T.ch[i]!=T.ch[j]) nextval[i]=j;`

`else nextval[i]=nextval[j];`

`}`

**手工计算next数组：**

next\[1\]=0,next\[2\]=1,其余是看，前面j-1位组成的串的最长相等前后缀（前后缀不能是整个串）+1，相当于从相等前后缀的下一个位置开始匹配。

若串的位序从0开始，则next数组全部-1。

**手工计算nextval数组：**

在next数组基础上比对，若模式串第j个字符和第next\[j\]个字符相等，则让nextval\[i\]=next\[next\[i\]\]。
