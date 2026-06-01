import { ContractDocument } from "@/app/(public)/contract/components/ContractDocument";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ContractDocument> = {
  title: "apps/web/contract/ContractDocument",
  component: ContractDocument,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof ContractDocument>;

export const Default: Story = {};
