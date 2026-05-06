"use client";

import { TransactionType } from "@/types";
import { NewTransactionProps } from "@/types";

import style from "./NewTransaction.module.css";

export default function NewTransaction({
  title,
  type,
  value,
  description,
  receipt,
  onTypeChange,
  onValueChange,
  onDescriptionChange,
  onReceiptChange,
  onSubmit,
  disabled = false,
}: NewTransactionProps) {
  
  // MÁSCARA MONETÁRIA BRASILEIRA
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não for número (impede letras e símbolos)
    let rawValue = e.target.value.replace(/\D/g, "");

    if (!rawValue) {
      onValueChange("");
      return;
    }

    // Converte para centavos matematicamente
    const numericValue = parseInt(rawValue, 10) / 100;

    // Formata com R$ e separadores de milhar
    const formattedValue = numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    onValueChange(formattedValue);
  };

  // VALIDAÇÕES AVANÇADAS DO ARQUIVO
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Validação de Tamanho (Máximo 5MB)
      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        alert("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
        e.target.value = ""; // Limpa o input
        return;
      }

      // 2. Validação de Tipo
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        alert("Formato inválido. Envie apenas imagens (JPG/PNG) ou PDF.");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onReceiptChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        placeholder="R$ 0,00"
        value={value}
        onChange={handleValorChange}
        disabled={disabled}
      />

      <input
        type="text"
        placeholder="Descrição (opcional)"
        value={description}
        maxLength={100} // Limite de caracteres
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={disabled}
      />

      <div className={style.fileInputContainer}>
        <p className={style.fileInputLabel}>
          Comprovante (Imagem ou PDF)
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={handleFileChange}
          disabled={disabled}
          className={style.fileInput}
        />
        {receipt && (
          <span className={style.fileInputFeedback}>✓ Arquivo anexado e validado</span>
        )}
      </div>

      <button className={style.button} onClick={onSubmit} disabled={disabled}>
        Concluir transação
      </button>
    </div>
  );
}