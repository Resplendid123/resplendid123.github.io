class ModeToggle {
  static get modeKey() {
    return "mode";
  }

  static get modeAttr() {
    return "data-mode";
  }

  static get darkMode() {
    return "dark";
  }

  static get lightMode() {
    return "light";
  }

  constructor() {
    this.root = document.documentElement;
    this.systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    this.restore();
    this.systemDark.addEventListener("change", () => {
      if (!sessionStorage.getItem(ModeToggle.modeKey)) {
        this.root.removeAttribute(ModeToggle.modeAttr);
      }
    });
  }

  restore() {
    const mode = sessionStorage.getItem(ModeToggle.modeKey);
    if (mode === ModeToggle.darkMode || mode === ModeToggle.lightMode) {
      this.root.setAttribute(ModeToggle.modeAttr, mode);
    }
  }

  currentMode() {
    return this.root.getAttribute(ModeToggle.modeAttr) ||
      (this.systemDark.matches ? ModeToggle.darkMode : ModeToggle.lightMode);
  }

  flipMode() {
    const nextMode = this.currentMode() === ModeToggle.darkMode
      ? ModeToggle.lightMode
      : ModeToggle.darkMode;
    this.root.setAttribute(ModeToggle.modeAttr, nextMode);
    sessionStorage.setItem(ModeToggle.modeKey, nextMode);
  }
}

const modeToggle = new ModeToggle();
const body = document.body;
const sidebarTrigger = document.querySelector("#sidebar-trigger");
const mask = document.querySelector("#mask");
const searchTrigger = document.querySelector("#search-trigger");
const searchCancel = document.querySelector("#search-cancel");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const searchData = document.querySelector("#search-data");
const backToTop = document.querySelector("#back-to-top");
const tagsPage = document.querySelector("[data-tags-page]");
const tagResultsTitle = document.querySelector("#tag-results-title");
const tagResultsList = document.querySelector("#tag-results-list");
const trendingTagGroups = Array.from(document.querySelectorAll("[data-trending-tags]"));
const recentItemGroups = Array.from(document.querySelectorAll("[data-recent-items]"));
const archivesPage = document.querySelector("[data-archives]");

document.querySelectorAll(".mode-toggle").forEach((button) => {
  button.addEventListener("click", () => modeToggle.flipMode());
});

sidebarTrigger?.addEventListener("click", () => {
  body.classList.add("sidebar-display");
});

mask?.addEventListener("click", () => {
  body.classList.remove("sidebar-display");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    body.classList.remove("sidebar-display");
    closeSearch();
  }
});

function openSearch() {
  body.classList.add("search-display");
  searchInput?.focus();
}

function closeSearch() {
  body.classList.remove("search-display");
  if (searchInput) searchInput.value = "";
  renderSearchResults("");
}

searchTrigger?.addEventListener("click", openSearch);
searchCancel?.addEventListener("click", closeSearch);

searchInput?.addEventListener("focus", () => {
  if (window.matchMedia("(min-width: 850px)").matches) {
    openSearch();
  }
});

searchInput?.addEventListener("input", (event) => {
  body.classList.add("search-display");
  renderSearchResults(event.target.value);
});

searchResults?.addEventListener("click", (event) => {
  const tagButton = event.target.closest("[data-search-tag]");
  if (!tagButton) return;

  event.preventDefault();
  renderSearchTagResults(tagButton.dataset.searchTag);
});

function getPosts() {
  if (!searchData) return [];

  try {
    return JSON.parse(searchData.textContent);
  } catch {
    return [];
  }
}

function renderPostTags(tags) {
  return splitTags(tags)
    .map((tag) => `
      <button class="search-tag-button" type="button" data-search-tag="${escapeHTML(tag)}">
        ${escapeHTML(tag)}
      </button>
    `)
    .join("");
}

