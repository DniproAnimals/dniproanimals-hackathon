import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

type DialogStoryArgs = DialogProps & {
  title: string;
  description: string;
  hideClose: boolean;
  showFooter: boolean;
  cancelText: string;
  confirmText: string;
};

const meta: Meta<DialogStoryArgs> = {
  title: "packages/ui/src/components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    defaultOpen: { control: "boolean" },
    modal: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    hideClose: { control: "boolean" },
    showFooter: { control: "boolean" },
    cancelText: { control: "text" },
    confirmText: { control: "text" },
  },
  args: {
    defaultOpen: false,
    modal: true,
    title: "Adoption request",
    description:
      "Please confirm that you want to send the request to the shelter.",
    hideClose: false,
    showFooter: true,
    cancelText: "Cancel",
    confirmText: "Send request",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────

export const Playground: Story = {
  args: {
    defaultOpen: true,
  },

  render: (args) => (
    <Dialog defaultOpen={args.defaultOpen} modal={args.modal}>
      <DialogTrigger asChild>
        <Button variant="primary">Open dialog</Button>
      </DialogTrigger>
      <DialogContent hideClose={args.hideClose}>
        <DialogHeader>
          <DialogTitle>{args.title}</DialogTitle>
          <DialogDescription>{args.description}</DialogDescription>
        </DialogHeader>
        <div className="text-sm text-foreground">
          You can place any content here: form fields, confirmations, or
          instructions.
        </div>
        {args.showFooter && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{args.cancelText}</Button>
            </DialogClose>
            <Button variant="primary">{args.confirmText}</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  ),
};

// ─── Long content (scroll) ────────────────────────────────────

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Open long dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adoption agreement</DialogTitle>
          <DialogDescription>
            Please review the terms before continuing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-foreground">
          {Array.from({ length: 8 }).map((_, index) => (
            <p key={index}>
              This is a sample paragraph to demonstrate scrolling behavior in
              the dialog content. Replace this with real text.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button variant="primary">Agree</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ─── No close button ─────────────────────────────────────────

export const NoCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Open without close</Button>
      </DialogTrigger>
      <DialogContent hideClose>
        <DialogHeader>
          <DialogTitle>Heads up</DialogTitle>
          <DialogDescription>
            Close the dialog using the action buttons below.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Dismiss</Button>
          </DialogClose>
          <Button variant="primary">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
