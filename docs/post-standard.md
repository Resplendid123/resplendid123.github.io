# Post 规范

适用于 `_posts/` 下的博客文章。Post 是有发布日期的文章，会进入首页、RSS、Archives、Categories 和 Tags。

## 文件位置

文件名使用 Jekyll 约定：

```text
_posts/YYYY-MM-DD-post-slug.md
```

`post-slug` 使用小写英文和短横线，发布后尽量不改，避免 URL 变化。

## Front Matter

```yaml
---
title: "Runtime Notes"
date: 2026-01-01
categories: [internals]
tags: [internals, runtime, notes]
description: "短摘要，用于首页、搜索和 RSS。"
toc:
  - id: section-id
    label: "Section title"
---
```

规则：

- `categories` 的第一个值是一级分类。
- `tags` 第一个值与一级分类保持一致。
- 如果有二级分类，放在 `tags` 的第二个位置。
- 普通标签放在后面。
- `description` 写一句完整摘要，不要太长。

示例：

```yaml
categories: [handbooks]
tags: [handbooks, typescript, compiler]
```

表示文章属于 `handbooks` 分类，`typescript` 和 `compiler` 是标签。

## 正文结构

- 页面标题由 `title` 渲染，正文从 `##` 开始。
- 常用层级为 `##`、`###`、`####`。
- 每个标题前后保留一个空行。
- 普通段落之间保留一个空行。
- 代码块使用 fenced code block，并写明语言。
- 链接和图片使用相对路径或公开 URL。
- 长文章才写 `toc`，并确保正文里有对应锚点。

示例：

````markdown
## Section title
{: #section-id }

这里写正文。

```ruby
puts "hello"
```
````

## 分类页

新增分类时，需要创建：

```text
categories/<category-slug>/index.html
```

内容：

```yaml
---
layout: category
nav: categories
title: <category-slug>
category: <category-slug>
---
```

## 发布检查

- 文件名日期与 `date` 一致。
- `description`、`categories`、`tags` 已填写。
- 需要右侧目录时，`toc` 和标题锚点一致。
- `bundle exec jekyll build` 可以通过。
