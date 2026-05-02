import React from "react";

import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  AccessibilityProvider,
  useAccessibility,
} from "@/contexts/AccessibilityProvider";

import { HeaderProps } from "@/types";

import Header from "./Header";

const meta = {
  title: "Components/Home/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],

  decorators: [
    (Story) => (
      <AccessibilityProvider>
        <Story />
      </AccessibilityProvider>
    ),
  ],

  args: {
    title: "Banco FIAP",
  },

  argTypes: {
    title: {
      description: "O título principal exibido no cabeçalho",
      control: "text",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof Header>;

const HeaderWithContext = (args: Partial<HeaderProps>) => {
  const { toggleDarkMode, toggleChangeFontSize } = useAccessibility();

  const title = args.title || "Título Padrão (Fallback)";

  return (
    <Header
      title={title}
      onToggleDarkMode={toggleDarkMode}
      onToggleFontSize={toggleChangeFontSize}
    />
  );
};

export const Funcional: Story = {
  args: {},

  render: (args) => <HeaderWithContext {...args} />,
};
