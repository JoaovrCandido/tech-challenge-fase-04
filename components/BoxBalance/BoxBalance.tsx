"use client";

import React, { useState, useEffect } from "react";
import { BoxBalanceProps } from "@/types";

import olhofechado from "../../public/olhofechado.png";
import olhoaberto from "../../public/olhoaberto.png";

import Image from "next/image";

import style from "./BoxBalance.module.css";


export default function BoxBalance({
  dateString,
  balance,
  defaultIsActive = true,
}: BoxBalanceProps) {
  const [isActive, setIsActive] = useState<boolean>(defaultIsActive);

  useEffect(() => {
    setIsActive(defaultIsActive);
  }, [defaultIsActive]);

  return (
    <div className={style.balanceBox}>
      <h2 className={style.welcome}>Seja bem-vindo(a)!</h2>
      <p className={style.date} id="dataAtual">
        {dateString}
      </p>
      <div className={style.balance}>
        <div className={style.balanceAndEye}>
          <h3 className={style.account}>Saldo</h3>

          <Image
            className={style.eyeImg}
            src={isActive ? olhoaberto : olhofechado}
            width={35}
            height={35}
            alt="Esconder ou mostrar saldo"
            onClick={() => setIsActive(!isActive)}
          />
        </div>

        <p className={style.currentAccount}>Conta Corrente</p>

        {isActive ? <h4>{balance}</h4> : <h4>R$ ••••••</h4>}
      </div>
    </div>
  );
}
