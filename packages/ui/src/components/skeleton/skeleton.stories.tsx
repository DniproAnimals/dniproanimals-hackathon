import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

type SkeletonStoryArgs = {
  lineCount: number;
  showTitle: boolean;
};

const meta: Meta<SkeletonStoryArgs> = {
  title: "packages/ui/src/components/Skeleton",
  tags: ["autodocs"],
  argTypes: {
    lineCount: { control: "number" },
    showTitle: { control: "boolean" },
  },
  args: {
    lineCount: 2,
    showTitle: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => (
    <div className="w-72 space-y-3">
      {args.showTitle && <Skeleton className="h-6 w-40" />}
      {Array.from({ length: Math.max(args.lineCount, 1) }).map((_, index) => (
        <Skeleton
          key={index}
          className={index % 2 === 0 ? "h-4 w-full" : "h-4 w-3/4"}
        />
      ))}
    </div>
  ),
};

// --- Card skeleton ---

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-72 space-y-4 rounded-2xl border border-gray-border p-4">
      <Skeleton className="h-36 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  ),
};
