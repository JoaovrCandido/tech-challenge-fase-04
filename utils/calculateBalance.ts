import { Transaction } from "@/types";

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => {
    return t.type === "deposito" ? acc + t.value : acc - t.value;
  }, 0);
}