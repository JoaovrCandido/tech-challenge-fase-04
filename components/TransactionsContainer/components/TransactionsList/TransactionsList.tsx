"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { TransactionsListProps } from "@/types";

import { formatDate, formatCurrency, adjustTypesNames, getMonthName } from "@/utils/formatters";

import editImage from "@/public/edit.png";
import deleteImage from "@/public/delete-icon.png";

import style from "./TransactionsList.module.css";

interface ExtendedProps extends TransactionsListProps {
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const TransactionsList = ({
  transactions,
  title,
  onEditClick,
  onDeleteClick,
  onLoadMore,
  hasMore,
}: ExtendedProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, onLoadMore]);

  if (transactions.length === 0) {
    return <p>Nenhuma transação encontrada para estes filtros.</p>;
  }

  return (
    <div className={style.transactionsList}>
      <h1 className={style.transactionsListTitle}>{title}</h1>
      
      {transactions.map((transaction) => {
        return (
          <div key={transaction.id} className={style.transactionItem}>
            <div className={style.transactionHeader}>
              <h2 className={style.transactionMonth}>
                {getMonthName(transaction.date)}
              </h2>

              <div className={style.transactionActions}>
                <button
                  className={style.transactionEdit}
                  onClick={() => onEditClick(transaction)}
                  aria-label={`Editar transação ${transaction.description || ""}`}
                >
                  <Image
                    className={style.image}
                    src={editImage}
                    width={16}
                    height={16}
                    alt="Imagem para editar transação"
                  />
                </button>

                <button
                  className={style.transactionDelete}
                  onClick={() => onDeleteClick(transaction)}
                  aria-label={`Excluir transação ${transaction.description || ""}`}
                >
                  <Image
                    className={style.image}
                    src={deleteImage}
                    width={16}
                    height={16}
                    alt="Imagem para deletar transação"
                  />
                </button>
              </div>
            </div>
            
            <div className={style.transactionInfo}>
              <p className={style.transactionType}>
                {adjustTypesNames(transaction.type)}
              </p>
              <p className={style.transactionDate}>
                {formatDate(transaction.date)}
              </p>
            </div>
            
            <div className={style.transactionValueAndDesc}>
              <div>
                <p className={style.transactionDesc}>
                  {transaction.description || ""}
                </p>
                {transaction.receipt && (
                  <a 
                    href={transaction.receipt} 
                    download={`comprovante_transacao_${transaction.id}`}
                    className={style.downloadLink}
                  >
                    Baixar Comprovante
                  </a>
                )}
              </div>
              <p className={style.transactionValue}>
                {formatCurrency(transaction.value)}
              </p>
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div ref={observerRef} className={style.loadingIndicator}>
          Carregando mais transações...
        </div>
      )}
    </div>
  );
};

export default TransactionsList;