import { Transaction } from "../domain/entities/Transaction";

export function calculateBalance(transactions: Transaction[] | undefined): number {
  if (!transactions || transactions.length === 0) return 0;

  return transactions.reduce((acc, current) => {
    if (current.type === "deposito") {
      return acc + current.value;
    } else if (current.type === "transferencia") {
      return acc - current.value;
    }
    return acc;
  }, 0);
}