function renderSearchPostList(posts, contextLabel = "") {
  if (!searchResults) return;

  searchResults.innerHTML = "";

  if (contextLabel) {
    const title = document.createElement("h2");
    title.className = "search-result-heading";
    title.textContent = contextLabel;
    searchResults.appendChild(title);
  }

  if (posts.length === 0) {
    searchResults.innerHTML += '<p class="mt-5"></p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  posts.forEach((post) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <header>
        <h2><a href="${post.url}">${escapeHTML(post.title)}</a></h2>
        <div class="post-meta">
          <span><i class="far fa-folder fa-fw" aria-hidden="true"></i>${escapeHTML(post.categories)}</span>
          <span class="search-result-tags"><i class="fa fa-tag fa-fw" aria-hidden="true"></i>${renderPostTags(post.tags)}</span>
        </div>
      </header>
      <p>${escapeHTML(post.snippet)}</p>
    `;
    fragment.appendChild(article);
  });

  searchResults.appendChild(fragment);
}

function renderSearchResults(query) {
  if (!searchResults) return;

  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    searchResults.innerHTML = "";
    return;
  }

  const posts = getPosts()
    .filter((post) => {
      const haystack = [
        post.title,
        post.categories,
        post.tags,
        post.snippet
      ].join(" ").toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .slice(0, 12);

  renderSearchPostList(posts);
}

function postTimestamp(post) {
  const timestamp = Date.parse(post.date || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortByNewest(left, right) {
  return postTimestamp(right) - postTimestamp(left) ||
    String(left.title).localeCompare(String(right.title), "en", { sensitivity: "base" });
}

function datedPosts() {
  return getPosts()
    .filter((post) => post.date)
    .sort(sortByNewest);
}

function taggablePosts() {
  return getPosts()
    .filter((post) => post.kind === "post" || post.kind === "note");
}

function postsMatchingTag(tag) {
  const slug = slugifyTag(tag);

  return taggablePosts()
    .filter((post) => splitTags(post.tags).some((postTag) => slugifyTag(postTag) === slug))
    .sort(sortByNewest);
}

function renderSearchTagResults(tag) {
  if (!tag) return;

  body.classList.add("search-display");
  if (searchInput) searchInput.value = `#${tag}`;

  const posts = postsMatchingTag(tag);
  renderSearchPostList(posts, `${tag} (${posts.length})`);
}

function dateParts(value) {
  const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = Number(match[2]) - 1;

  return {
    year: match[1],
    month: monthNames[monthIndex] || match[2],
    day: match[3]
  };
}

function splitTags(value) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function slugifyTag(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildTagIndex(posts) {
  const tagIndex = new Map();

  posts.forEach((post) => {
    splitTags(post.tags).forEach((tag) => {
      if (!tagIndex.has(tag)) tagIndex.set(tag, []);
      tagIndex.get(tag).push(post);
    });
  });

  tagIndex.forEach((tagPosts) => tagPosts.sort(sortByNewest));

  return [...tagIndex.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "en", { sensitivity: "base" }));
}

function topTags(tagIndex) {
  return [...tagIndex]
    .sort(([leftTag, leftPosts], [rightTag, rightPosts]) => {
      return rightPosts.length - leftPosts.length ||
        leftTag.localeCompare(rightTag, "en", { sensitivity: "base" });
    })
    .slice(0, 10);
}

function renderTagResults(tag, posts) {
  if (!tagResultsTitle || !tagResultsList) return;

  tagResultsTitle.textContent = `${tag} (${posts.length})`;
  tagResultsList.innerHTML = "";

  const fragment = document.createDocumentFragment();

  posts.forEach((post) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <header>
        <h3><a href="${post.url}">${escapeHTML(post.title)}</a></h3>
        <div class="post-meta">
          <span><i class="far fa-folder fa-fw" aria-hidden="true"></i>${escapeHTML(post.categories)}</span>
          <span><i class="fa fa-tag fa-fw" aria-hidden="true"></i>${escapeHTML(post.tags)}</span>
        </div>
      </header>
      <p>${escapeHTML(post.snippet)}</p>
    `;
    fragment.appendChild(article);
  });

  tagResultsList.appendChild(fragment);
}

function selectTag(tag, posts) {
  const slug = slugifyTag(tag);

  tagsPage?.querySelectorAll(".tag").forEach((link) => {
    link.classList.toggle("active", link.dataset.tagSlug === slug);
  });

  renderTagResults(tag, posts);
}

function findTagByHash(tagIndex) {
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  return tagIndex.find(([tag]) => slugifyTag(tag) === hash);
}

function initTagsPage() {
  if (!tagsPage || !tagResultsTitle || !tagResultsList) return;

  const tagIndex = buildTagIndex(taggablePosts());
  if (tagIndex.length === 0) return;

  tagsPage.innerHTML = "";

  tagIndex.forEach(([tag, posts]) => {
    const wrapper = document.createElement("div");
    const link = document.createElement("a");
    const count = document.createElement("span");

    link.className = "tag";
    link.id = slugifyTag(tag);
    link.href = `#${slugifyTag(tag)}`;
    link.dataset.tagSlug = slugifyTag(tag);
    link.append(document.createTextNode(tag));

    count.className = "text-muted";
    count.textContent = posts.length;
    link.append(count);

    link.addEventListener("click", () => selectTag(tag, posts));

    wrapper.appendChild(link);
    tagsPage.appendChild(wrapper);
  });

  const selected = findTagByHash(tagIndex) || tagIndex[0];
  selectTag(selected[0], selected[1]);

  window.addEventListener("hashchange", () => {
    const nextSelected = findTagByHash(tagIndex);
    if (nextSelected) selectTag(nextSelected[0], nextSelected[1]);
  });
}

