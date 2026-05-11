import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "packages/ui/src/components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "email", "password", "search"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// --- Playground ---

export const Playground: Story = {
  args: {
    size: "md",
    placeholder: "Type here...",
    type: "text",
    disabled: false,
  },
};

// --- All sizes ---

export const AllSizes: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};
