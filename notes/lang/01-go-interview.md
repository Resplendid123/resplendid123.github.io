---
layout: "note"
nav: "notes"
title: "Go 八股"
course: "LANG"
course_title: "编程语言"
course_url: "/notes/lang/"
chapter: "01"
permalink: "/notes/lang/01-go-interview/"
tags: ["notes", "lang", "go", "golang", "interview"]
description: "编程语言：Go 八股"
date: "2026-06-09 10:00:00 +0800"
archive: true
search: true
---

## Golang 怎么访问私有成员

1.包内函数直接访问

2.包外通过公开函数访问

3.通过反射访问

## Golang init()和包级别变量

init()显示调用在main()之前执行，包级别变量只能用var声明，不能使用短声明赋值:=。因为包变量在程序启动时就已经初始化，而函数内部变量是动态的，可以使用。

## Golang 数据类型

基本类型都是深拷贝，引用类型都是浅拷贝。copy函数是浅拷贝

struct{}结构体类型，struct{}{}空结构体实例可作为信号量，也可结合map作为只有key的集合

string不可变（编译时保证内存只读），赋值给[]byte需要拷贝，可以使用指针避免。使用strings.Builder可变字节切片，使用writeString方法就可拼接

## Golang New和Make

new(type):为一种类型分配内存，但不赋值，只返回指向类型0值的指针

make:专为slice,map,channel返回的是初始完的值

## Golang 方法集

类型T，只包括接受者类型为T的方法，但是Go编辑器隐式获取值的地址，来调用*T方法

类型*T，包括接受者类型为T和T*的方法

接受者类型为T的方法内部对接受者T的修改不会影响原始值

接受者类型为*T的方法内部对接受者*T的修改会影响原始值

值类型方法只能实现接口的值类型方法

指针类型方法可以实现接口的两种方法

## Golang 类型断言

```jsx
接口类型存储的是动态类型和动态值，编译器无法访问其字段，当不确定该类型时，可以使用断言来检查
var x interface{} = 10 //interface持有一个int类型的值
y := x.(int) //断言后y是x中int的拷贝
y = 20 //修改拷贝不会修改原来interface中的值
若接口中存储的是数据的引用，那么会跟随变化
和反射类比，类型断言是静态的，反射是动态的
golang类型转换需要显示
```

## Golang range

对切片使用range时，range的value是副本，得使用idx更改来对底层数组修改

for 循环中，range固定了切片的长度，append操作不会影响循环次数

## Golang 接口

Golang中接口是隐式实现的，不需要像Java那样显示声明implements了哪个接口，只需要该类型中组合了接口中的所有方法就算实现了接口，可以作为接口的实现进行传递参数。

Golang接口包含非空接口和空接口

Golang VS Java

Golang中不支持重载，方法名不允许重复。

Golang鸭子模型：强调对象的行为，而非具体类型或继承关系。如果它像鸭子一样行走和鸣叫，那么它就是鸭子。

Golang类型安全由编译器+运行时断言保证

Golang由于类型可以组合嵌入类型，代码侵入性低，比如第三方包的接口缺少某个方法字段，但是能通过组合来自己实现。Java中由于显示继承不能访问父类私有字段，若要方法必须使用，得改第三方源码、反射获取

## Golang 闭包

闭包=函数+捕获外部变量（若是匿名函数传参，但是内部使用的仅仅是参数，没有引用外部变量，就不算闭包）；让函数记住定义时的环境，携带运行。

若没有闭包，就只能依赖全局变量或结构体，代码复杂

闭包作用：函数延迟执行，比如http中间件；函数式编程；实现私有变量

## Golang Panic

- 数组切片越界
- 空指针解引用

```jsx
var p *int //声明不分配内存
fmt.Println(*p)
```

- 手动panic
- 非法类型断言
- 数学错误
- 内存越界
- 运行时堆栈溢出
- 向已关闭channel写

## defer 匿名函数recover 与panic

defer在协程的_defer链表中，不在栈帧当中，LIFO，头插法

recover能捕获的是调用链上的panic，已经触发的不会捕获

defer的执行时机是在包含该defer语句的函数最后执行的也包括return之后。

下面例子中case1正常捕获f1中的panic，main函数继续执行case2，case2的f2中只能捕获f2里的panic，所以case2的panic会被main捕获

普通函数和匿名函数的流程是一样的

