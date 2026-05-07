"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/infrastructure/auth/FirebaseAuthService";

import { useIsMobile } from "@/hooks/useIsMobile";
import { MenuItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

import { transactionsRepository } from "@/infrastructure/database/FirebaseTransactionsRepository";

import style from "./Menu.module.css";

const menuItems: MenuItem[] = [
  { label: "Início", path: "/" },
  { label: "Transações", path: "/transacoes" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const closeMenu = () => setOpen(false);

 const handleLogout = async () => {
    try {
      await authService.logout();
      queryClient.clear(); 
      router.push("/login");
      closeMenu();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const handlePrefetch = (path: string) => {
    if (user?.uid && (path === "/" || path === "/transacoes")) {
      queryClient.prefetchQuery({
        queryKey: ["transactions", user.uid],
        queryFn: () => transactionsRepository.getTransactions(user.uid),
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

        <li 
          className={style.menuItem} 
          onClick={handleLogout} 
          style={{ cursor: "pointer", marginTop: "10px" }}
        >
          <span style={{ color: "var(--color-danger)", fontWeight: "bold" }}>Sair</span>
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