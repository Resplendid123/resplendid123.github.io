const root = document.documentElement;
const sidebar = document.querySelector("#sidebar");
const menuToggle = document.querySelector("#menu-toggle");
const themeButtons = document.querySelectorAll("#theme-toggle, #mobile-theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  root.classList.add("dark");
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
  });
});

menuToggle?.addEventListener("click", () => {
  sidebar?.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (!sidebar || !menuToggle) return;
  if (sidebar.contains(event.target) || menuToggle.contains(event.target)) return;
  sidebar.classList.remove("open");
});