```jsx
package main

func main() {
	defer func() {
		if r := recover(); r != nil {
			println("recovered from panic:", r)
		}
	}() //()是调用该函数func(),可以传参
	case1()
	case2()
}

func case1() {
	defer func() {
		if r := recover(); r != nil {
			println("recovered from panic in case1:", r)
		}
	}()
	f1()
}

func f1() {
	panic("f1")
}

func case2() {
	panic("case2")
	f2()
}

func f2() {
	defer func() {
		if r := recover(); r != nil {
			println("recovered from panic:", r)
		}
	}()
}
```

## defer 变量快照什么情况会失效？

- 匿名函数闭包，变量在defer之后发生了变化（这里匿名函数中参数是值传递，若不传递参数，则会变化）
- 引用类型，若defer持有引用类型（指针，Map，切片，通道，函数）内容也会变化
- defer若是函数传参数，或者链式函数，参数都会固定预先计算直至最后一个函数

## Golang 内存逃逸

<aside>
🚀

**逃逸：** 原本应该分配到栈上的内存被分配到了堆上。栈内存由编译器自动管理，而堆内存需要 GC 回收，这会增加 GC 压力，影响程序性能。

</aside>

### 逃逸的原因

- **栈空间不足或作用域变化：** 变量过大，或变量的引用超出了函数的生命周期。
- **动态类型或大小：** 编译阶段无法确定变量的具体类型或大小。

### Golang 内存分配的基础原则

这是导致内存逃逸的根本原因：

1. **指向栈上对象的指针不能被存储到堆中：** 如果存储到堆中，当栈对象销毁后，会变成悬空指针（因此编译器会将该对象也分配到堆上）。
2. **指向栈上对象的指针不能超过栈对象的生命周期：** 函数返回后栈帧销毁，指针会指向无效内存。

### 典型案例

#### 1. 返回局部变量的指针

函数返回了局部变量的引用，导致该变量必须在堆上分配以延长其生命周期。

```go
func escape1() *int {
	x := 42
	return &x  // x 逃逸到堆
}
```

#### 2. 闭包捕获

函数返回后闭包仍在被引用，导致被闭包捕获的局部变量不能销毁。

```go
func escape2() func() {
	x := 42
	return func() {
		fmt.Println(x)  // x 被闭包捕获，逃逸到堆
	}
}
```

#### 3. 接口动态类型

将具体类型赋值给接口，编译器在编译阶段无法确定其具体类型。

```go
type Animal interface{
	run()
}
type dog struct{}
func (d *dog) run() {}

func escape3() {
	var f Animal
	f = &dog{}
	f.run()
}
```

#### 4. 切片动态大小

使用变量来初始化切片，编译器无法在编译期确定切片的具体大小。

```go
func escape4() {
	n := 100
	s := make([]int, n)  // 动态大小，逃逸到堆
	_ = s
}
```

#### 5. 发送指针到 channel

指针发送到 channel 后，可能会被其他 goroutine 引用，生命周期超出当前作用域。

```go
func escape5() {
	ch := make(chan *int)
	x := 42
	ch <- &x  // x 逃逸
}
```

#### 6. 跨Go routine传递

```jsx
func goroutine() {
    x := 10
    go func() {
        fmt.Println(x) // x 逃逸到堆上
    }()
}
```

---

### 分析方法

在编译时使用 `-gcflags="-m"` 参数可以查看编译器的逃逸分析过程：

```bash
go build -gcflags="-m"
```

## Golang map为什么不设计为线程安全，如何实现

### 为什么map不可寻址？

map底层实现是hash，设计语义上hash key的顺序是无序的，key由于扩容等原因，地址会发生变化，因此不可寻址。遍历时也是随机的，让开发者不要错误依赖，即使底层key数组是连续的。

#### 为什么不设计为线程安全？

线程安全带来的开销并非所有场景下都需要，没必要为了多线程环境增加单线程的性能开销

#### 使用map注意事项

float不建议作为map的key，精度问题可能认为key是一样的

map delete时只会标记为空，不删除物理内存。

解决方法：将value改为指针引用，指针指向的内存会被GC。值对象就会一直存在map中

#### 实现并发安全map

- 使用sync.Mutex

```jsx
type SafeMap struct {
    mu sync.RWMutex
    m  map[string]int
}
```

- 使用sync.Map

```jsx
func main() {
    var sm sync.Map
    
    sm.Store("key1", 100)
    sm.Load("key1")
    sm.Delete("key1")
    sm.Range(func(key, value interface{}) bool {
        fmt.Printf("%v: %v\n", key, value)
        return true
    })
}
```

