# `@dniproanimals/ui` — Table

## Import

```ts
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from "@dniproanimals/ui";
```

---

## Usage

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Buddy</TableCell>
      <TableCell>Adopted</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Rules

- ✅ Use `TableHead` for column labels.
- ✅ Keep rows clickable by applying classes on `TableRow`.
- ❌ Do not nest tables inside `TableCell`.
