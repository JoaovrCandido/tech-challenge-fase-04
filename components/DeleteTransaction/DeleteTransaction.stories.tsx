import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs";

import DeleteTransaction from "./DeleteTransaction";
import Modal from "../Modal/Modal";
import SuccessModal from "../SuccessModal/SuccessModal";

const meta: Meta<typeof DeleteTransaction> = {
  title: "Components/Transacoes/DeleteTransaction",
  component: DeleteTransaction,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof DeleteTransaction>;

export const Default: Story = {
  args: {
    title: "Deseja realmente deletar a transação?",
  },
};

export const WithDeleteModal: Story = {
  render: () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isModalSucessOpen, setIsModalSucessOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("Sucesso!");

    const handleDeleted = () => {
      setIsModalSucessOpen(true);
      setModalTitle("Sucesso!!!");
      setModalMessage("Transação deletada com sucesso!");
    };

    const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
    };

    const handleCancelDeleteSubmit = () => {
      handleCloseDeleteModal();
    };

    const handleDeleteSubmit = () => {
      handleCloseDeleteModal();

      handleDeleted();
    };

    return (
      <>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
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

        <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
          <DeleteTransaction
            title="Deseja realmente deletar a transação?"
            onCancelSubmit={handleCancelDeleteSubmit}
            onDeleteSubmit={handleDeleteSubmit}
          />
        </Modal>

        <SuccessModal
          isOpen={isModalSucessOpen}
          title={modalTitle}
          onClose={() => setIsModalSucessOpen(false)}
          message={modalMessage}
        />
      </>
    );
  },
};
