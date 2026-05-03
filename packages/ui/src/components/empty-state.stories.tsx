import { IconSearch } from "@dniproanimals/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "packages/ui/src/components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Basic: Story = {
  render: () => (
    <EmptyState
      icon={<IconSearch />}
      title="No results"
      description="Try adjusting your filters or search again."
      action={<Button variant="secondary">Reset filters</Button>}
    />
  ),
};
