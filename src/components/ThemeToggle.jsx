import { useEffect, useState } from "react";

const STORAGE_KEY = "itdgc-theme";

const readStored = () => {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
};

const Sun = () => (
  <svg
    viewBox="0 0 20 20"
    className="size-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="3.4" />
    <path d="M10 2.4v1.7M10 15.9v1.7M2.4 10h1.7M15.9 10h1.7M4.6 4.6l1.2 1.2M14.2 14.2l1.2 1.2M15.4 4.6l-1.2 1.2M5.8 14.2l-1.2 1.2" />
  </svg>
);

const Moon = () => (
  <svg
    viewBox="0 0 20 20"
    className="size-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16.2 12.3A6.8 6.8 0 0 1 7.7 3.8a6.8 6.8 0 1 0 8.5 8.5z" />
  </svg>
);

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => readStored() ?? "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, theme);
    } catch {
    }
  }, [theme]);

  const dark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={`Dark mode ${dark ? "on" : "off"}`}
      title={dark ? "Switch to light" : "Switch to dark"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="border-line bg-surface-2 hover:border-accent relative flex items-center rounded-full border p-1"
    >
      <span
        className={`bg-accent absolute top-1 bottom-1 w-7 rounded-full transition-all duration-200 ${
          dark ? "left-[calc(100%-2rem)]" : "left-1"
        }`}
        aria-hidden="true"
      />
      <span className={`relative z-10 grid size-7 place-items-center ${dark ? "text-muted" : "text-accent-on"}`}>
        <Sun />
      </span>
      <span className={`relative z-10 grid size-7 place-items-center ${dark ? "text-accent-on" : "text-muted"}`}>
        <Moon />
      </span>
    </button>
  );
}
