import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/lib/api";
import { TransactionInput } from "@/types";

export function useGetTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    refetchInterval: 15000, // Mantendo a revalidação a cada 15s que você tinha no SWR
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TransactionInput) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    // O mutationFn aceita apenas um argumento, então passamos um objeto
    mutationFn: ({ id, data }: { id: number; data: Partial<TransactionInput> }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}