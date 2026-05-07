"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { AccessibilityContextType } from "@/types";

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontLevel, setFontLevel] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem("@finance:theme") as "light" | "dark" | null;
    const savedFont = localStorage.getItem("@finance:fontLevel");

    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedFont !== null) {
      setFontLevel(Number(savedFont) as 0 | 1 | 2);
    }
  }, []);

  const toggleDarkMode = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("@finance:theme", newTheme);
      return newTheme;
    });
  };

  const toggleChangeFontSize = () => {
    setFontLevel((prevLevel) => {
      const newLevel = ((prevLevel + 1) % 3) as 0 | 1 | 2;
      localStorage.setItem("@finance:fontLevel", newLevel.toString());
      return newLevel;
    });
  };

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--color-bg", "#0f172a");
      root.style.setProperty("--color-bg-box", "#1e293b");
      root.style.setProperty("--color-text", "#f8fafc");
      root.style.setProperty("--color-primary", "#1e293b");
      root.style.setProperty("--color-primary-light", "#334155");
      root.style.setProperty("--color-secondary", "#1e293b");
      root.style.setProperty("--color-border", "#334155");
      root.style.setProperty("--color-accent", "#3b82f6");
      root.style.setProperty("--color-success", "#22c55e");
      root.style.setProperty("--color-danger", "#ef4444");
    } else {
      root.style.setProperty("--color-bg", "#f8fafc");
      root.style.setProperty("--color-bg-box", "#ffffff");
      root.style.setProperty("--color-text", "#1e293b");
      root.style.setProperty("--color-primary", "#0f172a");
      root.style.setProperty("--color-primary-light", "#334155");
      root.style.setProperty("--color-secondary", "#ffffff");
      root.style.setProperty("--color-border", "#e2e8f0");
      root.style.setProperty("--color-accent", "#2563eb");
      root.style.setProperty("--color-success", "#16a34a");
      root.style.setProperty("--color-danger", "#dc2626");
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    switch (fontLevel) {
      case 0:
        root.style.setProperty("--font-size-sm", "0.875rem");
        root.style.setProperty("--font-size-md", "1rem");
        root.style.setProperty("--font-size-lg", "1.125rem");
        root.style.setProperty("--font-size-xl", "1.5rem");
        break;
      case 1:
        root.style.setProperty("--font-size-sm", "1rem");
        root.style.setProperty("--font-size-md", "1.125rem");
        root.style.setProperty("--font-size-lg", "1.25rem");
        root.style.setProperty("--font-size-xl", "1.75rem");
        break;
      case 2:
        root.style.setProperty("--font-size-sm", "0.75rem");
        root.style.setProperty("--font-size-md", "0.875rem");
        root.style.setProperty("--font-size-lg", "1rem");
        root.style.setProperty("--font-size-xl", "1.25rem");
        break;
    }
  }, [fontLevel]);

  const value = {
    theme,
    fontLevel,
    toggleDarkMode,
    toggleChangeFontSize,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibility deve ser usado dentro de um AccessibilityProvider"
    );
  }
  return context;
}