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

## Content model

The blog uses Jekyll posts plus a small convention for the category tree:

- Primary category: the first value in `categories`.
- Secondary category: the first value in `tags` that is different from the
  primary category.
- Normal tags: any later values in `tags`.

Order matters. For example:

```yaml
categories: [book-notes]
tags: [book-notes, clean-code, architecture]
```

This post appears under:

```text
Categories / book-notes / clean-code / Post title
```

The `architecture` value is a normal tag. It appears on the Tags page and on the
post, but it is not used as the secondary category because it is not the first
non-primary tag.

## Add a primary category

1. Create a category detail page:

```text
categories/<category-slug>/index.html
```

2. Use this front matter:

```yaml
---
layout: category
nav: categories
title: <category-slug>
category: <category-slug>
---
```

3. Add posts with that primary category:

```yaml
categories: [<category-slug>]
tags: [<category-slug>]
```

This creates a direct article under the primary category, without a secondary
folder.

## Add a secondary category

1. Create a category detail page for the secondary category:

```text
categories/<secondary-slug>/index.html
```

2. Use this front matter:

```yaml
---
layout: category
nav: categories
title: <secondary-slug>
category: <secondary-slug>
---
```

3. Put the secondary category as the first tag that differs from the primary
   category:

```yaml
categories: [book-notes]
tags: [book-notes, clean-code]
```

This creates the path:

```text
Categories / book-notes / clean-code / Post title
```

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
tags: [internals, runtime, notes]
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

## Add or use tags

Tags are added in post front matter:

```yaml
tags: [internals, runtime, notes]
```

Rules:

- Include the primary category in `tags` first for consistency.
- Put the secondary category second when the post belongs in a subfolder.
- Put ordinary tags after that.
- Tags do not need their own files unless you also want to use that tag as a
  category detail page under `categories/<tag>/`.

Examples:

```yaml
# Direct post under Categories / handbooks
categories: [handbooks]
tags: [handbooks]

# Post under Categories / handbooks / typescript
categories: [handbooks]
tags: [handbooks, typescript]

# Post under Categories / internals / goroutines, with one extra normal tag
categories: [internals]
tags: [internals, goroutines, golang]
```

## Local preview

```bash
export PATH="/opt/homebrew/opt/ruby@3.4/bin:/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"
JEKYLL_NO_BUNDLER_REQUIRE=true jekyll serve --host 127.0.0.1 --port 4000 --livereload false
```

Open `http://localhost:4000/`.
