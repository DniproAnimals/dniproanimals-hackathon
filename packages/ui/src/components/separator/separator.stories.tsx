import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

type SeparatorStoryArgs = {
  orientation: "horizontal" | "vertical";
  decorative: boolean;
};

const meta: Meta<SeparatorStoryArgs> = {
  title: "packages/ui/src/components/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    decorative: { control: "boolean" },
  },
  args: {
    orientation: "horizontal",
    decorative: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) =>
    args.orientation === "vertical" ? (
      <div className="flex h-16 items-center gap-3">
        <span className="text-sm text-foreground">Left</span>
        <Separator orientation="vertical" decorative={args.decorative} />
        <span className="text-sm text-foreground">Right</span>
      </div>
    ) : (
      <div className="w-72 space-y-3">
        <div className="text-sm text-foreground">Section one</div>
        <Separator decorative={args.decorative} />
        <div className="text-sm text-foreground">Section two</div>
      </div>
    ),
};

// --- Vertical ---

export const Vertical: Story = {
  render: () => (
    <div className="flex h-16 items-center gap-3">
      <span className="text-sm text-foreground">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-foreground">Right</span>
    </div>
  ),
};
