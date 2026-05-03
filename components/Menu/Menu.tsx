"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useIsMobile } from "@/hooks/useIsMobile";
import { MenuItem } from "@/types";
import { getTransactions } from "@/lib/api"; // Importamos a função de fetch direto da API

import style from "./Menu.module.css";

const menuItems: MenuItem[] = [
  { label: "Início", path: "/" },
  { label: "Transações", path: "/transacoes" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  
  // Instanciamos o QueryClient para manipular o cache diretamente
  const queryClient = useQueryClient();

  const closeMenu = () => setOpen(false);

  // Função avançada de Intent-based Prefetching
  const handlePrefetch = (path: string) => {
    // Se a rota precisar de dados de transações, nós já buscamos e jogamos no cache
    if (path === "/" || path === "/transacoes") {
      queryClient.prefetchQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions,
        staleTime: 1000 * 60 * 5, // Evita prefetch duplicado se já estiver no cache
      });
    }
  };

  const renderLinks = () => (
    <div className={`${style.mobileMenuWrapper} ${open ? style.open : ""}`}>
      {isMobile && (
        <button className={style.btnClose} onClick={closeMenu}>
          ✖
        </button>
      )}

      <ul className={style.menuLinks}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li
              key={item.path}
              className={`${style.menuItem} ${isActive ? style.activeItem : ""}`}
              onClick={closeMenu}
              onMouseEnter={() => handlePrefetch(item.path)} // Pré-carrega no Desktop ao passar o mouse
              onTouchStart={() => handlePrefetch(item.path)} // Pré-carrega no Mobile ao iniciar o toque
            >
              <Link href={item.path}>{item.label}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className={style.Menu}>
      {isMobile && open && (
        <div className={style.overlay} onClick={closeMenu}></div>
      )}

      {isMobile ? (
        <>
          {renderLinks()}

          <button
            className={style.btnToggle}
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            ☰
          </button>
        </>
      ) : (
        renderLinks()
      )}
    </div>
  );
}