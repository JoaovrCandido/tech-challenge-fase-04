"use client";

import { useState } from "react";

import useSWR, { mutate } from "swr";

import { Transaction, TransactionType, TransactionInput } from "@/types";

import { sortTransactionsByDate } from "@/utils/transactions";

import { usePathname } from "next/navigation";

import {
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "@/lib/api";

import Loading from "../Loading/Loading";
import TransactionsList from "./components/TransactionsList/TransactionsList";
import TransactionsListHome from "./components/TransactionsListHome/TransactionsListHome";
import Modal from "../Modal/Modal";
import NewTransaction from "../NewTransaction/NewTransaction";
import DeleteTransaction from "../DeleteTransaction/DeleteTransaction";
import SuccessModal from "../SuccessModal/SuccessModal";

const fetcher = () => getTransactions();

const TransactionsContainer = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const {
    data: transactions,
    error,
    isLoading,
  } = useSWR<Transaction[]>("transactions", fetcher, {
    refreshInterval: 15000,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [editType, setEditType] = useState<TransactionType>("deposito");
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isModalSucessOpen, setIsModalSucessOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Sucesso!");

  const handleEdited = () => {
    setIsModalSucessOpen(true);
    setModalTitle("Sucesso!!!");
    setModalMessage("Transação editada com sucesso!");
  };

  const handleDeleted = () => {
    setIsModalSucessOpen(true);
    setModalTitle("Sucesso!!!");
    setModalMessage("Transação deletada com sucesso!");
  };

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

    setIsSubmitting(true);
    try {
      const numericValue = parseFloat(editValue.replace(",", "."));

      const updateData: Partial<TransactionInput> = {
        type: editType,
        amount: numericValue,
        description: editDescription,
      };

      await updateTransaction(selectedTransaction.id, updateData);

      mutate("transactions");

      handleCloseModal();

      handleEdited();
    } catch (err) {
      console.error("Erro ao atualizar transação:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelDeleteSubmit = () => {
    handleCloseDeleteModal();
  };

  const handleDeleteSubmit = async () => {
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    try {
      await deleteTransaction(selectedTransaction.id);

      mutate("transactions");

      handleCloseDeleteModal();

      handleDeleted();
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Ocorreu um erro ao buscar as transações.</p>;
  }

  if (!transactions) {
    return <p>Nenhuma transação encontrada.</p>;
  }

  const sortedTransactions = sortTransactionsByDate(transactions);

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
          onCancelSubmit={handleCancelDeleteSubmit}
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
};

export default TransactionsContainer;
