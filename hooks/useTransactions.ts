import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

// ---> IMPORTANDO DA NOSSA NOVA ARQUITETURA LIMPA <---
import { transactionsRepository } from "@/infrastructure/database/FirebaseTransactionsRepository";
import { Transaction } from "@/core/domain/entities/Transaction";
import { TransactionInput } from "@/core/domain/repositories/ITransactionsRepository";

export function useGetTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["transactions", user?.uid],
    // Delega a busca para o Repositório de Infraestrutura
    queryFn: () => transactionsRepository.getTransactions(user!.uid),
    enabled: !!user?.uid, 
    refetchInterval: 15000, 
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    // Delega a criação para o Repositório
    mutationFn: (data: TransactionInput) => transactionsRepository.createTransaction(data, user!.uid),
    
    onMutate: async (newTxData) => {
      if (!user?.uid) return;
      
      await queryClient.cancelQueries({ queryKey: ["transactions", user.uid] });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(["transactions", user.uid]);

      queryClient.setQueryData<Transaction[]>(["transactions", user.uid], (oldData) => {
        const optimisticTransaction: Transaction = {
          id: Math.random().toString(), 
          date: new Date().toISOString().split('T')[0],
          type: newTxData.type,
          value: newTxData.amount, 
          description: newTxData.description || "",
          receipt: newTxData.receipt || "",
        };
        return oldData ? [...oldData, optimisticTransaction] : [optimisticTransaction];
      });

      return { previousTransactions };
    },

    onError: (err, newTxData, context) => {
      if (context?.previousTransactions && user?.uid) {
        queryClient.setQueryData(["transactions", user.uid], context.previousTransactions);
      }
    },

    onSettled: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ["transactions", user.uid] });
      }
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    // Delega a atualização para o Repositório
    mutationFn: ({ id, data }: { id: string | number; data: Partial<TransactionInput> }) => 
      transactionsRepository.updateTransaction(id, data),
    
    onMutate: async ({ id, data }) => {
      if (!user?.uid) return;
      
      await queryClient.cancelQueries({ queryKey: ["transactions", user.uid] });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(["transactions", user.uid]);

      queryClient.setQueryData<Transaction[]>(["transactions", user.uid], (oldData) => {
        if (!oldData) return [];
        return oldData.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              type: data.type !== undefined ? data.type : t.type,
              value: data.amount !== undefined ? data.amount : t.value,
              description: data.description !== undefined ? data.description : t.description,
              receipt: data.receipt !== undefined ? data.receipt : t.receipt,
            };
          }
          return t;
        });
      });

      return { previousTransactions };
    },

    onError: (err, variables, context) => {
      if (context?.previousTransactions && user?.uid) {
        queryClient.setQueryData(["transactions", user.uid], context.previousTransactions);
      }
    },

    onSettled: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ["transactions", user.uid] });
      }
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    // Delega a exclusão para o Repositório
    mutationFn: (id: string | number) => transactionsRepository.deleteTransaction(id),
    
    onMutate: async (deletedId) => {
      if (!user?.uid) return;
      
      await queryClient.cancelQueries({ queryKey: ["transactions", user.uid] });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(["transactions", user.uid]);

      queryClient.setQueryData<Transaction[]>(["transactions", user.uid], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((t) => t.id !== deletedId);
      });

      return { previousTransactions };
    },
    
    onError: (err, deletedId, context) => {
      if (context?.previousTransactions && user?.uid) {
        queryClient.setQueryData(["transactions", user.uid], context.previousTransactions);
      }
    },
    
    onSettled: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ["transactions", user.uid] });
      }
    },
  });
}