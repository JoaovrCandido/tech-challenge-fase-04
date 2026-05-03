import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/lib/api";
import { Transaction, TransactionInput } from "@/types";

export function useGetTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    refetchInterval: 15000, 
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: TransactionInput) => createTransaction(data),
    
    // 1. Ocorre imediatamente quando o botão é clicado
    onMutate: async (newTxData) => {
      // Cancela requisições GET em andamento para que não sobrescrevam a nossa alteração otimista
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      // Guarda um "snapshot" dos dados antigos para caso a API retorne erro
      const previousTransactions = queryClient.getQueryData<Transaction[]>(["transactions"]);

      // Atualiza o cache imediatamente (Programação Reativa)
      queryClient.setQueryData<Transaction[]>(["transactions"], (oldData) => {
        const optimisticTransaction: Transaction = {
          id: Math.random(), // ID provisório apenas para exibição visual
          date: new Date().toISOString().split('T')[0],
          type: newTxData.type,
          value: newTxData.amount, // Ajuste do nome da propriedade
          description: newTxData.description || "",
        };
        return oldData ? [...oldData, optimisticTransaction] : [optimisticTransaction];
      });

      // Retorna o snapshot para ser usado no onError, se necessário
      return { previousTransactions };
    },

    // 2. Se a API retornar erro, desfazemos a alteração visual
    onError: (err, newTxData, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions"], context.previousTransactions);
      }
    },

    // 3. Sempre executa no final (sucesso ou erro) para garantir a sincronia com o banco de dados real
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TransactionInput> }) => updateTransaction(id, data),
    
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(["transactions"]);

      queryClient.setQueryData<Transaction[]>(["transactions"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((t) => {
          if (t.id === id) {
            // Mescla os dados antigos com os dados novos otimistas
            return {
              ...t,
              type: data.type !== undefined ? data.type : t.type,
              value: data.amount !== undefined ? data.amount : t.value,
              description: data.description !== undefined ? data.description : t.description,
            };
          }
          return t;
        });
      });

      return { previousTransactions };
    },

    onError: (err, variables, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions"], context.previousTransactions);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(["transactions"]);

      queryClient.setQueryData<Transaction[]>(["transactions"], (oldData) => {
        if (!oldData) return [];
        // Filtra e remove imediatamente a transação do cache e da tela
        return oldData.filter((t) => t.id !== deletedId);
      });

      return { previousTransactions };
    },
    
    onError: (err, deletedId, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions"], context.previousTransactions);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}