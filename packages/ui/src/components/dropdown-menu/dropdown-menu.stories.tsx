import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type DropdownMenuStoryArgs = {
  sideOffset: number;
  showSubmenu: boolean;
  showShortcut: boolean;
  destructive: boolean;
  checked: boolean;
  label: string;
  primaryItemText: string;
  longItem: boolean;
};

const meta = {
  title: "packages/ui/src/components/DropdownMenu",
  tags: ["autodocs"],
  argTypes: {
    sideOffset: { control: "number" },
    showSubmenu: { control: "boolean" },
    showShortcut: { control: "boolean" },
    destructive: { control: "boolean" },
    checked: { control: "boolean" },
    label: { control: "text" },
    primaryItemText: { control: "text" },
    longItem: { control: "boolean" },
  },
  args: {
    sideOffset: 6,
    showSubmenu: true,
    showShortcut: true,
    destructive: true,
    checked: true,
    label: "Actions",
    primaryItemText: "Profile",
    longItem: false,
  },
} satisfies Meta<DropdownMenuStoryArgs>;

export default meta;
type Story = StoryObj<DropdownMenuStoryArgs>;

// --- Playground ---

export const Playground: Story = {
  args: {
    showSubmenu: false,
    showShortcut: false,
    sideOffset: 34,
  },

  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={args.sideOffset}>
        <DropdownMenuLabel>{args.label}</DropdownMenuLabel>
        <DropdownMenuItem>
          {args.longItem
            ? "Very long menu item label to test wrapping"
            : args.primaryItemText}
        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={args.checked}>
          Show archived
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Notify me</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="recent">
          <DropdownMenuRadioItem value="recent">Recent</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="popular">Popular</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        {args.showSubmenu && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset>More</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem destructive={args.destructive}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
        <DropdownMenuItem>
          Save
          {args.showShortcut && (
            <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
