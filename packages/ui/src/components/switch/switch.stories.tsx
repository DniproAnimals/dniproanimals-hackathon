import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "packages/ui/src/components/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    defaultChecked: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// --- Playground ---

export const Playground: Story = {
  args: {},
};

// --- States ---

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch />
      <Switch defaultChecked />
      <Switch disabled />
    </div>
  ),
};
