// Simple theme toggle: toggles 'dark' class on document.documentElement
(function () {
  const key = "srms-theme";
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.classList.add("dark");
      if (toggle) toggle.textContent = "☀️";
    } else {
      root.classList.remove("dark");
      if (toggle) toggle.textContent = "🌙";
    }
  }

  // load saved
  const saved = localStorage.getItem(key);
  if (saved) applyTheme(saved);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      const theme = isDark ? "dark" : "light";
      localStorage.setItem(key, theme);
      applyTheme(theme);
    });
  }
})();