function initTrendingTags() {
  if (trendingTagGroups.length === 0) return;

  const tagIndex = buildTagIndex(taggablePosts());
  const tags = topTags(tagIndex);
  if (tags.length === 0) return;

  trendingTagGroups.forEach((group) => {
    group.innerHTML = "";

    tags.forEach(([tag, posts]) => {
      const link = document.createElement("a");
      link.className = "post-tag btn btn-outline-primary";
      link.href = `/tags/#${slugifyTag(tag)}`;
      link.textContent = tag;
      link.title = `${posts.length} item${posts.length === 1 ? "" : "s"}`;

      if (group.closest("#search-hints")) {
        link.href = `#${slugifyTag(tag)}`;
        link.dataset.searchTag = tag;
        link.addEventListener("click", (event) => {
          event.preventDefault();
          renderSearchTagResults(tag);
        });
      }

      group.appendChild(link);
    });
  });
}

function initRecentItems() {
  if (recentItemGroups.length === 0) return;

  const recentPosts = datedPosts().slice(0, 5);
  if (recentPosts.length === 0) return;

  recentItemGroups.forEach((group) => {
    group.innerHTML = "";

    recentPosts.forEach((post) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = post.url;
      link.textContent = post.title;
      item.appendChild(link);
      group.appendChild(item);
    });
  });
}

