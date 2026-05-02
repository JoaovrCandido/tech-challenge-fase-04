"use client";

import { DeleteTransactioProps } from "@/types";

import style from "./DeleteTransaction.module.css";

export default function DeleteTransaction({
  title,
  onCancelSubmit,
  onDeleteSubmit,
  disabled = false,
}: DeleteTransactioProps) {
  return (
    <div className={style.DeleteTransaction}>
      <h3>{title}</h3>

      <div className={style.buttonContainer}>
        <button
          className={style.button}
          onClick={onCancelSubmit}
          disabled={disabled}
        >
          Cancelar
        </button>
        <button
          className={style.button}
          onClick={onDeleteSubmit}
          disabled={disabled}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
