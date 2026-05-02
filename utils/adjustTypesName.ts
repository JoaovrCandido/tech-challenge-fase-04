import { TransactionType } from "@/types";

export const AdjustTypesNames = (type: TransactionType) => {
  if (type === "deposito") {
    return "Depósito";
  } else if (type === "transferencia") {
    return "Transferência";
  }

  return
};