- 使用分片Map

```jsx
type Shard struct {
    mu sync.RWMutex
    m  map[string]int
}

type ShardedMap struct {
    shards []*Shard
}
```

- sync.Map读写流程
    
    ```jsx
    type Map struct {
    	mu Mutex  // 用于保护 dirty map 和其他需要同步的操作。
    	read atomic.Pointer[readOnly] // 存储当前 Map 的只读部分，主要用于高效的并发读取操作。
    	dirty map[any]*entry //用于存储正在修改的数据，包括未被 read map 捕获的新数据和需要更新的数据
    	misses int // 统计读取操作中无法命中 read map 的次数（即需要加锁访问 dirty map 的次数）,当 misses 达到一定阈值时，将 dirty map 合并到 read map 中，从而减少对锁的依赖
    }
    type readOnly struct {
    	m       map[any]*entry
    	amended bool // true if the dirty map contains some key not in m.表示是否有新键存储在 dirty map 中
    }
    ```
    
    - Load操作
        - 无锁查read，若有直接返回
        - 若无，通过readOnly的amended标志获知dirty是否有数据
        - 加锁查dirty，更新miss+1
        - 若miss>len(dirty)，read append dirty，dirty=nil
    - Store操作
        - 无锁查read，CAS更新，若失败说明该元素为nil或expunged
        - 加锁再次查read，若key在read中且是expunged，说明key被彻底清除但又即将重新写入，将其写入dirty，清除该标记
        - 若key在dirty中，则直接更新
        - 若key是全新的，检查amended，若amended为false，说明dirty中无新元素或和read一样；把read中元素都复制到dirty中，并且把nil标记为expunged，amended设置为true
    - Delete操作
        - 无锁查read，若在直接原子操作设置为nil（逻辑删除），不删除dirty中可能的副本
        - 若amend=false，在dirty中物理删除
    - 内存屏障
        - 一组CPU指令，可以阻止指令重排和解决可见性问题。指令重排通过规定屏障前的指令先执行，屏障后的指令后执行解决。
    - 可见性问题
        - 通过强制将 Store Buffer中的修改同步到L1缓存和强制处理失效队列中的数据，确保其他核心及时读到有效的新数据。

## Golang Map hash底层原理

- 拉链法+溢出桶。
    - 每个map内部有底层数组指针，每个桶可以存8个键值对还有溢出桶指针，连续内存存放。
    - delete时只是把桶标记为empty，溢出桶整理时会删除合并空桶。
- 扩容机制
    - 溢出桶太多会进行等量扩容。负载因子过大会进行翻倍扩容。
    - 扩容过程是渐进式的，每一次迁移1-2个桶。
    - 写入操作会检查map是否在扩容状态，即旧桶非空。
    - 若空，则直接写入；若非空，则将该key所属桶先迁移到新桶。
- 数据结构

```jsx
type hmap struct {
    count     int    // map 中元素的个数，len() 返回这个值
    flags     uint8  // 状态标志（如是否正在写入）
    B         uint8  // 桶数量的对数：buckets 数组的长度 = 2^B
    noverflow uint16 // 溢出桶的大致数量
    hash0     uint32 // 哈希种子，用于计算哈希值

    buckets    unsafe.Pointer // 桶数组的指针（*bmap）
    oldbuckets unsafe.Pointer // 扩容时用于保存旧桶数组
    nevacuate  uintptr        // 扩容时的进度指示器

    extra *mapextra // 可选字段，用于存储溢出桶
}

// 一个桶最多存储 8 个键值对
type bmap struct {
    // tophash 是一个长度为 8 的数组
    // 存储每个键的哈希值的高 8 位，用于快速判断key是否存在
    tophash [8]uint8
    // 实际存储中，键和值是分开存放的
    // keys    [8]keytype   // 8 个键
    // values  [8]valuetype // 8 个值
    // overflow *bmap       // 指向下一个溢出桶的指针
}
```

- 查找流程
    - hash函数获取key的哈希值，通过hash值低位找到桶的位置得到bmap
    - 在bmap中通过hash值前8位查找桶内key，然后取出完整的key比较
    - 若没找到则在overflow中找
- 防止hash攻击
    - 创建map时，生成随机种子，相同key映射到不同map中；多实例时有效防范
    - 溢出桶数量限制，等量扩容重新打乱key分布
    - 每个桶最多8个元素，攻击数据分布到不同桶和溢出桶

