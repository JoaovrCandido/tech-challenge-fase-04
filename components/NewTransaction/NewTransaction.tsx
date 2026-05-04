"use client";

import { TransactionType } from "@/types";
import { NewTransactionProps } from "@/types";

import style from "./NewTransaction.module.css";

export default function NewTransaction({
  title,
  type,
  value,
  description,
  receipt, // NOVO
  onTypeChange,
  onValueChange,
  onDescriptionChange,
  onReceiptChange, // NOVO
  onSubmit,
  disabled = false,
}: NewTransactionProps) {
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/[^0-9.,]/g, "");
    onValueChange(apenasNumeros);
  };

  // Função que pega o arquivo selecionado e transforma em Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Envia a string Base64 gerada para o componente pai
        onReceiptChange(reader.result as string);
      };
      // Inicia a leitura do arquivo
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

      {/* NOVO: Input de Arquivo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', marginBottom: '10px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-color)' }}>
          Comprovante (Imagem ou PDF)
        </p>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          disabled={disabled}
          style={{ fontSize: '14px' }}
        />
        {receipt && (
          <span style={{ fontSize: '12px', color: 'green' }}>✓ Arquivo anexado pronto para envio</span>
        )}
      </div>

      <button className={style.button} onClick={onSubmit} disabled={disabled}>
        Concluir transação
      </button>
    </div>
  );
}