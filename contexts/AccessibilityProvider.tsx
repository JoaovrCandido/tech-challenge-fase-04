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

  const toggleDarkMode = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleChangeFontSize = () => {
    setFontLevel((prevLevel) => ((prevLevel + 1) % 3) as 0 | 1 | 2);
  };

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--color-bg", "#222222");
      root.style.setProperty("--color-text", "#f4f6f2");
      root.style.setProperty("--color-primary", "#0c6779");
      root.style.setProperty("--color-primary-light", "#004D61");
      root.style.setProperty("--color-secondary", "#333333");
      root.style.setProperty("--color-bg-components", "#0A0A0A")
      root.style.setProperty("--color-green", "#47a138")
    } else {
      root.style.setProperty("--color-bg", "#e8f0e8");
      root.style.setProperty("--color-text", "#222222");
      root.style.setProperty("--color-primary", "#004D61");
      root.style.setProperty("--color-primary-light", "#0c6779");
      root.style.setProperty("--color-secondary", "#f4f6f2");
      root.style.setProperty("--color-bg-components", "#f5f5f5")
      root.style.setProperty("--color-green", "#2e7d22")
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    switch (fontLevel) {
      case 0:
        root.style.setProperty("--font-size-sm", "0.875rem");
        root.style.setProperty("--font-size-md", "1rem");
        root.style.setProperty("--font-size-lg", "1.25rem");
        root.style.setProperty("--font-size-xl", "1.5rem");
        break;
      case 1:
        root.style.setProperty("--font-size-sm", "1rem");
        root.style.setProperty("--font-size-md", "1.25rem");
        root.style.setProperty("--font-size-lg", "1.5rem");
        root.style.setProperty("--font-size-xl", "1.75rem");
        break;
      case 2:
        root.style.setProperty("--font-size-sm", "0.75rem");
        root.style.setProperty("--font-size-md", "0.9rem");
        root.style.setProperty("--font-size-lg", "1.1rem");
        root.style.setProperty("--font-size-xl", "1.3rem");
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
