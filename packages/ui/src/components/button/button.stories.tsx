import { Icon12Hours, IconAbacus, IconSearch } from "@dniproanimals/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "packages/ui/src/components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "icon", "icon-sm", "icon-lg"],
    },
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "link",
        "destructive",
        "success",
        "soft",
        "subtle",
      ],
    },
    shape: {
      control: "select",
      options: ["default", "pill", "square"],
    },
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ─── Playground ───────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: "primary",
    size: "md",
    shape: "default",
    disabled: false,
    children: "Button",
  },
};

// ─── All variants ─────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(
        [
          "primary",
          "secondary",
          "outline",
          "ghost",
          "link",
          "destructive",
          "success",
          "soft",
          "subtle",
        ] as const
      ).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

// ─── All sizes ────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

// ─── All shapes ───────────────────────────────────────────────

export const AllShapes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(["default", "pill", "square"] as const).map((shape) => (
        <Button key={shape} shape={shape}>
          {shape}
        </Button>
      ))}
    </div>
  ),
};

// ─── Icon buttons ─────────────────────────────────────────────

export const IconButtons: Story = {
  args: {
    size: "icon",
  },

  render: () => (
    <div className="flex items-center gap-3">
      <Button size="icon-sm" variant="ghost">
        <Icon12Hours />
      </Button>
      <Button size="icon">
        <IconSearch />
      </Button>
      <Button size="icon-lg" variant="destructive">
        <IconAbacus />
      </Button>
    </div>
  ),
};

// ─── With icons ───────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">
        <Icon12Hours /> Send email
      </Button>
      <Button variant="outline">
        <IconSearch /> Add item
      </Button>
      <Button variant="destructive">
        <IconAbacus /> Delete
      </Button>
    </div>
  ),
};

// ─── Disabled state ───────────────────────────────────────────

export const Disabled: Story = {
  args: {
    ...Playground.args,
    disabled: true,
  },
};

// ─── asChild (render as <a>) ──────────────────────────────────

export const AsChild: Story = {
  render: () => (
    <Button asChild variant="outline">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Open link
      </a>
    </Button>
  ),
};