## Golang reflect

- 作用：动态查询操作对象的类型和值
- 应用
    - 序列化：访问tag字段，必须是公开字段
    - 动态调用方法
    - testing框架
- 性能：频繁创建对象

## Golang 性能分析与GC调优

trace pprof

go test -race

GOMAXPROCS 环境变量默认为逻辑CPU核心数，比如4核8线程为8，默认为容器的—cpus

runtime.maxprocs最大核心并发数，逻辑CPU数量，P的上限，Go运行时会决定哪些P来调度

runtime.memstats内存分配、GC信息

runtime.numCPU

## Golang context

- 作用：在多个go routine间传递上下文，截止时间，信号，特定请求值，更好管理生命周期和资源
- 数据结构
    - Deadline
    - done
    - Err
    - Value
- context.value 链式查找，从底层到根部，子context对象继承父context kv
    - context.BackGround
    - context.withValue
    - context.WithCancel
    - context.WithDeadline
    - context.WithTimeout

## Golang VS Java

- Map
    - go的读不存在对象返回零值，需要ok区分、写操作panic；java可以返回null
    - go采用桶数组+溢出桶；java采用数组+链表/红黑树
    - go map渐近式扩容；java map一次性迁移stw
    - 翻倍/等量(只整理溢出桶)扩容；等量
    - 需要rehash；通过位运算不需要rehash
    - 旧桶逐渐释放；旧数组GC回收
- GC
    - 并发标记清扫；分代收集G1/ZGC
    - 混合写屏障；分代写屏障
    - Green Tea GC（go 1.26）
        - 采用页扫描替代堆对象扫描（通过cpu指令prefetch机制，将对象扫入cache）
        - 通过位图管理标记
    - Generational ZGC（java 21）
        - 年轻代minor gc 完全并发整理减少内存碎片
        - 老年代major gc 大部分并发
    - golang内存分配是tcmalloc风格
        - ThreadCache线程本地分配私有缓存，分为不同size的空闲链表，每个size有多块连续的内存
        - CentralCache被所有线程共享，是当线程不够用时申请
        - PageHeap页堆 管理从OS申请到的内存
            - Page是内存管理的最小单位，8KB
            - Span是多个连续Page，给CentralCache分配的基本单位
            - 自动管理合并相邻内存空闲Span
        - 小对象分配由前两者完成，大对象由后者完成
        
- 设计哲学
    - 组合，接口，鸭子模型
    - 对象，继承
- 并发模型
    - GMP用户级协程，CSP模型，channel通信
    - 1:1线程，依赖线程池管理，共享内存
- 类型系统与泛型
    - 编译器类型参数实例化，代码生成大于反射
    - 编译后无泛型信息，反射，动态代理，依赖注入
- 错误机制
    - 没有异常，函数多返回，err显示处理，defer recover
    - checked/unchecked exception；try catch finally
- 生态
    - K8s，Docker，etcd，Prometheus，Istio
    - Spring，Dubbo
- 运行时
    - 启动速度
    - 内存占用
    - 并发上限
    - 部署产物

## Golang select

- 作用：同步监听所有case，选择第一个发生事件的case执行
- 应用：
    - 多通道操作
    - 超时机制←time.After(time.second*10)
    - 阻塞通道直至接受到数据
    - 非阻塞则添加default：，顺序执行
- 若只有一个case，接受的是一个未关闭的channel会阻塞死锁；接受的是一个已经关闭的channel会读0值

## Golang Slice和数组区别与联系

### 为什么要有切片？

数组一旦声明，长度固定，无append操作，不支持动态扩容。数组长度是数组类型的一部分，不同长度的数组不是一个类型。

大数组值传递效率低，但是切片用个指针就能传递，作为函数参数能接受任意长度的数组。

```jsx
切片是对数组的引用
typedef slice struct{
	array unsafe.Pointer
	len int
	cap int
}
len始终是切片元素个数，cap是从当前指针地址开始到原来数组大小的容量
```

### 切片扩容：

Golang只有值传递，对切片元素修改，会影响原数组，是因为值传递的数组指针是同一个

append操作相当于在数组索引位置插入，后续元素需要移动

如果append元素过多导致超过了当前切片的cap，会新建一个数组指针指向新数组，即更新了array pointer，有点像超出cap后的copy on write

当切片作为函数参数值传递时，将原本的切片元素（数组，大小，容量）复制一份。但是切片本身结构体的地址改变了。

