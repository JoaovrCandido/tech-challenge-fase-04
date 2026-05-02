import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { userEvent, within } from "@storybook/testing-library";

import { TransactionType } from "@/types";

import NewTransaction from "./NewTransaction";
import  SuccessModal from "../SuccessModal/SuccessModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logAction = (name: string) => (...args: any[]) => {
    console.log(`[Storybook Action] ${name}`, ...args);
  };

const meta: Meta<typeof NewTransaction> = {
  title: "Components/Home/NewTransaction",
  component: NewTransaction,
  tags: ["autodocs"],

  argTypes: {
    onTypeChange: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    onDescriptionChange: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    disabled: { control: "boolean" },
  },

  args: {
    onTypeChange: logAction("onTypeChange"),
    onValueChange: logAction("onValueChange"),
    onDescriptionChange: logAction("onDescriptionChange"),
    onSubmit: logAction("onSubmit"),
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof NewTransaction>;

export const Default: Story = {
  render: (args) => {
    const [type, setType] = useState<TransactionType>("");
    const [value, setValue] = useState("");
    const [description, setDescription] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("Sucesso!");

    const handleSubmit = () => {
      console.log("[Storybook Submit Data]", { type, value, description });

      args.onSubmit();

      setIsOpenModal(true);
      setModalTitle("Sucesso!!!")
      setModalMessage("Transação realizado com sucesso!");

      setType("");
      setValue("");
      setDescription("");
    };

    return (
      <>
      <NewTransaction
        {...args}
        title="Nova transação"
        type={type}
        value={value}
        description={description}
        onTypeChange={(value) => {
          setType(value);
          args.onTypeChange(value);
        }}
        onValueChange={(value) => {
          setValue(value);
          args.onValueChange(value);
        }}
        onDescriptionChange={(value) => {
          setDescription(value);
          args.onDescriptionChange(value);
        }}
        onSubmit={handleSubmit}
      />

      <SuccessModal 
        isOpen={isOpenModal}
        title={modalTitle}
        onClose={() => setIsOpenModal(false)}
        message={modalMessage}
      />
      </>
    );
  },
};

export const Disabled: Story = {
  args: {
    title: "Nova transação",
    type: "deposito",
    value: "1.250,00",
    description: "Deposito...",
    disabled: true,
  },
};

export const PreenchendoFormulario: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const select = canvas.getByRole("combobox");
    const valueInput = canvas.getByPlaceholderText("10,00");
    const descInput = canvas.getByPlaceholderText("Descrição (opcional)");
    const submitButton = canvas.getByRole("button", {
      name: /concluir transação/i,
    });

    await userEvent.selectOptions(select, "deposito");
    await userEvent.type(valueInput, "250,50");
    await userEvent.type(descInput, "Pagamento da fatura");

    await userEvent.click(submitButton);
  },
};
