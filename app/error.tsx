"use client";

import { useEffect } from "react";

import style from './home.module.css'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div
      className={style.errorPage}
    >
      <h1>Algo deu errado 😢</h1>
      <p>Desculpe, ocorreu um erro. Tente novamente mais tarde...</p>

      <button
        onClick={() => reset()}
      >
        Recarregar
      </button>
    </div>
  );
}
