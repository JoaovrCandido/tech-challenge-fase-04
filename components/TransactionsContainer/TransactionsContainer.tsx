"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

import { Transaction, TransactionType, TransactionInput } from "@/types";
import { sortTransactionsByDate } from "@/utils/transactions";

import { useGetTransactions, useUpdateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";
import { useFeedback } from "@/contexts/FeedbackContext";

import Loading from "../Loading/Loading";
import TransactionsList from "./components/TransactionsList/TransactionsList";
import TransactionsListHome from "./components/TransactionsListHome/TransactionsListHome";
import Modal from "../Modal/Modal";

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
  
  const { showFeedback } = useFeedback();

  // Estados dos modais de edição e exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editType, setEditType] = useState<TransactionType>("deposito");
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // ESTADOS DO FILTRO AVANÇADO
  const [filterType, setFilterType] = useState<TransactionType | "todos">("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ESTADO DO SCROLL INFINITO (Inicia mostrando 10 transações)
  const [visibleCount, setVisibleCount] = useState(10);

  // Reseta a quantidade visível sempre que o usuário mexer em algum filtro
  useEffect(() => {
    setVisibleCount(10);
  }, [filterType, searchQuery, startDate, endDate]);

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditType(transaction.type);
    
    // MÁSCARA NA EDIÇÃO: Formata o valor bruto do banco para exibir na tela
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
    if (!selectedTransaction) return;

    try {
      // DESFAZ A MÁSCARA NA EDIÇÃO
      const cleanString = editValue.replace(/[^\d,-]/g, "").replace(",", ".");
      const numericValue = Number(cleanString);

      const updateData: Partial<TransactionInput> = {
        type: editType,
        amount: numericValue,
        description: editDescription,
      };

      await updateTx({ id: selectedTransaction.id, data: updateData });

      handleCloseModal();
      showFeedback("Sucesso!!!", "Transação editada com sucesso!");
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
      showFeedback("Sucesso!!!", "Transação deletada com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
      showFeedback("Erro!!!", "Ocorreu um erro ao deletar a transação.");
    }
  };

  // Lógica derivada para os filtros e ordenação
  const filteredAndSortedTransactions = useMemo(() => {
    if (!transactions) return [];

    const filtered = transactions.filter((t) => {
      // Filtro de Tipo
      const matchType = filterType === "todos" || t.type === filterType;
      
      // Filtro de Texto (Busca)
      const matchSearch = (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtro de Data (Como é AAAA-MM-DD, a comparação de strings é segura e precisa)
      const matchStart = startDate ? t.date >= startDate : true;
      const matchEnd = endDate ? t.date <= endDate : true;

      return matchType && matchSearch && matchStart && matchEnd;
    });

    return sortTransactionsByDate(filtered);
  }, [transactions, filterType, searchQuery, startDate, endDate]);

  // Fatiamento (Slicing) para criar a paginação do Scroll Infinito no lado do cliente
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* UI DO FILTRO AVANÇADO */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '15px', backgroundColor: 'var(--bg-box)', borderRadius: '8px' }}>
            <input 
              type="text" 
              placeholder="Buscar por descrição..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as TransactionType | "todos")}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="todos">Todos os tipos</option>
              <option value="deposito">Depósitos</option>
              <option value="transferencia">Transferências</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '14px' }}>De:</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '14px' }}>Até:</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <TransactionsList
            title="Extrato"
            transactions={visibleTransactions}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onLoadMore={handleLoadMore} // Passando a prop que aciona o scroll
            hasMore={hasMore} // Passando a prop que avisa se ainda há itens
          />
        </div>
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
    </>
  );
};

export default TransactionsContainer;