export type TransactionType = "deposito" | "transferencia" | "";

export interface Transaction {
  id: string | number;
  type: TransactionType;
  value: number;
  date: string; // Formato "AAAA-MM-DD"
  description: string;
  receipt?: string; // NOVO: string em Base64 da imagem/pdf
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  description?: string;
  receipt?: string; // NOVO
}

export interface Database {
  transaction: Transaction[];
}

export interface NewTransactionProps {
  title: string;
  type: TransactionType;
  value: string;
  description?: string;
  receipt?: string; // NOVO
  onTypeChange: (value: TransactionType) => void;
  onValueChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onReceiptChange: (value: string) => void; // NOVO
  onSubmit: () => void;
  disabled?: boolean;
}

export interface DeleteTransactioProps {
  title: string;
  onCancelSubmit: () => void;
  onDeleteSubmit: () => void;
  disabled?: boolean;
}

export interface BoxBalanceProps {
  dateString: string;
  balance?: string;
  defaultIsActive?: boolean;
}

export type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
};

export interface HeaderProps {
  title: string;
  onToggleFontSize: () => void;
  onToggleDarkMode: () => void;
}

export interface AccessibilityContextType {
  theme: "light" | "dark";
  fontLevel: 0 | 1 | 2;
  toggleDarkMode: () => void;
  toggleChangeFontSize: () => void;
}

export interface TransactionsListProps {
  transactions: Transaction[];
  title: string
  onEditClick: (transaction: Transaction) => void;
  onDeleteClick: (transation: Transaction) => void;
}

export interface TransactionsListHomeProps {
  transaction: Transaction[];
  title: string
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface MenuItem {
  label: string;
  path: string;
}