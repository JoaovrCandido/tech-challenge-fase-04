import Image from "next/image";

import { TransactionsListProps } from "@/types";

import { formatDate, formatCurrency } from "@/utils/formatters";
import { getMonthName } from "@/utils/getMonthName";
import { AdjustTypesNames } from "@/utils/adjustTypesName";

import editImage from "@/public/edit.png";
import deleteImage from "@/public/delete-icon.png";

import style from "./TransactionsList.module.css";

const TransactionsList = ({
  transactions,
  title,
  onEditClick,
  onDeleteClick,
}: TransactionsListProps) => {

  if (transactions.length === 0) {
    return <p>Nenhuma transação encontrada.</p>;
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
                  aria-label={`Editar transação ${
                    transaction.description || ""
                  }`}
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
                  aria-label={`Excluir transação ${
                    transaction.description || ""
                  }`}
                >
                  <Image
                    className={style.image}
                    src={deleteImage}
                    width={16}
                    height={16}
                    alt="Imagem para editar transação"
                  />
                </button>
              </div>
            </div>
            <div className={style.transactionInfo}>
              <p className={style.transactionType}>
                {AdjustTypesNames(transaction.type)}
              </p>
              <p className={style.transactionDate}>
                {formatDate(transaction.date)}
              </p>
            </div>
            <div className={style.transactionValueAndDesc}>
              <p className={style.transactionDesc}>
                {transaction.description || ""}
              </p>
              <p className={style.transactionValue}>
                {formatCurrency(transaction.value)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionsList;
