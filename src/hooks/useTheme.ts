import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (globalThis.window !== undefined) {
      const storedTheme = getStoredItem("theme");
      return storedTheme === "dark" ||
        (!storedTheme && globalThis.window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      setStoredItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      setStoredItem("theme", "light");
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((d) => !d) };
}

function getStoredItem(key: string) {
  try {
    return globalThis.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredItem(key: string, value: string) {
  try {
    globalThis.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures so UI can still render.
  }
}
