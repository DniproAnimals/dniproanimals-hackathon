import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input/input";
import { Label } from "./label";

type LabelStoryArgs = {
  label: string;
  placeholder: string;
  disabled: boolean;
};

const meta: Meta<LabelStoryArgs> = {
  title: "packages/ui/src/components/Label",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Email",
    placeholder: "you@example.com",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="email">{args.label}</Label>
      <Input
        id="email"
        placeholder={args.placeholder}
        disabled={args.disabled}
      />
    </div>
  ),
};

// --- Disabled ---

export const Disabled: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="email-disabled">Email</Label>
      <Input id="email-disabled" placeholder="you@example.com" disabled />
    </div>
  ),
};
