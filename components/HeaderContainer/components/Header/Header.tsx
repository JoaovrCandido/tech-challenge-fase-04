"use client";

import Image from "next/image";

import { HeaderProps } from "@/types";

import alterarfonte from "@/public/alterarfonte.png";
import modoclaroescuro from "@/public/modoclaroescuro.png";

import { useIsMobile } from "@/hooks/useIsMobile";

import Menu from "@/components/Menu/Menu";

import style from "./Header.module.css";

export default function Header({
  title,
  onToggleFontSize,
  onToggleDarkMode,
}: HeaderProps) {
  const isMobile = useIsMobile();
  return (
    <header className={style.header}>
      {isMobile && <Menu/>}
      <h1 className={style.headerTitle}>{title}</h1>
      <div className={style.accessibility}>
        <button
          className={style.buttonIcon}
          onClick={onToggleFontSize}
          aria-label="Alterar tamanho da fonte"
        >
          <Image
            className={style.fontSizeImg}
            src={alterarfonte}
            width={35}
            height={35}
            alt="Imagem alterar tamanho da fonte"
          />
        </button>

        <button
          className={style.buttonIcon}
          onClick={onToggleDarkMode}
          aria-label="Alternar modo claro ou escuro"
        >
          <Image
            className={style.lightAndDarkImg}
            src={modoclaroescuro}
            width={40}
            height={40}
            alt="Imagem alterar tamanho da fonte"
          />
        </button>
      </div>
    </header>
  );
}
