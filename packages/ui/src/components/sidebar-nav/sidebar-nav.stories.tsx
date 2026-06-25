import { Icon12Hours, IconSearch } from "@dniproanimals/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { SidebarNavItem } from "./sidebar-nav";

type SidebarNavStoryArgs = {
  activeItem: "overview" | "adoptions" | "animals";
  showIcons: boolean;
  longLabels: boolean;
};

const meta: Meta<SidebarNavStoryArgs> = {
  title: "packages/ui/src/components/SidebarNav",
  tags: ["autodocs"],
  argTypes: {
    activeItem: {
      control: "select",
      options: ["overview", "adoptions", "animals"],
    },
    showIcons: { control: "boolean" },
    longLabels: { control: "boolean" },
  },
  args: {
    activeItem: "overview",
    showIcons: true,
    longLabels: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => (
    <nav className="w-64 space-y-1">
      <SidebarNavItem
        href="/"
        icon={args.showIcons ? <IconSearch /> : undefined}
        active={args.activeItem === "overview"}
      >
        {args.longLabels ? "Overview and daily summary" : "Overview"}
      </SidebarNavItem>
      <SidebarNavItem
        href="/adoptions"
        icon={args.showIcons ? <Icon12Hours /> : undefined}
        active={args.activeItem === "adoptions"}
      >
        {args.longLabels ? "Adoptions and requests" : "Adoptions"}
      </SidebarNavItem>
      <SidebarNavItem href="/animals" active={args.activeItem === "animals"}>
        {args.longLabels ? "Animals and medical records" : "Animals"}
      </SidebarNavItem>
    </nav>
  ),
};
