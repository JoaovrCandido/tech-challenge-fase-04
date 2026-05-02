import type { Meta, StoryObj } from "@storybook/nextjs";
import { userEvent, within } from "@storybook/testing-library";

import BoxBalance from "./BoxBalance";

const meta: Meta<typeof BoxBalance> = {
  title: "Components/Home/BoxBalance",
  component: BoxBalance,
  tags: ["autodocs"],
  argTypes: {
    dateString: {
      control: "text",
      description: "Data formatada a ser exibida",
    },
    balance: {
      control: "text",
      description: "Valor do saldo",
    },
    defaultIsActive: {
      control: "boolean",
      description: "Define se o saldo começa visível ou não",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BoxBalance>;

export const Default: Story = {
  args: {
    dateString: "quarta-feira, 22/10/2025",
    balance: "R$ 1000,00",
    defaultIsActive: true,
  },
};

export const SaldoOculto: Story = {
  args: {
    ...Default.args,
    defaultIsActive: false,
  },
};

export const InteracaoDeClique: Story = {
  args: {
    ...Default.args,
    defaultIsActive: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const eyeIcon = await canvas.getByAltText("Esconder ou mostrar saldo");

    await userEvent.click(eyeIcon);

    await userEvent.click(eyeIcon);
  },
};