当函数内部对切片append时不会影响外部的切片是因为外部的len没有变化，无法看到底层数组的变化。

而传递*[]int，相当于传递了同一个切片结构体，而append操作相当于在对这个结构体的len和cap改变。

因此要对外部切片做改动，有两种方法，一是传递切片指针，而是返回新切片后赋值覆盖原切片

## Golang channel

- 底层数据结构
    - buffer指针
    - elemsize,elemtype
    - len,cap
    - send,recv指针
    - wait queue(send queue,recv queue)
    - lock
    - closed
- 无缓冲队列的buffer指向nil
- 缓冲大小一般通过cpu核心数*每个worker能承受的负载，结合压测确定
- CSP（通信顺序进程）
- 发送数据流程
    - 检查channel是否为nil或关闭
        - 若nil，则阻塞(未初始化可能导致死锁)
        - 若close，panic
    - mutex加lock
    - 若有recvq，将数据直接发送（栈拷贝）并唤醒
    - 若无recvq
        - 缓冲区没满，则写入缓冲区
        - 缓冲区已满，则阻塞当前routine，加入sendq
- 接受数据流程
    - mutex加lock
    - 若有sendq
        - 若无缓冲，直接从发送者栈拷贝并唤醒发送者
        - 若有缓冲，则直接从缓冲区拷贝，将第一个发送者的数据拷贝到缓冲区并唤醒它
    - 若无sendq
        - 若无缓冲，阻塞
        - 若有缓冲且缓冲区非空，直接拷贝
        - 若有缓冲且缓冲区空，阻塞，加入wait queue recv
- 关闭channel过程
    - 加lock
    - closed设置为1
    - sendq和recvq全部移除并加入唤醒队列glist
    - go rountine被唤醒后，检查closed标志，变量填充0值，继续执行
    - 发送者负责关闭，接受者可以从已经关闭的channel读缓冲区数据
    - 使用defer确保函数结束时关闭channel，接受者使用for select来确保channel被关闭时能正确处理

## Golang 抢占式调度

- 背景；如果P中的G一直占用M，使得同一个P中的G无法得到调度，就会饿死。为了避免这种问题，引入了协作式抢占调度
- 原理：
    - 系统初始化时，M会注册一个信号处理器
    - 系统监控线程会定期遍历P，检查G运行时间，若发现可以抢占就会向M发送异步信号
    - M收到后，会把当前G的状态标记为可抢占
    - G执行函数时，发现该标志，主动让出，触发调度，P会将其挂起，调度其他G

## Golang GMP 模型

- go scheduler初始化
    - 创建M0线程，程序主线程启动其他routine
    - 初始化G0协程，用于调度，每个M都有一个G0
    - 创建P，默认和CPU核心数相同
    - GMP关联为一个单元
- P:
    - go routine 阻塞解除
    - go routine 创建
    - 垃圾回收
    - 系统调用返回
    - 主动让出go sched
    - go routine结束
- M：
    - 当M陷入系统调用阻塞，导致M被OS调度到等待队列
    - P会与这个M解绑，与另一个空闲M绑定
- work stealing
    - 先全局队列（锁竞争），然后netpoll队列，最后work stealing偷别人一半
    - 偷本地队列时从头部pop，本地队列的P取任务是在尾部，也就是FILO
    - 选取任务尾部的原因是，尾部是push新的协程，通常资源刚刚分配
    - 这样能保证头部不会饥饿，如果只有一个P，那么会变成FIFO来防止饥饿
    - 另外协作式抢占会让出G，调度其他g
    - 本地队列超过256个g时，老任务会进入全局队列
    - scheduler会定期检查全局队列
- sysmon
    - 监控计时器
    - 网络轮询和唤醒
    - GC触发
    - 抢占长时间的routine

## Golang GC

### 为什么不能是两色？

- A→C 改成B→C，当A，B都被扫描过变成黑色，C还未被扫描，导致漏标。
- 解决方法：
    - stw，不允许写。引入灰色，要么把B变灰重新扫描，要么把C变灰
    - 引入强三色不变式规则：黑色不能直接指向白色。
    - 引入弱三色不变式规则：所有黑色对象引用的白色对象必须有灰色上游对象

### 三色标记-清除法

- 三色
    - 黑色：代表子对象扫描完毕
    - 灰色：代表已经扫描，存活，但子对象还没扫
    - 不允许黑色对象指向白色对象
