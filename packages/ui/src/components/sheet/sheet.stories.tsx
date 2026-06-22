import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

type SheetStoryArgs = {
  side: "left" | "right" | "top" | "bottom";
  title: string;
  description: string;
  hideClose: boolean;
  showFooter: boolean;
};

const meta: Meta<SheetStoryArgs> = {
  title: "packages/ui/src/components/Sheet",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    side: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
    title: { control: "text" },
    description: { control: "text" },
    hideClose: { control: "boolean" },
    showFooter: { control: "boolean" },
  },
  args: {
    side: "right",
    title: "Adoption form",
    description: "Fill in the details to submit your request.",
    hideClose: false,
    showFooter: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Open sheet</Button>
      </SheetTrigger>
      <SheetContent side={args.side} hideClose={args.hideClose} className="p-6">
        <SheetHeader>
          <SheetTitle>{args.title}</SheetTitle>
          <SheetDescription>{args.description}</SheetDescription>
        </SheetHeader>
        <div className="mt-4 text-sm text-foreground">
          Place any content here: inputs, summaries, or checklists.
        </div>
        {args.showFooter && (
          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button variant="primary">Submit</Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  ),
};

// --- All sides ---

export const AllSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(
        [
          { label: "Left", side: "left" },
          { label: "Right", side: "right" },
          { label: "Top", side: "top" },
          { label: "Bottom", side: "bottom" },
        ] as const
      ).map(({ label, side }) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{label}</Button>
          </SheetTrigger>
          <SheetContent side={side} className="p-6">
            <SheetHeader>
              <SheetTitle>{label} sheet</SheetTitle>
              <SheetDescription>
                This sheet opens from the {side}.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
