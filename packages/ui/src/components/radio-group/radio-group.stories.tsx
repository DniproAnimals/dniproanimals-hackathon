import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../label/label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

type RadioGroupStoryArgs = {
  defaultValue: "dog" | "cat" | "other";
  showDisabled: boolean;
  longLabels: boolean;
};

const meta = {
  title: "packages/ui/src/components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "select",
      options: ["dog", "cat", "other"],
    },
    showDisabled: { control: "boolean" },
    longLabels: { control: "boolean" },
  },
  args: {
    defaultValue: "dog",
    showDisabled: false,
    longLabels: false,
  },
} satisfies Meta<RadioGroupStoryArgs>;

export default meta;
type Story = StoryObj<RadioGroupStoryArgs>;

// --- Playground ---

export const Playground: Story = {
  args: {
    defaultValue: "cat",
  },

  render: (args) => (
    <RadioGroup defaultValue={args.defaultValue} className="gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="pet-dog" value="dog" />
        <Label htmlFor="pet-dog">
          {args.longLabels ? "Dog (3 years, vaccinated)" : "Dog"}
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="pet-cat" value="cat" />
        <Label htmlFor="pet-cat">
          {args.longLabels ? "Cat (2 years, calm)" : "Cat"}
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem
          id="pet-other"
          value="other"
          disabled={args.showDisabled}
        />
        <Label htmlFor="pet-other">
          {args.longLabels ? "Other (special needs)" : "Other"}
        </Label>
      </div>
    </RadioGroup>
  ),
};

// --- Disabled option ---

export const DisabledOption: Story = {
  render: () => (
    <RadioGroup defaultValue="cat" className="gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="pet-dog-disabled" value="dog" disabled />
        <Label htmlFor="pet-dog-disabled">Dog (disabled)</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="pet-cat-disabled" value="cat" />
        <Label htmlFor="pet-cat-disabled">Cat</Label>
      </div>
    </RadioGroup>
  ),
};
