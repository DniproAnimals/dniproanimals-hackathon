import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "packages/ui/src/components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    rows: { control: "number" },
  },
  args: {
    placeholder: "Write a note...",
    disabled: false,
    rows: 3,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// --- Playground ---

export const Playground: Story = {
  args: {},
};

// --- Disabled ---

export const Disabled: Story = {
  render: () => <Textarea placeholder="Disabled" disabled className="w-80" />,
};
