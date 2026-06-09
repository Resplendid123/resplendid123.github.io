# 笔记规范

适用于 `notes/` 下的课程笔记。目标是让导入后的 Markdown 可读、可搜索、可归档，并保持 URL 稳定。

## 文件位置

- 课程首页：`notes/<subject>/index.html`
- 章节笔记：`notes/<subject>/<chapter-slug>.md`
- 图片资源：`assets/notes/<subject>/`

`subject` 使用短码，例如 `os`、`cn`、`co`、`ds`。

## Front Matter

章节页使用 `layout: note`，并开启搜索与归档：

```yaml
---
layout: note
nav: notes
title: "第一章 计算机系统概述"
course: "OS"
course_title: "操作系统"
course_url: "/notes/os/"
chapter: "01"
permalink: "/notes/os/01-os-overview/"
tags: ["notes", "os", "operating-systems"]
description: "操作系统：第一章 计算机系统概述"
date: "2024-06-30 15:48:00 +0800"
archive: true
search: true
---
```

相邻章节可增加：

```yaml
previous_note_title: "上一章标题"
previous_note_url: "/notes/os/00-example/"
next_note_title: "下一章标题"
next_note_url: "/notes/os/02-example/"
```

## 正文结构

- 页面标题由 `title` 渲染，正文不要再写一级标题。
- 正文章节从 `##` 开始，常用层级为 `##`、`###`、`####`。
- 不使用 `#####`、`######` 表示普通正文。
- 只有真正的小节才用标题；解释性句子写成普通段落。
- “优点：”“缺点：”“例：”这类标签写成加粗段落：`**优点：**`。
- 段落之间保留一个空行。
- 列表使用 `-`，列表项里不要塞整段大标题。
- 长定义先写术语标题，再接正文段落。

示例：

```markdown
## 操作系统的运行环境

### 处理器运行模式

#### 特权指令

不允许用户直接使用的指令，如 I/O 指令、关中断指令。

**例：**

- 读写系统寄存器
- 修改页表
```

## 图片

图片统一放在 `assets/notes/<subject>/`，正文用 Liquid 相对路径：

```markdown
![]({{ '/assets/notes/os/image001.png' | relative_url }})
```

图片前后各保留一个空行。不要引用 `onenote-md/`、`tempFile/` 或本地绝对路径。

## 目录

右侧目录由 `toc` front matter 控制，只收录长文章的关键 `##/###` 小节：

```yaml
toc:
  - id: section-1
    label: "基本概念"
```

正文标题后添加锚点：

```markdown
## 基本概念
{: #section-1 }
```

## 导入检查

导入新笔记后至少检查：

- `layout`、`permalink`、`tags`、`date`、`search` 是否完整。
- 没有空标题：`rg -n "^#{1,6}\\s*$" notes`
- 没有过深标题：`rg -n "^#{5,6}\\s+" notes`
- 图片路径都指向 `assets/notes/`。
- `bundle exec jekyll build` 可以通过。
