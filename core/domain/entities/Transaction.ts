export type TransactionType = "deposito" | "transferencia";

export interface Transaction {
  id: string | number;
  type: TransactionType;
  value: number;
  date: string;
  description: string;
  receipt?: string;
  createdAt?: number;
}