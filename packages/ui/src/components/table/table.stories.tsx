import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

type TableStoryArgs = {
  rowCount: number;
  longText: boolean;
  showSelected: boolean;
};

const meta = {
  title: "packages/ui/src/components/Table",
  tags: ["autodocs"],
  argTypes: {
    rowCount: { control: "number" },
    longText: { control: "boolean" },
    showSelected: { control: "boolean" },
  },
  args: {
    rowCount: 3,
    longText: false,
    showSelected: true,
  },
} satisfies Meta<TableStoryArgs>;

export default meta;
type Story = StoryObj<TableStoryArgs>;

// --- Playground ---

export const Playground: Story = {
  render: (args) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: Math.max(args.rowCount, 1) }).map((_, index) => (
          <TableRow
            key={index}
            data-state={
              args.showSelected && index === 1 ? "selected" : undefined
            }
          >
            <TableCell>
              {args.longText
                ? "Buddy the Golden Retriever"
                : ["Buddy", "Luna", "Max"][index % 3]}
            </TableCell>
            <TableCell>
              {args.longText
                ? "Available for adoption"
                : ["Available", "Reserved", "Adopted"][index % 3]}
            </TableCell>
            <TableCell>{["3", "2", "4"][index % 3]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// --- With footer ---

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Food</TableCell>
          <TableCell>2</TableCell>
          <TableCell>$20</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Leash</TableCell>
          <TableCell>1</TableCell>
          <TableCell>$12</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>3</TableCell>
          <TableCell>$32</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
