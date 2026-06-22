import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type TooltipStoryArgs = {
  content: string;
  sideOffset: number;
  triggerText: string;
};

const meta: Meta<TooltipStoryArgs> = {
  title: "packages/ui/src/components/Tooltip",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    content: { control: "text" },
    sideOffset: { control: "number" },
    triggerText: { control: "text" },
  },
  args: {
    content: "Helpful hint",
    sideOffset: 6,
    triggerText: "Hover me",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost">{args.triggerText}</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={args.sideOffset}>
          {args.content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

// --- Side offset ---

export const SideOffset: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Offset tooltip</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={12}>More space</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
