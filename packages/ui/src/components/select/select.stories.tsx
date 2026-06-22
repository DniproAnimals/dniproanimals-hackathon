import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

type SelectStoryArgs = {
  placeholder: string;
  defaultValue: string;
  withGroups: boolean;
  disabledItem: boolean;
};

const meta: Meta<SelectStoryArgs> = {
  title: "packages/ui/src/components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    withGroups: { control: "boolean" },
    disabledItem: { control: "boolean" },
  },
  args: {
    placeholder: "Select a pet",
    defaultValue: "dog",
    withGroups: false,
    disabledItem: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => (
    <Select defaultValue={args.defaultValue || undefined}>
      <SelectTrigger className="w-64">
        <SelectValue placeholder={args.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {args.withGroups ? (
          <>
            <SelectGroup>
              <SelectLabel>Primary</SelectLabel>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Availability</SelectLabel>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved" disabled={args.disabledItem}>
                Reserved
              </SelectItem>
            </SelectGroup>
          </>
        ) : (
          <SelectGroup>
            <SelectLabel>Pets</SelectLabel>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
            <SelectItem value="parrot">Parrot</SelectItem>
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  ),
};

// --- With groups ---

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Primary</SelectLabel>
          <SelectItem value="primary">Primary</SelectItem>
          <SelectItem value="secondary">Secondary</SelectItem>
          <SelectItem value="outline">Outline</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Availability</SelectLabel>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="reserved" disabled>
            Reserved (disabled)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
