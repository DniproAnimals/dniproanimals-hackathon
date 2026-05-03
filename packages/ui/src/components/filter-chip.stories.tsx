import type { Meta, StoryObj } from "@storybook/react";
import { FilterChip } from "./filter-chip";

const meta: Meta<typeof FilterChip> = {
  title: "packages/ui/src/components/FilterChip",
  component: FilterChip,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "active", "muted"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    count: { control: "number" },
    children: { control: "text" },
  },
  args: {
    variant: "default",
    size: "md",
    children: "Vaccinated",
    count: 3,
  },
};

export default meta;

type Story = StoryObj<typeof FilterChip>;

export const Playground: Story = {};

export const WithRemove: Story = {
  args: {
    variant: "outline",
    children: "Small",
    count: undefined,
    onRemove: () => undefined,
  },
};
