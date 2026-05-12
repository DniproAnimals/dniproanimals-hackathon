# `@dniproanimals/ui` — DropdownMenu

## Import

```ts
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
} from "@dniproanimals/ui";
```

---

## Props

| Component                | Custom props            | Description                  |
| ------------------------ | ----------------------- | ---------------------------- |
| `DropdownMenuContent`    | `sideOffset?: number`   | Gap between trigger and menu |
| `DropdownMenuItem`       | `inset?: boolean`       | Adds left padding            |
| `DropdownMenuItem`       | `destructive?: boolean` | Red destructive styling      |
| `DropdownMenuLabel`      | `inset?: boolean`       | Adds left padding            |
| `DropdownMenuSubTrigger` | `inset?: boolean`       | Adds left padding            |

All other props are forwarded to the Radix DropdownMenu primitives.

---

## Usage

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem>View</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Rules

- ✅ Use `DropdownMenuLabel` to group related items.
- ✅ Use `destructive` for irreversible actions.
- ❌ Do not use menu items as navigation without `asChild` + `<Link>`.
