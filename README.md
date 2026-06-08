# Resplendid GitHub Pages blog

This site is a small Jekyll blog that follows the structure and visual rhythm of
the Chirpy-style reference site.

## Change site info

Edit `_config.yml`:

- `title`
- `tagline`
- `description`
- `author`
- `nav`

## Add a new post

Create a Markdown file in `_posts/` with this filename pattern:

```text
YYYY-MM-DD-post-slug.md
```

Use front matter like this:

```yaml
---
title: Runtime Notes
date: 2026-01-01
categories: [internals]
tags: [runtime, notes]
description: Short summary shown on the home page and RSS feed.
toc:
  - id: section-id
    label: Section title
---
```

Add matching headings in the post:

```markdown
## Section title
{: #section-id }
```

Home, Categories, Tags, Archives, the right panel, and the RSS feed update from
the files in `_posts/`.
