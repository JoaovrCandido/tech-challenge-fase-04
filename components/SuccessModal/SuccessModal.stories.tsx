import React, { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs";

import { SuccessModalProps } from "@/types";

import SuccessModal from "./SuccessModal";

const ModalExampleWrapper: React.FC<SuccessModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "10px 16px",
          backgroundColor: "#000000",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Abrir Modal
      </button>

      <SuccessModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

const meta: Meta<typeof SuccessModal> = {
  title: "Components/Home/SuccessModal",
  component: SuccessModal,
  tags: ["autodocs"],
  argTypes: {
    isOpen: { control: "boolean" },
    message: { control: "text" },
    title: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof SuccessModal>;

export const Sucesso: Story = {
  render: (args) => <ModalExampleWrapper {...args} />,
  args: {
    isOpen: true,
    title: "Sucesso!!!",
    message: "Transação realizado com sucesso!",
  },
};

export const SucessoEditar: Story = {
  render: (args) => <ModalExampleWrapper {...args} />,
  args: {
    isOpen: true,
    title: "Sucesso!!!",
    message: "Transação editada com sucesso!",
  },
};

export const SucessoExclusão: Story = {
  render: (args) => <ModalExampleWrapper {...args} />,
  args: {
    isOpen: true,
    title: "Sucesso!!!",
    message: "Transação excluída com sucesso!",
  },
};

export const Erro: Story = {
  render: (args) => <ModalExampleWrapper {...args} />,
  args: {
    isOpen: true,
    title: "Erro!!!",
    message: "Por favor, preencha a transação!",
  },
};
