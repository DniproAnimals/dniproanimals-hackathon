import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "packages/ui/src/components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: [
        "default",
        "brand",
        "soft",
        "outline",
        "success",
        "warning",
        "danger",
        "info",
        "reserved",
        "adopted",
        "dark",
      ],
    },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ─── Playground ───────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    children: "Badge",
  },
};

// ─── All variants ─────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(
        [
          "default",
          "brand",
          "soft",
          "outline",
          "success",
          "warning",
          "danger",
          "info",
          "reserved",
          "adopted",
          "dark",
        ] as const
      ).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

// ─── All sizes ────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Badge key={size} size={size}>
          {size}
        </Badge>
      ))}
    </div>
  ),
};
