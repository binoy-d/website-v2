/** Dark/light theme: follows the OS preference until the visitor toggles it. */
const THEMES = {
  dark: { "--main-bg-color": "#080705", "--main-text-color": "#e9e9e9", "--secondary-bg-color": "#111111" },
  light: { "--main-bg-color": "#EFF1F3", "--main-text-color": "#080705", "--secondary-bg-color": "#ebebeb" },
};

let dark =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const isDark = () => dark;

export function applyTheme() {
  const root = document.documentElement;
  const name = dark ? "dark" : "light";
  root.setAttribute("data-theme", name);
  Object.entries(THEMES[name]).forEach(([property, value]) => root.style.setProperty(property, value));
}

export function toggleTheme() {
  dark = !dark;
  applyTheme();
}
