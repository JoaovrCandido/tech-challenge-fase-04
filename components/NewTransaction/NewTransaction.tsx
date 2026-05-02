"use client";

import { TransactionType } from "@/types";
import { NewTransactionProps } from "@/types";

import style from "./NewTransaction.module.css";

export default function NewTransaction({
  title,
  type,
  value,
  description,
  onTypeChange,
  onValueChange,
  onDescriptionChange,
  onSubmit,
  disabled = false,
}: NewTransactionProps) {
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/[^0-9.,]/g, "");
    onValueChange(apenasNumeros);
  };

  return (
    <div className={style.newTransaction}>
      <h3>{title}</h3>

      <select
        aria-label="Tipo de transação"
        value={type}
        onChange={(e) => onTypeChange(e.target.value as TransactionType)}
        disabled={disabled}
      >
        <option value="" disabled>
          Selecione o tipo de transação
        </option>
        <option value="deposito">Depósito</option>
        <option value="transferencia">Transferência</option>
      </select>
      
      <p>Valor</p>
      <input
        type="text"
        placeholder="10,00"
        value={value}
        onChange={handleValorChange}
        disabled={disabled}
      />

      <input
        type="text"
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={disabled}
      />

      <button className={style.button} onClick={onSubmit} disabled={disabled}>
        Concluir transação
      </button>
    </div>
  );
}
