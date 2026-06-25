import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

type TabsStoryArgs = {
  tabCount: 2 | 3 | 4;
  longLabels: boolean;
  defaultValue: string;
};

const meta: Meta<TabsStoryArgs> = {
  title: "packages/ui/src/components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    tabCount: {
      control: "select",
      options: [2, 3, 4],
    },
    longLabels: { control: "boolean" },
    defaultValue: { control: "text" },
  },
  args: {
    tabCount: 3,
    longLabels: false,
    defaultValue: "overview",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => {
    const tabs = [
      { value: "overview", label: "Overview" },
      { value: "details", label: "Details" },
      { value: "history", label: "History" },
      { value: "notes", label: "Notes" },
    ].slice(0, args.tabCount);

    return (
      <Tabs defaultValue={args.defaultValue || tabs[0]?.value} className="w-80">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {args.longLabels ? `${tab.label} and summary` : tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="text-sm text-foreground">{tab.label} content.</div>
          </TabsContent>
        ))}
      </Tabs>
    );
  },
};

// --- Disabled tab ---

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-80">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details" disabled>
          Details (disabled)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="text-sm text-foreground">Overview content.</div>
      </TabsContent>
    </Tabs>
  ),
};
