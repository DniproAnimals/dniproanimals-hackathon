import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type PopoverStoryArgs = {
  title: string;
  description: string;
  showActions: boolean;
  sideOffset: number;
  triggerText: string;
};

const meta: Meta<PopoverStoryArgs> = {
  title: "packages/ui/src/components/Popover",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    showActions: { control: "boolean" },
    sideOffset: { control: "number" },
    triggerText: { control: "text" },
  },
  args: {
    title: "Quick actions",
    description: "Choose what you want to do next.",
    showActions: true,
    sideOffset: 6,
    triggerText: "Open popover",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">{args.triggerText}</Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={args.sideOffset}>
        <div className="space-y-2">
          <div className="text-sm font-medium">{args.title}</div>
          <div className="text-sm text-gray-medium">{args.description}</div>
          {args.showActions && (
            <div className="flex gap-2">
              <Button variant="primary" size="sm">
                Confirm
              </Button>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  ),
};
