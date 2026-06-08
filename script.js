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

function getPosts() {
  if (!searchData) return [];

  try {
    return JSON.parse(searchData.textContent);
  } catch {
    return [];
  }
}

function renderSearchResults(query) {
  if (!searchResults) return;

  const normalizedQuery = query.trim().toLowerCase();
  searchResults.innerHTML = "";

  if (!normalizedQuery) return;

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

  if (posts.length === 0) {
    searchResults.innerHTML = '<p class="mt-5"></p>';
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
          <span><i class="fa fa-tag fa-fw" aria-hidden="true"></i>${escapeHTML(post.tags)}</span>
        </div>
      </header>
      <p>${escapeHTML(post.snippet)}</p>
    `;
    fragment.appendChild(article);
  });

  searchResults.appendChild(fragment);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
