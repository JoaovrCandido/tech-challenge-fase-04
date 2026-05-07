import { TransactionType } from "@/core/domain/entities/Transaction";

export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const getSafeDate = (dateString: string) => {
  return dateString.includes("T") ? new Date(dateString) : new Date(`${dateString}T12:00:00`);
};

export const formatDate = (dateString: string) => {
  const date = getSafeDate(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const adjustTypesNames = (type: TransactionType) => {
  if (type === "deposito") {
    return "Depósito";
  } else if (type === "transferencia") {
    return "Transferência";
  }
  return "";
};

export const getMonthName = (dateStr: string) => {
  const date = getSafeDate(dateStr);
  const month = date.toLocaleString("pt-BR", { month: "long" });
  return month.charAt(0).toUpperCase() + month.slice(1);
}

export const getWeekday = (dateString: string) => {
  const date = getSafeDate(dateString);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
  });
};