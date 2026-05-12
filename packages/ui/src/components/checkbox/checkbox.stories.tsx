// Checkbox.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "packages/ui/src/components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {
  render: (args) => <Checkbox {...args} />,
};
