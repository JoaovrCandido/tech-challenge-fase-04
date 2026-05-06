"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

// -> IMPORTS DA CLEAN ARCHITECTURE
import { Transaction, TransactionType } from "@/core/domain/entities/Transaction";
import { TransactionInput } from "@/core/domain/repositories/ITransactionsRepository";
import { sortTransactionsByDate } from "@/core/useCases/SortTransactions";

// -> NOSSOS HOOKS (Reativos, lidam com Cache e com o Firebase)
import { useGetTransactions, useUpdateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";

import Loading from "../Loading/Loading";
import TransactionsList from "./components/TransactionsList/TransactionsList";
import TransactionsListHome from "./components/TransactionsListHome/TransactionsListHome";
import Modal from "../Modal/Modal";
import NewTransaction from "../NewTransaction/NewTransaction";
import DeleteTransaction from "../DeleteTransaction/DeleteTransaction";
import SuccessModal from "../SuccessModal/SuccessModal";

export default function TransactionsContainer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Chamadas limpas usando React Query!
  const { data: transactions, error, isLoading } = useGetTransactions();
  const { mutateAsync: updateTx } = useUpdateTransaction();
  const { mutateAsync: deleteTx } = useDeleteTransaction();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const [editType, setEditType] = useState<TransactionType | "">("deposito");
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isModalSucessOpen, setIsModalSucessOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Sucesso!");

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditType(transaction.type);
    
    // Recriando a máscara visual
    const formattedValue = transaction.value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setEditValue(formattedValue);
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
    if (!selectedTransaction || !editType) return;

    setIsSubmitting(true);
    try {
      // Removendo a máscara para o Firebase
      const cleanString = editValue.replace(/[^\d,-]/g, "").replace(",", ".");
      const numericValue = Number(cleanString);

      const updateData: Partial<TransactionInput> = {
        type: editType as TransactionType,
        amount: numericValue,
        description: editDescription,
      };

      await updateTx({ id: selectedTransaction.id, data: updateData });

      handleCloseModal();
      setIsModalSucessOpen(true);
      setModalTitle("Sucesso!!!");
      setModalMessage("Transação editada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar transação:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    try {
      await deleteTx(selectedTransaction.id);

      handleCloseDeleteModal();
      setIsModalSucessOpen(true);
      setModalTitle("Sucesso!!!");
      setModalMessage("Transação deletada com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p>Ocorreu um erro ao buscar as transações.</p>;
  if (!transactions) return <p>Nenhuma transação encontrada.</p>;

  // Caso de uso injetado
  const sortedTransactions = sortTransactionsByDate(transactions);

  return (
    <>
      {isHome ? (
        <TransactionsListHome
          title="Últimas transações"
          transaction={sortedTransactions.slice(0, 3)}
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

      <SuccessModal
        isOpen={isModalSucessOpen}
        title={modalTitle}
        onClose={() => setIsModalSucessOpen(false)}
        message={modalMessage}
      />
    </>
  );
}