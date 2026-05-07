import { Transaction, TransactionType } from "../domain/entities/Transaction";

export interface FilterParams {
  type: TransactionType | "todos";
  searchQuery: string;
  startDate: string;
  endDate: string;
}

export function filterTransactions(transactions: Transaction[], filters: FilterParams): Transaction[] {
  return transactions.filter((t) => {
    // Filtro de Tipo
    const matchType = filters.type === "todos" || t.type === filters.type;
    
    // Filtro de Texto (Busca na descrição ou caso não tenha, ignora)
    const matchSearch = (t.description || "").toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    // Filtro de Data (Comparação de strings AAAA-MM-DD é segura)
    const matchStart = filters.startDate ? t.date >= filters.startDate : true;
    const matchEnd = filters.endDate ? t.date <= filters.endDate : true;

    return matchType && matchSearch && matchStart && matchEnd;
  });
}