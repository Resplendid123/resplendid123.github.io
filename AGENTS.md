# Agent 开发说明

这是一个 Jekyll / GitHub Pages 个人站点，包含博客文章和课程笔记。改动时优先保持结构稳定、URL 稳定、样式简洁。

## 目录约定

- `_posts/`：有日期的博客文章。
- `notes/`：课程笔记，按 `os`、`cn`、`co`、`ds` 等一级目录组织。
- `assets/notes/`：课程笔记图片，按课程短码分目录。
- `docs/`：内容写作与导入规范。
- `_layouts/note.html`：课程笔记页面布局。
- `_layouts/post.html`：博客文章布局。
- `_site/`：Jekyll 构建结果，不手动编辑。

`tempFile/` 和 `onenote-md/` 只作为临时导入目录使用，不提交。导入完成后保留 `notes/` 与 `assets/notes/` 即可。

## 内容规范

- 笔记遵守 `docs/note-standard.md`。
- Post 遵守 `docs/post-standard.md`。
- 笔记正文从 `##` 开始，不再写一级标题。
- 不用 `#####`、`######` 表示正文；“优点：”“例：”这类标签写成加粗段落。
- 图片统一放到 `assets/notes/<subject>/`，正文使用 `relative_url`。
- 已发布的 `permalink`、章节 slug、图片路径不要随意改。

## 搜索、标签和归档

- `_includes/search-data.html` 输出文章与 `search: true` 页面。
- note 章节使用 `layout: note`、`search: true`、`archive: true`、`date` 后，会进入搜索、Tags、Archives。
- 课程首页可以 `search: true`，但不设置 `archive: true`。
- Tags 由 front matter 的 `tags` 声明，点击后应显示相关 posts 和 notes。

## 本地命令

本机使用 Homebrew Ruby 3.4：

```bash
PATH=/opt/homebrew/opt/ruby@3.4/bin:$PATH BUNDLE_PATH=/tmp/github-pages-bundle-ruby34 bundle install
PATH=/opt/homebrew/opt/ruby@3.4/bin:$PATH BUNDLE_PATH=/tmp/github-pages-bundle-ruby34 bundle exec jekyll build --destination /tmp/github-pages-site
PATH=/opt/homebrew/opt/ruby@3.4/bin:$PATH BUNDLE_PATH=/tmp/github-pages-bundle-ruby34 bundle exec jekyll serve --host 127.0.0.1 --port 4100
```

检查项：

```bash
rg -n "^#{5,6}\s+" notes
rg -n "^#{1,6}\s*$" notes
```
