import { IconSearch } from "@dniproanimals/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input/input";
import { Textarea } from "../textarea/textarea";
import { InputWithIcon } from "./form-field";

type FormFieldStoryArgs = {
  iconPosition: "left" | "right";
  placeholder: string;
  textareaPlaceholder: string;
  showTextarea: boolean;
  showIcon: boolean;
};

const meta: Meta<FormFieldStoryArgs> = {
  title: "packages/ui/src/components/FormField",
  component: InputWithIcon,
  tags: ["autodocs"],
  argTypes: {
    iconPosition: {
      control: "select",
      options: ["left", "right"],
    },
    placeholder: { control: "text" },
    textareaPlaceholder: { control: "text" },
    showTextarea: { control: "boolean" },
    showIcon: { control: "boolean" },
  },
  args: {
    iconPosition: "left",
    placeholder: "Search...",
    textareaPlaceholder: "Notes...",
    showTextarea: true,
    showIcon: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => (
    <div className="w-80 space-y-4">
      <InputWithIcon
        icon={args.showIcon ? <IconSearch /> : undefined}
        iconPosition={args.iconPosition}
      >
        <Input placeholder={args.placeholder} />
      </InputWithIcon>
      {args.showTextarea && (
        <InputWithIcon
          icon={args.showIcon ? <IconSearch /> : undefined}
          iconPosition="right"
        >
          <Textarea placeholder={args.textareaPlaceholder} />
        </InputWithIcon>
      )}
    </div>
  ),
};

// --- Right icon ---

export const RightIcon: Story = {
  render: () => (
    <InputWithIcon icon={<IconSearch />} iconPosition="right" className="w-80">
      <Input placeholder="Search..." />
    </InputWithIcon>
  ),
};
