---
layout: "note"
nav: "notes"
title: "第八章 排序"
course: "DS"
course_title: "数据结构"
course_url: "/notes/ds/"
chapter: "08"
permalink: "/notes/ds/08-sort/"
tags: ["notes", "ds", "data-structures"]
description: "数据结构：第八章 排序"
date: "2024-06-10 18:24:00 +0800"
archive: true
search: true
previous_note_title: "第七章 查找"
previous_note_url: "/notes/ds/07-search/"
toc:
  - id: section-1
    label: "基本概念："
  - id: section-2
    label: "插入排序："
  - id: section-3
    label: "交换排序："
  - id: section-4
    label: "选择排序："
  - id: section-5
    label: "归并排序："
  - id: section-6
    label: "基数排序："
  - id: section-7
    label: "计数排序："
  - id: section-8
    label: "内部排序比较："
  - id: section-9
    label: "外部排序："
---

> **考纲：基本概念、插入排序（直接插入、折半插入、希尔排序）、交换排序（冒泡、快速）、选择排序（简单选择、堆排序）、归并排序、基数排序、外部排序、算法分析应用**

## 基本概念：
{: #section-1 }

对于关键字允许重复的的待排序表中，需要考虑算法的稳定性，即相同关键字对应的记录在排序前后的相对位置是否一致。

根据排序期间元素是否全部在内存分为内部排序和外部排序。

基数排序不基于比较操作。

![]({{ '/assets/notes/ds/image047.png' | relative_url }})

## 插入排序：
{: #section-2 }

### 直接插入排序：

**算法思想：**

每一趟从后往前顺序查找插入位置，当前元素和前面已有序的元素边比较边后移。利用哨兵在A\[0\]处暂存待排元素，若比前驱元素小，前驱向后移位，直至大于等于前驱，此时的位置赋给待排元素。

**空间复杂度：**

O(1)

**时间复杂度：**

总时间复杂度O(n²)。

最好情况：有序O(n)，只需比较n-1次，无需移动；

最差情况：逆序O(n²)，比较n(n-1)/2次，移动n(n-1)/2次。

**比较次数和移动次数：**

比较次数和移动次数取决于初始状态。

**一趟排序是否能确定一个元素的最终位置：**

不能，例如最后一个待排元素是最小元素。第一趟从第二个元素开始。

**稳定性：**

稳定，因为原始序列中，关键字相同的元素靠后的后插入，即排在相同元素之后。

**适用性：**

基本有序以及数据量不大的顺序表和链表（无需移动元素）。

**代码：**

`void InsertSort(ElemType A[],int n){`

`int i,j;`

`for(i=``2``;i<=n;i++){`

`if(A[i]<A[i-1]){`

`A[0]=A[i];`

`for(j=i-1;A[0]<A[j];--j){`

`A[j+1]=A[j];`

`}`

`A[j+1]=A[0];`

`}`

`}`

`}`

### 折半插入排序：

为了减少直接插入排序中元素的比较次数，引入了折半插入排序。

**算法思想：**

每一趟先通过折半查找得到当前元素应该插入前面已有序序列中的位置，后半部分一次性移动，空出位置插入。

**空间复杂度：**

O(1)

**时间复杂度：**

总时间复杂度O(n²)

![]({{ '/assets/notes/ds/image048.png' | relative_url }})

**比较次数和移动次数：**

比较次数取决于表中元素个数n，移动次数取决于初始状态。

**一趟排序是否能确定一个元素的最终位置：**

不能，理由同插入排序。

**稳定性：**

稳定

**适用性：**

适用于顺序表。

**代码：**

`void Binary_InsertSort(ElemType A[],int n){`

`int i,j,low,high,mid;`

`for(i=2;i<=n;i++){`

`A[0]=A[i];`

`low=1;high=i-1;`

`while(low<=high){`

`mid=(low+high)/2;`

`if(A[mid]>A[0])`

`high=mid-1;`

`else`

`low=mid+1;`

`}`

`for(j=i-1;j>=high+1;--j) //``后移元素留出空位`

`A[j+1]=A[j];`

`A[high+1]=A[0];`

`}`

`}`

### 希尔排序（缩小增量排序）：

为了减少直接插入排序中元素的移动次数，引入了希尔排序。

**算法思想：**

先将整个待排序列按增量间隔分割为若干子序列，分别进行直接插入排序，待整个序列中的记录基本有序时，即当增量取1时，再对全体记录进行1次直接插入排序。

**空间复杂度：**

O(1)

**时间复杂度：**

![]({{ '/assets/notes/ds/image049.png' | relative_url }})

**比较次数和移动次数：**

比较次数和移动次数取决于初始状态与选取的增量序列。

**一趟排序是否能确定一个元素的最终位置：**

不能

**稳定性：**

不稳定，例如序列2、1、1\*、3，排序后1\*、1、2、3。

**适用性：**

适用于顺序表。

**代码：**

`void ShellSort(ElemType A[],int n){`

`int dk,i,j;`

`for(dk=n/2;dk>=1;dk=dk/2){`

`for(i=dk+1;i<=n;++i){`

`if(A[i]<A[i-dk]){`

`A[0]=A[i];`

`for(j=i-dk;j>0&&A[0]<A[j];j-=dk){`

`A[j+dk]=A[j];`

`}`

`A[j+dk]=A[0];`

`}`

`}`

`}`

`}`

## 交换排序：
{: #section-3 }

### 冒泡排序：

**算法思想：**

从前往后（最大沉底）或从后往前（最小冒泡）比较相邻元素值，逆序则交换。每一趟把待排最小元素上浮到待排序列第1个位置，或把待排最大元素下沉到待排序列最后一个位置，最多n-1趟就能把所有元素排完。

**空间复杂度：**

O(1)

**时间复杂度：**

总时间复杂度O(n²)。

最好情况：有序O(n)，只需比较n-1次，无需移动；

最差情况：逆序O(n²)，比较n(n-1)/2次，移动3n(n-1)/2次。

**比较次数和移动次数：**

比较次数和移动次数取决于初始状态。

**一趟排序是否能确定一个元素的最终位置：**

能，每一趟确定一个最小的或最大的。

**稳定性：**

稳定，相同元素不会交换，相对顺序不变。

**适用性：**

适用于顺序表和链表。

**代码：**

`void BubbleSort(ElemType A[],int n){`

`for(int i=0;i<n-1;i++){`

`bool flag=false;`

`for(int j=n-1;j>i;j--){`

`if(A[j-1]>A[j]){`

`swap(A[j-1],A[j]);`

`flag=true;`

`}`

`}`

`if(flag==false) return;`

`}`

`}`

### 快速排序：

**算法思想：**

基于分治法，选取任意一个元素作为基准（通常是首元素），将表按基准排序后分成两部分，左边小于该元素，右边大于该元素（即对每个划分的排序就有一个元素在最终位置）再分别对这两部分递归排序划分，直至每部分划分为1个元素。

**排序过程：**

一趟排序（包含多次划分的排序）是通过交替搜索、交换的过程，high指针从后往前找到比基准小的元素，与基准交换，而后low指针从前往后找到比基准大的元素，与基准交换，直至首尾指针相遇。该交换在算法中是只移动了被交换元素，基准元素是一开始暂存，最后一次性直接移动到首尾指针相遇的位置。

**算法优化：**

划分越均匀对称，递归深度小，算法表现越好。提高划分的均匀性可以通过每次选表中头、中、尾取中间值作为基准，或随机选元素作为基准，避免最坏情况出现。快排是所有算法里平均性能最优的排序算法。

**空间复杂度：**

![]({{ '/assets/notes/ds/image050.png' | relative_url }})

最坏情况：序列基本有序（顺序和逆序），栈深O(n)。

**时间复杂度：**

![]({{ '/assets/notes/ds/image051.png' | relative_url }})

![]({{ '/assets/notes/ds/image052.png' | relative_url }})

![]({{ '/assets/notes/ds/image053.png' | relative_url }})

**比较次数和移动次数：**

每个划分的比较次数是该序列长度-1（首尾指针相遇的移动次数和）。元素的移动次数是元素位置改变的个数。

**一趟排序是否能确定一个元素的最终位置：**

若选取基准第一趟之后排在首端或末端，第二趟只会选取一个基准，否则第二趟会选取两个基准，总共在第二趟结束时，会有3个确定最终位置的元素。而且最终位置的含义是左边都比它小，右边都比它大；如真题2023.11。

**稳定性：**

不稳定

**适用性：**

适用于顺序表。

**代码：**

`void QuickSort(ElemType A[],int low,int high){`

`if(low<high){`

`int pivot=Partition(A,low,high);`

`QuickSort(A,low,pivot-1);`

`QuickSort(A,pivot+1,high);`

`}`

`}`

`int Partition(ElemType A[],int low,int high){`

`ElemType pivot=A[low];``     ``//``第一个元素为枢纽`

`while(low<high){`

`while(low<high&&A[high]>=pivot) --high;`

`A[low]=A[high];`

`while(low<high&&A[low]<=pivot) ++low;`

`A[high]=A[low];`

`}`

`A[low]=pivot;`

`return low;`

`}`

## 选择排序：
{: #section-4 }

### 简单选择排序：

**算法思想：**

每一趟选择待排序列中最小的元素与当前位置元素交换。

**空间复杂度：**

O(1)

**时间复杂度：**

![]({{ '/assets/notes/ds/image054.png' | relative_url }})

**比较次数和移动次数：**

比较次数始终是n(n-1)/2次；

移动次数与初始状态有关，最差情况（不是逆序）不超过3(n-1)次，最好情况（有序）移动0次。

**一趟排序是否能确定一个元素的最终位置：**

能，每一趟选择一个最小的或最大的。

**稳定性：**

不稳定，例如序列2、2\*、1；排序后1、2\*、2。

**适用性：**

适用于顺序表和链表。即使元素基本有序，它仍然要排完，冒泡可以提前结束。

**代码：**

`void SelectSort(ElemType A[],int n){`

`for(int i=0;i<n-1;i++){`

`int min=i;`

`for(int j=i+1;j<n;j++){`

`if(A[j]<A[min]){`

`min=j;`

`}`

`}`

`if(min!=i) swap(A[i],A[min]);``    ``//``每一轮与记录的最小元素位置交换`

`}`

`}`

### 堆排序：

**堆基本概念：**

堆是一棵完全二叉树，建堆有两种方法，一种是根据序列直接调整成最小/最大堆，一种是便插入边调整建立新堆。堆的插入只能在数组尾部，堆的删除只能在堆顶删除。

**算法思想：**

![]({{ '/assets/notes/ds/image055.png' | relative_url }})

**空间复杂度：**

O(1)

**时间复杂度：**

![]({{ '/assets/notes/ds/image056.png' | relative_url }})

**比较次数和移动次数：**

建堆时，比较次数不超过4n，时间复杂度O(n)。之后n-1趟输出序列需要n-1次向下调整。

移动次数取决于元素交换次数，和调整路径上的元素移动次数有关。

**一趟排序是否能确定一个元素的最终位置：**

能，每一趟选择一个最小的或最大的。

**稳定性：**

不稳定

**适用性：**

适用于顺序表，关键字较多的情况。例如从海量的数选最大的100个数，建立一个最小堆，比堆顶小的，直接丢，比它大的取代堆顶向下调整。

**代码：**

`void BuildMaxHeap(ElemType A[],int len){`

`for(int i=len/2;i>0;i--)`

`Headjust(A,i,len);`

`}`

`void HeadAdjust(ElemType A[],int k,int len){`

`A[0]=A[k];``     ``//``暂存子树根结点`

`for(int i=2*k;i<=len;i*=2){``     ``//``向下筛选`

`if(i<len&&A[i]<A[i+1]) i++; //``左孩子``<``右孩子`

`if(A[0]>=A[i]) break;`

`else{`

`A[k]=A[i];``     ``//``将孩子上移置根的位置`

`k=i;``     ``//``记录被移动的孩子位置`

`}`

`}`

`A[k]=A[0];``     ``//``一步将根节点换到最终位置`

`}`

A\[0\]是暂存结点，A\[1\]是堆顶，每次把堆顶换到A\[i\]，调整A\[1\]到A\[i-1\]这个堆，i--，相当于把大根堆顶先输出在后面的位置，最后是升序序列。

`void HeapSort(ElemType A[],int len){`

`BuildMaxHeap(A,len);`

`for(int i=len;i>1;i--){`

`Swap(A[i],A[1]);`

`HeadAdjust(A,1,i-1);`

`}`

`}`

## 归并排序：
{: #section-5 }

**算法思想：**

![]({{ '/assets/notes/ds/image057.png' | relative_url }})

**空间复杂度：**

辅助数组B在归并前，先将元素拷贝，然后再通过比较将元素填入A，空间复杂度为O(n)。

**时间复杂度：**

![]({{ '/assets/notes/ds/image058.png' | relative_url }})

**比较次数和移动次数：**

比较次数和移动次数取决于表中元素个数n。

**一趟排序是否能确定一个元素的最终位置：**

不能

**稳定性：**

稳定，算法通过保持相对顺序不变实现。

**适用性：**

适用于顺序表和链表。

**代码：**

`ElemType *B=(ElemType *) malloc ((n+1)*sizeof(ElemType));`

`void Merge(ElemType A[],int low,int mid,int high){`

`int i,j,k;`

`for(k=low;k<=high;k++)`

`B[k]=A[k];`

`for(i=low,j=mid+1;k=i;i<=mid&&j<=high;k++){`

`if(B[i]<=B[j])`

`A[k]=B[i++];`

`else`

`A[k]=B[j++];`

`}`

`while(i<=mid) A[k++]=B[i++];``    ``//``这两个循环只有一个循环起作用`

`while(j<=high) A[k++]=B[j++];`

`}`

`void MergeSort(ElemType A[],int low,int high){`

`if(low<high){`

`int mid=(low+high)/2;`

`MergeSort(A,low,mid);`

`MergeSort(A,mid+1,high);`

`Merge(A,low,mid,high);`

`}`

`}`

## 基数排序：
{: #section-6 }

最高位优先（MSD），按关键字位的权重递减排序，需要划分子桶递归排序；最低位优先（LSD），按关键字位的权重递增分配和收集。

**算法思想：**

每趟分配按照位的权重决定入队顺序。关键字整体递增和递减取决于收集队列的顺序，如下是LSD递增和递减的分配收集过程。

**LSD：**

**最终序列递减：**

第一趟以个位分配入队，收集时以个位递减排列；

第二趟以十位分配入队，个位大的先入对应位的队列，即收集时以十位递减排列且十位相同的个位递减；

第三趟以百位分配入队，十位大的先入对应位的队列，收集时以百位递减排列。

**最终序列递增：**

第一趟以个位分配入队，收集时以个位递增排列；

第二趟以十位分配入队，个位小的先入对应位的队列，即收集时以十位递增排列且十位相同的个位递增；

第三趟以百位分配入队，十位小的先入对应位的队列，收集时以百位递增排列。

**空间复杂度：**

r进制数需要分配r个队列，r个队头指针和队尾指针，空间复杂度是O(r)。若是顺序存储则是O(n+r)。

**时间复杂度：**

采用静态链表，需要d趟分配和收集操作，一趟分配要遍历所有关键字O(n)，一趟收集需要合并r个队列O(r),总时间复杂度O(d(n+r))。

**比较次数和移动次数：**

不基于比较和移动的排序算法，时间复杂度与初始状态无关。

**一趟排序是否能确定一个元素的最终位置：**

不能

**稳定性：**

稳定，每位的排序都保持相同值相对顺序的不变。

**适用性：**

适用于关键字位数较少的顺序表和链表。

## 计数排序：
{: #section-7 }

**算法思想：**

对于每个元素，记录小于该元素的个数，就可以确定它的位置。

**空间复杂度：**

空间复杂度为O(n+k),辅助计数数组长度和输出数组长度。

**时间复杂度：**

![]({{ '/assets/notes/ds/image059.png' | relative_url }})

**比较次数和移动次数：**

不基于比较的排序算法，时间复杂度与初始状态无关。

**一趟排序是否能确定一个元素的最终位置：**

不能

**稳定性：**

稳定，从后往前遍历+最后一句是让相同元素排在前面，保证稳定性。

**适用性：**

适用于元素是整数且范围在0~k-1的顺序表。

`void CountSort(ElemType A[],ElemType B[],int n,int k){`

`int i,C[k];`

`for(i=0;i<k;i++)`

`C[i]=0;`

`for(i=0;i<n;i++)`

`C[A[i]]++;`

`for(i=1;i<k;i++)`

`C[i]=C[i]+C[i-1];``    ``//C[]``保存比它元素小的数量，即递增序列的第几位`

`for(i=n-1;i>=0;i--){`

`B[C[A[i]-1]=A[i];``     `

`C[A[i]]=C[A[i]]-1;`

`}`

`}`

## 内部排序比较：
{: #section-8 }

稳定性：直接插入、折半插入、冒泡、归并、基数。

只适用顺序存储：折半插入、希尔、快速、堆
一趟确定最终位置：冒泡、选择、快速（不止一个位置）

适用元素个数少：直接插入（移动较多）、简单选择

适用元素个数多：快速、归并、堆

比较次数一定：基数（不基于比较）、简单选择、折半插入

排序趟数与初始状态无关：选择、插入、基数、归并

可并行化：归并、快速、希尔

![]({{ '/assets/notes/ds/image060.png' | relative_url }})

## 外部排序：
{: #section-9 }

**算法思想：**

对大文件进行排序，因为文件中的记录很多，无法将整个文件复制到内存进行排序。需要将待排序的记录存储在外存上，排序时再把数据多次调入内存进行排序。

**时间复杂度：**

外部排序总时间=内部排序时间+外存读写时间+内部归并时间，主要由磁盘I/O次数决定。

**磁盘I/O次数：**

内部排序时间：即生成初始归并段，每一块磁盘块先读入内存进行排序后写回磁盘。（每一块读一次、写一次）

内部归并时间：每一趟归并都会将所有数据从磁盘读入内存，归并完再从磁盘写回内存。（每一块读一次、写一次）

两部分和=文件磁盘块数\*2（读+写）\*（1+归并趟数）。

### 多路平衡归并：

k路平衡归并要求每趟归并后的段数是/k。

**优化思路：**

![]({{ '/assets/notes/ds/image061.png' | relative_url }})

**算法步骤：**

**1.生成r个初始归并段**

归并排序要求各个子序列有序，因此根据内存缓冲区大小，将外存文件分为r个子文件，依次读入内存并利用内部排序方法进行排序，并将内部有序的子文件重新写回外存。

**2.s趟k路归并**

多路归并时，先把各个归并段的第一个磁盘块读入各个输入缓冲区，进行内部排序。

当输出缓冲区满，就将排好序的块依次写入磁盘。

当输入缓冲区为空时，需要立即把对应归并段的下一块磁盘读入缓冲区，然后再和另一个缓冲区中的元素比较，避免造成排序混乱。

![]({{ '/assets/notes/ds/image062.png' | relative_url }})

### 败者树：

**优化思路：**

1.增大归并路数，会开辟多个内存缓冲区，内存开销增大。

![]({{ '/assets/notes/ds/image063.png' | relative_url }})

**算法步骤：**

败者树可视为一棵完全二叉树，k个叶结点存放k个归并段当前比较的元素。内部结点用来记忆左右子树的失败者，胜利者继续向上比较。例如递增排序，则大的为失败者，小的为胜利者，根结点指向的数是最小数。

**比较次数分析：**

![]({{ '/assets/notes/ds/image064.png' | relative_url }})

引入败者树后，内部归并的比较次数与归并路数k无关，只要内存允许，增大k就会有效减少归并树的高度。

**限制：**

归并路数不能无限制增加，开辟内存缓冲区越多，在内存总容量不变的情况下，一个内存缓冲区若小于一个磁盘块大小，会增加读写磁盘的次数。

![]({{ '/assets/notes/ds/image065.png' | relative_url }})

### 置换-选择排序：

**优化思路：**

增大归并段长度，减少归并段个数。初始归并段长度依赖于内存工作区（输入缓冲区的总和）的大小，但通过置换-选择排序能够获得比工作区更长的初始归并段。

**算法步骤：**

1.假设内存工作区只能存w个记录，先读入w个记录。

2.比较出最小的关键字，放到输出缓冲区，并记录这个值为minimax。

3.待排文件不为空，则读一个记录到输入缓冲区。

4.在工作区中比minimax大的记录中选出最小的，放到输出缓冲区，记为新的minimax。

5.重复2-4，直至工作区选不出新的minimax为止，由此得到一个初始归并段，给输出缓冲一个结束标记。

6.重复2-5，直至工作区为空。

选minimax的过程通过败者树实现，读入记录和写回记录的过程都是按磁盘块整体读入读出。

![]({{ '/assets/notes/ds/image066.png' | relative_url }})

### 最佳归并树：

**优化思路：**

由于置换-选择排序，生成的每个初始归并段长度不同。归并树的WPL\*2=磁盘I/O次数。若对于k叉归并树来说，结点总数无法构成一个严格的归并树（正则k叉树），需要增加长度为0的虚段，再进行k叉哈夫曼树的构造。

补充虚段后结点个数应该是能让m-1整除k-1的数。（m是初始归并段个数）

**公式推导：**

初始归并段个数m+补充虚段个数n=n0（都是度为0的结点）

正则k叉树只有度为k和0的结点，因此nk+n0=n；由于边数=度数和=结点数-1，因此n-1=k\*nk。

所以nk=（n0-1）/（k-1），由于度为k的结点数量为正整数，所以补充后n0-1能够整除k-1。

新增--算法应用

2024年9月13日

9:43

### 求双亲：

`TreeNode *getParent(TreeNode *root, TreeNode *p)`

`{`

`if(root == NULL||root == p) return null;`

`if(root->left==p||root->right==p) return root;`

`TreeNode *left=getParent(root->left, p);`

`TreeNode *right=getParent(root->right, p);`

`if(left!= NULL || right!= NULL) return left ? left : right;`

`}`

` `

### 求最近公共祖先

**二叉树：**

`TreeNode *CommonAncestor(TreeNode *root, TreeNode *p, TreeNode *q)`

`{`

`if(root == NULL||root == p ||root == q) return root;`

`TreeNode *left=CommonAncestor(root->left, p, q);`

`TreeNode *right=CommonAncestor(root->right, p, q);`

`if(left!= NULL && right!= NULL) return root;`

`return left ? left : right;`

`}`

**二叉搜索树：**

`TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) `

`{`

`TreeNode* ancestor = root;`

`while (true) `

`{`

`if(p->val<ancestor->val && q->val<ancestor->val) ancestor=ancestor->left;`

`else if(p->val>ancestor->val && q->val>ancestor->val) ancestor=ancestor->right;`

`else``  ``break;`` //``分叉点就是祖先`

`}`

`return ancestor;`

`}`

` `

### 二叉树逆置层序遍历：

`void InvertLevelOrder(Btree T)`

`{`

`InitStack(S);`

`InitQueue(Q);`

`Btree *p;`

`while(T!=NULL){`

`EnQueue(Q,T);`

`while(!isEmpty(Q)){`

`Dequeue(Q,p);`

`push(S,p);`

`if(p->lchild!=NULL) Enqueue(Q,p->lchild);`

`else if(p->rchild!=NULL) Enqueue(Q,p->rchild);`

`}`

`while(isEmpty(S)){`

`pop(S,p);`

`printf(%c,p->data);`

`}`

`}`

`}`

` `

### 二叉树右视图层序遍历：

`int *rightSideView(Treenode *root,int n)`

`{`

`Treenode queue[n];int front=-1,rear=-1;`

`int last=0,index=0;`

`Treenode *p;`

`queue[++rear]=p;`

`int[] *ans=(int *)malloc(sizeof(int)*n)`

`while(front<rear){`

`p=Queue[++front];``  ``//``出队时``front``队首指针指向出队的元素`

`if(p->lchild!=NULL) queue[++rear]=p->lchild;`

`else if(p->rchild!=NULL) queue[++rear]=p->rchild;`

`else if(front==last){``  ``//``出队出到上一层最右边结点时，更新这一层的最右指针。`

`ans[index++]=p->val;`

`last=rear;`

`}`

`}`

`return ans;`

`}`

` `

### 二叉树WPL

`int WPL(BiTree root){`
`     ``return preOrder(root,0);`

`}`

`int wpl_preOrder(BiTree root,int deep){`

`int lwpl,rwpl;`

`if(root->lchild==NULL && root->rchild==NULL) return deep*root->weight;`

`if(root->lchild!=NULL) lwpl=wpl_preOrder(root->lchild,deep+1);`

`if(root->lchild!=NULL) lwpl=wpl_preOrder(root->lchild,deep+1);`

`return lwpl+rwpl;`

`}`

` `

### 二叉树转中缀表达式加括号：

`void BTreetoExpression``（``BiTree *root){`

`Exp_inOrder(BiTree *root,1);`

`}`

`void Exp_inOrder(BiTree *root,int depth){`

`if (root==null) return;`

`else if(root->lchild==NULL&&root->rchild==NULL) printf("%s",root->data);`

`else{`

`if(depth>1) printf("(");`

`Exp_inOrder(root->lchild,depth+1);`

`printf("%s",root->data);`

`Exp_inOrder(root->rchild,depth+1);`

`if(depth>1) printf(")");`

`}`

`}`

### 顺序存储二叉树中序遍历：

`bool isBST(SqBiTree bt,int k,int &minval){`

`if(bt.SqBiTnode[k]!=-1&&k<bt.ElemNum){`

`if((isBST(bt,2*k+1,minval)==false) return false;`

`if(bt.SqBiTnode[k]<=minval) return false;`

`minval=bt.SqBiTnode[k];`

`if((isBST(bt,2*k+2,minval)==false) return false;`

`}`

`return true;`

`}`

### 分离链表

`LinkList Discretion(LinkList &A)`

`{`

`LinkList headB=(LinkList)malloc(sizeof(Lnode));`

`headB->next=null;`

`Lnode *p=A->next;`

`Lnode *q,*tailA;`

`while(p!=NULL){`

`tailA->next=p;`

`tailA=p;`

`p=p->next;`

`if(p!=NULL){`

`q=p->next;`

`p->next=headB->next;`

`headB->next=p;`

`p=q;`

`}`

`}`

`tailA->next=NULL;`

`return tailB;`

`}`

` `

### 循环移动/快慢指针：

`ListNode * rotateRight(ListNode *head,int k){``  ``//``不带头结点`

`if(head==null || k==0) return head;`

`int length=0;`

`ListNode *slow=head, *fast=head;`

`ListNode *pre=null;``  ``//``用来最后让``slow``前面的结点作为链尾指空。`

`while(slow!=null){``  ``//``统计链表长度`

`length++;`

`slow=slow->next;`

`}`

`if(k>=length) k=k % length;`

`if(k==0) return head;`

`slow=head;`

`k--;`

`while(k>0){``  ``//``快指针先走``k-1``步。`

`fast=fast->next;`

`k--;`

`}`

`while(fast!=null && fast->next!=null){`

`fast=fast->next;``   ``//``fast``一共走了``length-k+k-1=length-1``步，即走到了最后一个结点。`

`pre=slow;`

`slow=slow->next;``  ``//slow``只需走``length-k``步，即倒数第``k``个结点。`

`}`

`fast->next=head;``  ``//``最后将首部链接到尾部之后。`

`if(pre->next!=null) pre->next=null;`

`return slow;`

`}`

` `

### 链表整数求和：

`ListNode *sum(ListNode* L1,ListNode *L2){`

`int s1[100],s2[100];`

`int top1=-1;top2=-1;`

`while(L1){`

`s1[++top1]=L1.val;`

`L1=L1->next;`

`}`

`while(L2){`

`s2[++top2]=L2.val;`

`L2=L2->next;`

`}`

`ListNode *res=NULL;`

`int carry=0;`

`while(top1>-1 || top2>-1 || carry!=0){`

`int a=top1>-1?s1[top--]:0;`

`int b=top2>-1?s2[top--]:0;`

`int sum=a+b+carry;`

`carry=sum/10;`

`sum=sum%10;`

`ListNode* node=(ListNode *)malloc(sizeof(ListNode));`

`node->val=sum;`

`node->next=res;``  ``//``头插法`

`res=node;`

`}`

`return res;`

`}`

` `

### 交替重排链表：

`void Remake(Node *h){`

`Node *p,*q,*r,*s;`

`p=q=h;`

`while(q->next!=NULL){`

`p=p->next;`

`q=q->next;`

`if(q->next!=NULL) q=q->next;`

`}`

`q = p->next;`

`p->next=NULL;`

`while(q!=NULL){`

`r=q->next;`

`q->next=p->next;`

`p->next=q;`

`q=r;`

`}`

`s=h->next;`

`q=p->next;`

`while(q!=NULL){`

`r=q->next;`

`q->next=s->next;`

`s->next=q;`

`s=q->next;`

`q=r;`

`}`

`}`

` `

### 给定关键字排序：

`void QuickPass(int A[],int n,int k)`

`{`

`int left=0,right=n-1;`

`int x=A[k];`

`while(left<right){`

`while(left<right&&x<A[right]) right--;`

`A[left]=A[right];`

`while(left<right&&x>A[left]) left++;`

`A[right]=A[left];`

`}`

`A[left]=x;`

`}`

` `

### 两个有序数组的中位数：

`int getCenter(int a[],int b[],int n){`

`int low1=low2=0;high1=high2=n-1;`

`while(low1!=high1 && low2!=high2){`

`mid1=(low1+high1)/2``；`

`mid2=(low2+high2)/2;`

`     ``if(a[mid1]=b[mid2]) return a[mid1];`

`     ``else if(a[mid1]<b[mid2]){`

`low1=mid1;`

`high2=mid2;`

`}`

`Else{`

`high1=mid1;`

`low2=mid2;`

`}`

`}`

`return a[mid1]<b[mid2]?a[mid1]:b[mid2];`

`}``     `

### 三元组最短距离：

`bool isMin(int a,int b,int c){`

`if(a<=b&&a<=c) return true;`

`return false;`

`}`

`int findMinDistofTriple(int A[],int n,int B[],int m,int C[],int p){`

`int i=j=k=0;`

`int min=INT_MAX;`

`int tmpDist;`

`while(i<n&&j<m&&k<p&&min>0){`

`tmpDist=abs(A[i]-B[j])+abs(B[j]-C[k])+abs(C[k]-A[i]);`

`if(tmpDist<min) min= tmpDist;`

`if(isMin(A[i],B[j],C[k])) i++;`

`else if(isMinB[j],A[i],C[k])) j++;`

`else k++;`

`}`

`return min;`

`}`

### 判断有向图是否存在顶点到其他顶点都有路径：

`bool visited[MAX_VERTEX_NUM];`

`bool OneToAll(ALGragh G){`

`for(int i=0;i<G.vexnum;i++){`

`for(int ``j``=0;j<G.vexnum;j++){`

`visited[j]=0;`

`}`

`int n=0;`

`DFS(G,i,visited,n);`

`if(n==G.vexnum)`

`return true;`

`}`

`return false;`

`}`

` `

`void DFS(ALGragh G``，``int i,int visited[],int &n){`

`visited[i]=1;`

`n++;`

`ArcNode *p;`

`for(p=G.adjlist[i].firstarc;p!=NULL;p=p->nextarc){`

`j=p->adjvex;`

`if(visited[j]==0){`

`DFS(G,j,visited,n);`

`}`

`}`

`}`

` `

### 二部图/染色问题：

`int color[MAX_VERTEX_NUM];`

`bool CanBePartition(ALGragh G){`

`for(int i=0;i<G.vexnum;++i){ //0``表示未染色`

`color[i]=0;`

`}`

`for(int i=0;i<G.vexnum;i++){`

`if(color[i]==0){`

`if(DFS(G,i,1)==0)`

`return false;`

`}`

`}`

`return true;`

`}`

` `

`bool DFS(ALGragh G``，``int i,int targetColor){`

`color[i]=targetColor;`

`for(ArcNode *p=G.adjlist[i].firstarc;p!=NULL;p=p->nextarc){`

`int j=p->adjvex;`

`if(color[j]==0){`

`if(DFS(G,j,-targetColor)==0)//+-1``交替染色`

`return false;`

`}`

`else if(color[j]=targetColor){`

`return false;`

`}`

`}`

`return true;`

`}`

已使用 OneNote 创建。