- 流程
    - Sweep termination: 完成上一轮清扫，STW，确保标记前清扫完毕
    - 标记准备阶段
        - 堆上对象保留上一轮 GC 的颜色（黑/灰）
        - 开启所有P上的写屏障，短暂STW，为了确保所有go routine的写都能正确标记
        - 栈上对象重新扫描
    - 并发标记阶段（最耗时90%）
        - 根扫描（全局变量，栈上的局部变量，寄存器）
        - 将从根直接引用的对象加入灰色队列
        - 从灰色队列中取出对象，扫描其所有子对象，标记为灰色，所有直接子对象标记完后自身变为黑色。
        - 重复不断从灰色队列中取出对象，扫描其引用的对象直至灰色队列为空。
    - 标记终止阶段
        - 短暂STW，关闭P写屏障，重新扫描栈，确保栈上指针新指向的堆对象不会被误回收。
    - 并发清扫阶段
        - 回收所有未被标记的白色对象，这个阶段gc routine可以被调度替换慢慢清除
- 误被清除的两个条件
    - 黑色指向白色（黑色突然指向一个白色对象，但黑色已经被扫描完了）
    - 灰色对象指向白色的路径被切断了（若路径没被切断，一定能扫描并标记为灰色）
- 写屏障
    - 对对象指针写操作时，即修改对象的引用关系时，触发的特殊程序逻辑
    - 这段逻辑是在编译期在指针操作时就写入的一段判断逻辑
        - 旧指针指向对象标记为灰色（删除写屏障）
        - 新指针指向对象标记为灰色（插入写屏障）
    - Dijsktra插入写屏障：当黑色指向白色时，将白色标记为灰色
    - Yuasa删除写屏障：当灰色指向白色的指针断开时，将白色标记为灰色
    - 混合写屏障：插入+删除写屏障
    - 插入解决黑色指向原本白色；删除解决灰色指向白色的指针被删除，但是白色堆对象被黑色栈对象引用的情况（因为如果是被堆对象引用，是一定能扫描到的，但是栈没有插入写屏障，所以需要删除写屏障来保证 ）
- gc routine
    - 同一时间段内全局只会有一个
    - 触发条件
        - 内存占用
        - 2分钟一次
        - 手动
- 和Java区别
    - 无分代
    - 不整理移动，tcmalloc碎片少
    - 与用户代码并发，减少stw

## Golang mutex

- 数据结构

```jsx
type Mutex struct {
   state int32  // 锁的状态
   sema  uint32 // 信号量
}

const (
    mutexLocked      = 1 << iota // 1. 锁定标志位 (二进制: 001)
    mutexWoken                   // 2. 唤醒标志位 (二进制: 010) - 提醒释放锁的协程，不用释放让其他协程抢，已经有人等了
    mutexStarving                // 3. 饥饿标志位 (二进制: 100)
    mutexWaiterShift = iota      // 4. 等待者数量的偏移量 (值为 3)
    starvationThresholdNs = 1e6  // 5. 饥饿阈值 (1 毫秒)
)
```

- 正常与饥饿模式
    - 正常：唤醒和新到来的routine一起竞争，FIFO
    - 若等待队列中协程超过1ms没有得到锁，触发饥饿模式，新来的直接排在队尾，锁交给队头
- 自旋条件
    - 不处于饥饿模式
    - 自选次数少于限制
    - CPU核心数大于1
    - 有空闲P
    - 当前P本地队列为空

## Golang sync

- sync.once通过两次检查done==0，第一次是快速判断，第二次加锁检查函数是否执行过了

```jsx
type Singleton struct{}

var (
    instance *Singleton
    once     sync.Once
)

func GetInstance() *Singleton {
    once.Do(func() {
        instance = &Singleton{}
        fmt.Println("Singleton instance created")
    })
    return instance
}

func main() {
    for i := 0; i < 10; i++ {
        go func() {
            _ = GetInstance()
        }()
    }
}

```

## Golang ErrGroup&waitGroup

- errGroup是waitGroup的升级，不需要手动处理错误传递和取消信号，能够自动传播错误，一旦有错误，带context其余任务自动取消，不带context就不会取消其他任务，wait方法会返回第一个任务的错误
- eg：
    
    ```jsx
    g, ctx := errgroup.WithContext(context.Background())
    
    if err := g.Wait(); err != nil {
    	fmt.Printf("执行出错: %v\n", err)
    } else {
    	fmt.Println("所有任务都成功执行")
    } 
    g, ctx := errgroup.WithContext(context.Background)
    ```
