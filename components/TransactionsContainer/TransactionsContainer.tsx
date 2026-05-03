"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

import { Transaction, TransactionType, TransactionInput } from "@/types";
import { sortTransactionsByDate } from "@/utils/transactions";

import { useGetTransactions, useUpdateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";
import { useFeedback } from "@/contexts/FeedbackContext"; // <-- Importando nosso hook

import Loading from "../Loading/Loading";
import TransactionsList from "./components/TransactionsList/TransactionsList";
import TransactionsListHome from "./components/TransactionsListHome/TransactionsListHome";
import Modal from "../Modal/Modal";

// import NewTransaction from "../NewTransaction/NewTransaction";
// import DeleteTransaction from "../DeleteTransaction/DeleteTransaction";

const NewTransaction = dynamic(() => import("../NewTransaction/NewTransaction"), {
  ssr: false, // Modais não precisam ser renderizados no servidor, economiza processamento!
});

const DeleteTransaction = dynamic(() => import("../DeleteTransaction/DeleteTransaction"), {
  ssr: false,
});

const TransactionsContainer = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { data: transactions, error, isLoading } = useGetTransactions();
  const { mutateAsync: updateTx, isPending: isUpdating } = useUpdateTransaction();
  const { mutateAsync: deleteTx, isPending: isDeleting } = useDeleteTransaction();
  
  const { showFeedback } = useFeedback(); // <-- Chamando o hook

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editType, setEditType] = useState<TransactionType>("deposito");
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditType(transaction.type);
    setEditValue(String(transaction.value));
    setEditDescription(transaction.description || "");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setEditValue("");
    setEditDescription("");
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditSubmit = async () => {
    if (!selectedTransaction) return;

    try {
      const numericValue = parseFloat(editValue.replace(",", "."));
      const updateData: Partial<TransactionInput> = {
        type: editType,
        amount: numericValue,
        description: editDescription,
      };

      await updateTx({ id: selectedTransaction.id, data: updateData });

      handleCloseModal();
      showFeedback("Sucesso!!!", "Transação editada com sucesso!"); // <-- Usando feedback global
    } catch (err) {
      console.error("Erro ao atualizar transação:", err);
      showFeedback("Erro!!!", "Ocorreu um erro ao editar a transação.");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedTransaction) return;

    try {
      await deleteTx(selectedTransaction.id);
      handleCloseDeleteModal();
      showFeedback("Sucesso!!!", "Transação deletada com sucesso!"); // <-- Usando feedback global
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
      showFeedback("Erro!!!", "Ocorreu um erro ao deletar a transação.");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p>Ocorreu um erro ao buscar as transações.</p>;
  if (!transactions) return <p>Nenhuma transação encontrada.</p>;

  const sortedTransactions = sortTransactionsByDate(transactions);
  const isSubmitting = isUpdating || isDeleting;

  return (
    <>
      {isHome ? (
        <TransactionsListHome
          title="Últimas transações"
          transaction={sortTransactionsByDate(transactions).slice(0, 3)}
        />
      ) : (
        <TransactionsList
          title="Extrato"
          transactions={sortedTransactions}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NewTransaction
          title="Editar Transação"
          type={editType}
          value={editValue}
          description={editDescription}
          onTypeChange={setEditType}
          onValueChange={setEditValue}
          onDescriptionChange={setEditDescription}
          onSubmit={handleEditSubmit}
          disabled={isSubmitting}
        />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <DeleteTransaction
          title="Deseja realmente deletar a transação?"
          onCancelSubmit={handleCloseDeleteModal}
          onDeleteSubmit={handleDeleteSubmit}
          disabled={isSubmitting}
        />
      </Modal>
      
      {/* O componente SuccessModal foi inteiramente removido daqui! */}
    </>
  );
};

export default TransactionsContainer;