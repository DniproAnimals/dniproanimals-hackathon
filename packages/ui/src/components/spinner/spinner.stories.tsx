import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "packages/ui/src/components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

// --- Playground ---

export const Playground: Story = {
  args: {},
};

// --- All sizes ---

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};
