"use client";

import TransactionsContainer from "@/components/TransactionsContainer/TransactionsContainer";
import Menu from "@/components/Menu/Menu";

import { useIsMobile } from "@/hooks/useIsMobile";

import style from './transacoes.module.css';

export default function Transacoes() {
  const isMobile = useIsMobile();

  return (
    <section className={style.containerStatement}>
      {!isMobile && <Menu />}

      <div className={style.boxStatement}>

      <TransactionsContainer />
      </div>
      
    </section>
  );
}
