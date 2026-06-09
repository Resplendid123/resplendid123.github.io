# Resplendid Pages

一个 Jekyll / GitHub Pages 个人站点，用来发布博客文章和计算机课程笔记。

## 项目结构

- `_posts/`：博客文章，按 `YYYY-MM-DD-slug.md` 命名。
- `notes/`：课程笔记，一级目录为 `os`、`cn`、`co`、`ds` 等课程短码。
- `assets/notes/`：课程笔记图片资源。
- `categories/`、`tags/`、`archives/`：分类、标签、归档页面。
- `_includes/`、`_layouts/`：Jekyll 模板。
- `docs/`：写作与导入规范。

临时导入目录 `tempFile/`、`onenote-md/` 不保留在仓库里；导入完成后只提交 `notes/` 和 `assets/notes/`。

## 内容规范

- 课程笔记：见 `docs/note-standard.md`
- 博客文章：见 `docs/post-standard.md`

笔记章节需要 `layout: note`、`search: true`、`archive: true`、`date` 和稳定的 `permalink`。Post 放在 `_posts/`，由文件名和 front matter 日期决定发布时间。

## 本地启动

```bash
PATH=/opt/homebrew/opt/ruby@3.4/bin:$PATH BUNDLE_PATH=/tmp/github-pages-bundle-ruby34 bundle install
PATH=/opt/homebrew/opt/ruby@3.4/bin:$PATH BUNDLE_PATH=/tmp/github-pages-bundle-ruby34 bundle exec jekyll serve --host 127.0.0.1 --port 4100
```

打开 `http://127.0.0.1:4100/`。如果端口被占用，换一个端口即可。

## 构建检查

```bash
PATH=/opt/homebrew/opt/ruby@3.4/bin:$PATH BUNDLE_PATH=/tmp/github-pages-bundle-ruby34 bundle exec jekyll build --destination /tmp/github-pages-site
rg -n "^#{5,6}\s+" notes
rg -n "^#{1,6}\s*$" notes
```
