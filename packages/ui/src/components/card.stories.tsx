// Card.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta: Meta<typeof Card> = {
  title: "packages/ui/src/components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ─── Playground — полная карточка ─────────────────────────────

export const Playground: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>
          Short description of what this card is about.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">
          Main content goes here. Any elements can be placed inside CardContent.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="primary" size="sm">
          Confirm
        </Button>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  ),
};

// ─── Header only ──────────────────────────────────────────────

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Header only</CardTitle>
        <CardDescription>Card without content or footer.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

// ─── No footer ────────────────────────────────────────────────

export const NoFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>No footer</CardTitle>
        <CardDescription>Used for read-only info blocks.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">
          Content without any actions below.
        </p>
      </CardContent>
    </Card>
  ),
};

// ─── No header ────────────────────────────────────────────────

export const NoHeader: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-5">
        <p className="text-sm text-foreground">
          Card without a header. pt-5 восстанавливает padding сверху.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

// ─── Custom width ─────────────────────────────────────────────

export const FullWidth: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Full width card</CardTitle>
        <CardDescription>
          Stretches to container width — no fixed w-*.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">
          Useful inside grid or flex layouts.
        </p>
      </CardContent>
    </Card>
  ),
};

// ─── Карточка животного (пример реального использования) ──────

export const AnimalCard: Story = {
  render: () => (
    <Card className="w-72 overflow-hidden">
      <img
        src="https://placedog.net/400/200"
        alt="Dog"
        className="h-40 w-full object-cover"
      />
      <CardHeader>
        <CardTitle>Buddy</CardTitle>
        <CardDescription>Labrador · 3 years · Male</CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button variant="primary" size="sm" className="flex-1">
          Adopt
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          Learn more
        </Button>
      </CardFooter>
    </Card>
  ),
};
