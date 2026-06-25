import { ContractDocument } from "@/app/(public)/contract/components/ContractDocument";
import { ContractDownloadButton } from "@/app/(public)/contract/components/ContractDownloadButton";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ContractDownloadButton> = {
  title: "apps/web/contract/ContractDownloadButton",
  component: ContractDownloadButton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl space-y-8">
        <div className="flex justify-end">
          <Story />
        </div>
        <ContractDocument />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ContractDownloadButton>;

export const Default: Story = {};
