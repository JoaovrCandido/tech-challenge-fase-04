import { Transaction } from "../entities/Transaction";

// DTO (Data Transfer Object) para criação/edição
export interface TransactionInput {
  type: "deposito" | "transferencia";
  amount: number;
  description?: string;
  receipt?: string;
}

export interface ITransactionsRepository {
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(data: TransactionInput, userId: string): Promise<Transaction>;
  updateTransaction(id: string | number, data: Partial<TransactionInput>): Promise<void>;
  deleteTransaction(id: string | number): Promise<void>;
}