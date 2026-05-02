"use client";

import { useAccessibility } from "@/contexts/AccessibilityProvider";

import Header from "./components/Header/Header";

export function HeaderContainer() {
  const { toggleDarkMode, toggleChangeFontSize } = useAccessibility();

  return (
    <Header
      title="Banco FIAP"
      onToggleDarkMode={toggleDarkMode}
      onToggleFontSize={toggleChangeFontSize}
    />
  );
}
