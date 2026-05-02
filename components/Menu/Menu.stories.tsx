import type { Meta, StoryObj } from "@storybook/nextjs";

import Menu from "./Menu";

const meta: Meta<typeof Menu> = {
  title: "Components/Home/Menu",
  component: Menu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {};