function initArchives() {
  if (!archivesPage) return;

  const posts = datedPosts();
  if (posts.length === 0) return;

  archivesPage.innerHTML = "";

  let currentYear = "";
  let currentList = null;

  posts.forEach((post) => {
    const parts = dateParts(post.date);
    if (!parts) return;

    if (parts.year !== currentYear) {
      currentYear = parts.year;
      const year = document.createElement("time");
      year.className = "year";
      year.textContent = currentYear;
      archivesPage.appendChild(year);

      currentList = document.createElement("ul");
      currentList.className = "archive-year-list";
      archivesPage.appendChild(currentList);
    }

    const item = document.createElement("li");
    item.innerHTML = `
      <span class="date day">${escapeHTML(parts.day)}</span>
      <span class="date month text-muted">${escapeHTML(parts.month)}</span>
      <a href="${post.url}">${escapeHTML(post.title)}</a>
    `;
    currentList?.appendChild(item);
  });
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const codeLanguageLabels = new Map([
  ["bash", "Shell"],
  ["console", "Console"],
  ["go", "Go"],
  ["golang", "Go"],
  ["html", "HTML"],
  ["js", "JavaScript"],
  ["javascript", "JavaScript"],
  ["jsx", "JSX"],
  ["json", "JSON"],
  ["md", "Markdown"],
  ["markdown", "Markdown"],
  ["plaintext", "Plaintext"],
  ["py", "Python"],
  ["python", "Python"],
  ["ruby", "Ruby"],
  ["shell", "Shell"],
  ["sh", "Shell"],
  ["sql", "SQL"],
  ["terminal", "Terminal"],
  ["ts", "TypeScript"],
  ["tsx", "TSX"],
  ["txt", "Plaintext"],
  ["yaml", "YAML"],
  ["yml", "YAML"]
]);

const codeBlocksWithoutLineNumbers = new Set(["plaintext", "console", "terminal", "txt", "text"]);

function getCodeLanguage(block) {
  const languageClass = Array.from(block.classList)
    .find((className) => className.startsWith("language-"));

  return languageClass ? languageClass.replace(/^language-/, "").toLowerCase() : "";
}

function getCodeLabel(block, language) {
  const fileLabel = block.getAttribute("file") ||
    block.getAttribute("data-file") ||
    block.getAttribute("data-label");

  if (fileLabel) return fileLabel;
  if (codeLanguageLabels.has(language)) return codeLanguageLabels.get(language);
  if (!language) return "Code";

  return language.toUpperCase();
}

function shouldShowLineNumbers(block, language) {
  return !block.classList.contains("nolineno") &&
    !block.classList.contains("no-lineno") &&
    !codeBlocksWithoutLineNumbers.has(language);
}

function codeLineCount(code) {
  const text = code.textContent.replace(/\n$/, "");
  return text.length === 0 ? 1 : text.split("\n").length;
}

function buildCodeHeader(block, label, code) {
  const header = document.createElement("div");
  header.className = "code-header";

  const labelElement = document.createElement("span");
  labelElement.dataset.labelText = label;

  const labelIcon = document.createElement("i");
  labelIcon.className = block.getAttribute("file") || block.getAttribute("data-file")
    ? "far fa-file-code fa-fw"
    : "fas fa-code fa-fw small";

  labelElement.append(labelIcon, document.createTextNode(label));

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "code-copy";
  copyButton.setAttribute("aria-label", "Copy code");
  copyButton.title = "Copy";

  const copyIcon = document.createElement("i");
  copyIcon.className = "far fa-clipboard";
  copyButton.appendChild(copyIcon);

  copyButton.addEventListener("click", async () => {
    const copied = await copyText(code.textContent);

    if (!copied) return;

    copyButton.classList.add("copied");
    copyButton.setAttribute("aria-label", "Copied");
    copyButton.title = "Copied!";
    copyIcon.className = "fas fa-check";

    window.setTimeout(() => {
      copyButton.classList.remove("copied");
      copyButton.setAttribute("aria-label", "Copy code");
      copyButton.title = "Copy";
      copyIcon.className = "far fa-clipboard";
    }, 1600);
  });

  header.append(labelElement, copyButton);
  return header;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the textarea fallback below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

function buildCodeBody(pre, code, showLineNumbers) {
  const body = document.createElement("div");
  body.className = "code-body";

  if (showLineNumbers) {
    const gutter = document.createElement("div");
    gutter.className = "code-gutter";

    for (let line = 1; line <= codeLineCount(code); line += 1) {
      const lineNumber = document.createElement("span");
      lineNumber.textContent = line;
      gutter.appendChild(lineNumber);
    }

    body.appendChild(gutter);
  }

  const scroll = document.createElement("div");
  scroll.className = "code-scroll";
  scroll.appendChild(pre);
  body.appendChild(scroll);

  return body;
}

function initCodeBlocks() {
  document.querySelectorAll(".content div.highlighter-rouge").forEach((block) => {
    if (block.dataset.codeEnhanced === "true") return;

    const highlight = block.querySelector(":scope > .highlight");
    const pre = highlight?.querySelector(":scope > pre");
    const code = pre?.querySelector(":scope > code");

    if (!highlight || !pre || !code) return;

    const language = getCodeLanguage(block);
    const label = getCodeLabel(block, language);
    const showLineNumbers = shouldShowLineNumbers(block, language);

    block.insertBefore(buildCodeHeader(block, label, code), highlight);
    highlight.replaceChildren(buildCodeBody(pre, code, showLineNumbers));
    block.dataset.codeEnhanced = "true";
  });
}

window.addEventListener("scroll", () => {
  if (!backToTop) return;

  if (window.scrollY > 350) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function initTocTracking() {
  const tocLinks = Array.from(document.querySelectorAll("#toc-wrapper .toc-link"));
  const tocTargets = tocLinks
    .map((link) => {
      const id = decodeURIComponent((link.getAttribute("href") || "").replace(/^#/, ""));
      const target = id ? document.getElementById(id) : null;
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (tocTargets.length === 0) return;

  let tocTicking = false;

  function setActiveTocLink(activeLink) {
    tocLinks.forEach((link) => link.classList.toggle("active", link === activeLink));

    const tocWrapper = document.querySelector("#toc-wrapper");
    if (!tocWrapper) return;

    const linkTop = activeLink.offsetTop;
    const linkBottom = linkTop + activeLink.offsetHeight;
    const visibleTop = tocWrapper.scrollTop;
    const visibleBottom = visibleTop + tocWrapper.clientHeight;

    if (linkTop < visibleTop) {
      tocWrapper.scrollTop = linkTop;
    } else if (linkBottom > visibleBottom) {
      tocWrapper.scrollTop = linkBottom - tocWrapper.clientHeight;
    }
  }

  function updateActiveTocLink() {
    let active = tocTargets[0];

    tocTargets.forEach((item) => {
      if (item.target.getBoundingClientRect().top <= 96) {
        active = item;
      }
    });

    setActiveTocLink(active.link);
  }

  function requestTocUpdate() {
    if (tocTicking) return;

    tocTicking = true;
    window.requestAnimationFrame(() => {
      updateActiveTocLink();
      tocTicking = false;
    });
  }

  updateActiveTocLink();
  window.addEventListener("scroll", requestTocUpdate, { passive: true });
  window.addEventListener("resize", requestTocUpdate);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initTrendingTags();
    initRecentItems();
    initArchives();
    initTagsPage();
    initTocTracking();
    initCodeBlocks();
  });
} else {
  initTrendingTags();
  initRecentItems();
  initArchives();
  initTagsPage();
  initTocTracking();
  initCodeBlocks();
}
