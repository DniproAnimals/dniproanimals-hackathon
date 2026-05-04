// Avatar.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import type { AvatarShape, AvatarSize, AvatarStatus } from "./avatar";
import { AvatarWithStatus } from "./avatar";

const meta: Meta<typeof AvatarWithStatus> = {
  title: "packages/ui/src/components/Avatar",
  component: AvatarWithStatus,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"] satisfies AvatarSize[],
      description: "Size of the avatar",
      table: { defaultValue: { summary: "md" } },
    },
    shape: {
      control: "select",
      options: [
        "circle",
        "rounded",
        "slight",
        "square",
      ] satisfies AvatarShape[],
      description: "Shape of the avatar",
      table: { defaultValue: { summary: "circle" } },
    },
    status: {
      control: "select",
      options: [undefined, "online", "busy", "away", "offline"] satisfies (
        | AvatarStatus
        | undefined
      )[],
      description: "Status indicator dot",
    },
    src: {
      control: "text",
      description: "Image URL",
    },
    fallback: {
      control: "text",
      description: "Fallback initials (1–2 chars)",
    },
    alt: {
      control: "text",
      description: "Alt text for image",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarWithStatus>;

// ─── Playground ───────────────────────────────────────────────

export const Playground: Story = {
  args: {
    size: "md",
    shape: "circle",
    fallback: "MK",
    status: undefined,
  },
};

// ─── With image ───────────────────────────────────────────────

export const WithImage: Story = {
  args: {
    ...Playground.args,
    src: "https://i.pravatar.cc/150?img=12",
    alt: "User avatar",
    size: "lg",
  },
};

// ─── Fallback only ────────────────────────────────────────────

export const FallbackOnly: Story = {
  args: {
    ...Playground.args,
    fallback: "MK",
    size: "lg",
  },
};

// ─── With status ──────────────────────────────────────────────

export const WithStatus: Story = {
  args: {
    ...WithImage.args,
    status: "online",
  },
};

// ─── All sizes ────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as AvatarSize[]).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <AvatarWithStatus
            size={size}
            shape="circle"
            src="https://i.pravatar.cc/150?img=12"
            fallback="MK"
          />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── All shapes ───────────────────────────────────────────────

export const AllShapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["circle", "rounded", "slight", "square"] as AvatarShape[]).map(
        (shape) => (
          <div key={shape} className="flex flex-col items-center gap-2">
            <AvatarWithStatus
              size="lg"
              shape={shape}
              src="https://i.pravatar.cc/150?img=12"
              fallback="MK"
            />
            <span className="text-xs text-muted-foreground">{shape}</span>
          </div>
        ),
      )}
    </div>
  ),
};

// ─── All statuses ─────────────────────────────────────────────

export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["online", "busy", "away", "offline"] as AvatarStatus[]).map(
        (status) => (
          <div key={status} className="flex flex-col items-center gap-2">
            <AvatarWithStatus
              size="lg"
              shape="circle"
              src="https://i.pravatar.cc/150?img=12"
              fallback="MK"
              status={status}
            />
            <span className="text-xs text-muted-foreground">{status}</span>
          </div>
        ),
      )}
    </div>
  ),
};

// ─── Broken image → fallback ──────────────────────────────────

export const BrokenImage: Story = {
  args: {
    size: "lg",
    shape: "circle",
    src: "https://broken-url.example.com/avatar.jpg",
    fallback: "MK",
  },
};
