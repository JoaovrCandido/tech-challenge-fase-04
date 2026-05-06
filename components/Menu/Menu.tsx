"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // <-- Adicionado o useRouter
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "firebase/auth"; // <-- Função de saída do Firebase
import { auth } from "@/lib/firebase"; // <-- Instância da sua autenticação

import { useIsMobile } from "@/hooks/useIsMobile";
import { MenuItem } from "@/types";
import { getTransactions } from "@/lib/api"; 

import style from "./Menu.module.css";

const menuItems: MenuItem[] = [
  { label: "Início", path: "/" },
  { label: "Transações", path: "/transacoes" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter(); // <-- Invocando o router para redirecionar após o logout
  
  // Instanciamos o QueryClient para manipular o cache diretamente
  const queryClient = useQueryClient();

  const closeMenu = () => setOpen(false);

  // Função de Logout Segura
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desloga do Firebase
      queryClient.clear(); // Segurança: Limpa os dados do usuário antigo da memória!
      router.push("/login"); // Manda para a tela de login
      closeMenu(); // Fecha o menu no mobile
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // Função avançada de Intent-based Prefetching
  const handlePrefetch = (path: string) => {
    if (path === "/" || path === "/transacoes") {
      queryClient.prefetchQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions,
        staleTime: 1000 * 60 * 5, 
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
              onMouseEnter={() => handlePrefetch(item.path)} 
              onTouchStart={() => handlePrefetch(item.path)} 
            >
              <Link href={item.path}>{item.label}</Link>
            </li>
          );
        })}
        
        {/* NOVO: Botão de Sair com cor de alerta */}
        <li 
          className={style.menuItem} 
          onClick={handleLogout}
        >
          <span style={{ color: "#ef4444", fontWeight: "bold" }}>Sair</span>
        </li>
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