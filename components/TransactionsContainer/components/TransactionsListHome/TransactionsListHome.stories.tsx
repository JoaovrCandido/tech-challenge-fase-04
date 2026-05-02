import type { Meta, StoryObj } from "@storybook/nextjs";

import { Transaction } from "@/types";

import TransactionsListHome from "./TransactionsListHome";

const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: new Date("2023-10-25T14:30:00Z").toISOString(),
    type: "deposito",
    value: 1500.75,
    description: "Salário",
  },
  {
    id: 2,
    date: new Date("2023-10-24T10:15:00Z").toISOString(),
    type: "transferencia",
    value: 250.0,
    description: "Pagamento Aluguel",
  },
];

const meta: Meta<typeof TransactionsListHome> = {
    title: "Components/Home/TransactionListHome",
    component: TransactionsListHome,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"]
};

export default meta

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Últimas transações',
    transaction: mockTransactions
  },
};

export const Empty: Story = {
  args: {
    title: 'Últimas transações',
    transaction: []
  },
};