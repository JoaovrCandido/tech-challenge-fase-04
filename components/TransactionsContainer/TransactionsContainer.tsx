"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";

// -> IMPORTS DA CLEAN ARCHITECTURE (Entidades e Casos de Uso)
import { Transaction, TransactionType } from "@/core/domain/entities/Transaction";
import { TransactionInput } from "@/core/domain/repositories/ITransactionsRepository";
import { sortTransactionsByDate } from "@/core/useCases/SortTransactions";
import { filterTransactions } from "@/core/useCases/FilterTransactions"; // <-- NOVO CASO DE USO

// -> NOSSOS HOOKS
import { useGetTransactions, useUpdateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";

import Loading from "../Loading/Loading";
import TransactionsList from "./components/TransactionsList/TransactionsList";
import TransactionsListHome from "./components/TransactionsListHome/TransactionsListHome";
import Modal from "../Modal/Modal";
import NewTransaction from "../NewTransaction/NewTransaction";
import DeleteTransaction from "../DeleteTransaction/DeleteTransaction";
import SuccessModal from "../SuccessModal/SuccessModal";

import style from "./TransactionContainer.module.css";

export default function TransactionsContainer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { data: transactions, error, isLoading } = useGetTransactions();
  const { mutateAsync: updateTx, isPending: isUpdating } = useUpdateTransaction();
  const { mutateAsync: deleteTx, isPending: isDeleting } = useDeleteTransaction();

  // Estados dos modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const [editType, setEditType] = useState<TransactionType | "">("deposito");
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isModalSucessOpen, setIsModalSucessOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Sucesso!");

  // ---> ESTADOS DO FILTRO AVANÇADO <---
  const [filterType, setFilterType] = useState<TransactionType | "todos">("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ---> ESTADO DO SCROLL INFINITO <---
  const [visibleCount, setVisibleCount] = useState(10);

  // Reseta a quantidade visível sempre que o usuário mexer em algum filtro
  useEffect(() => {
    setVisibleCount(10);
  }, [filterType, searchQuery, startDate, endDate]);

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditType(transaction.type);
    
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

    try {
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
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedTransaction) return;

    try {
      await deleteTx(selectedTransaction.id);
      handleCloseDeleteModal();
      setIsModalSucessOpen(true);
      setModalTitle("Sucesso!!!");
      setModalMessage("Transação deletada com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
    }
  };

  // ---> APLICANDO OS CASOS DE USO (Clean Architecture) <---
  const filteredAndSortedTransactions = useMemo(() => {
    if (!transactions) return [];

    // 1. Aplica o Caso de Uso de Filtro
    const filtered = filterTransactions(transactions, {
      type: filterType,
      searchQuery,
      startDate,
      endDate
    });

    // 2. Aplica o Caso de Uso de Ordenação
    return sortTransactionsByDate(filtered);
  }, [transactions, filterType, searchQuery, startDate, endDate]);

  // Lógica de Slicing (Paginação/Scroll Infinito)
  const visibleTransactions = filteredAndSortedTransactions.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedTransactions.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  if (isLoading) return <Loading />;
  if (error) return <p>Ocorreu um erro ao buscar as transações.</p>;
  if (!transactions) return <p>Nenhuma transação encontrada.</p>;

  const isSubmitting = isUpdating || isDeleting;

  return (
    <>
      {isHome ? (
        <TransactionsListHome
          title="Últimas transações"
          transaction={sortTransactionsByDate(transactions).slice(0, 3)}
        />
      ) : (
        <div className={style.container}>
          
          {/* UI DO FILTRO AVANÇADO RESTAURADA */}
          <div className={style.filterContainer}>
            <input 
              type="text" 
              placeholder="Buscar por descrição..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={style.searchInput}
            />
            
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as TransactionType | "todos")}
              className={style.selectInput}
            >
              <option value="todos">Todos os tipos</option>
              <option value="deposito">Depósitos</option>
              <option value="transferencia">Transferências</option>
            </select>

            <div className={style.dateFilterContainer}>
              <span className={style.dateFilterLabel}>De:</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className={style.dateInput}
              />
            </div>

            <div className={style.dateFilterContainer}>
              <span className={style.dateFilterLabel}>Até:</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className={style.dateInput}
              />
            </div>
          </div>

          <TransactionsList
            title="Extrato"
            transactions={visibleTransactions}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onLoadMore={handleLoadMore} 
            hasMore={hasMore} 
          />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NewTransaction
          title="Editar Transação"
          type={editType}
          value={editValue}
          description={editDescription}
          onTypeChange={(t) => setEditType(t as TransactionType)}
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