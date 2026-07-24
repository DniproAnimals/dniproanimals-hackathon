# `@dniproanimals/ui` — Sheet

## Import

```ts
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetOverlay,
  SheetPortal,
} from "@dniproanimals/ui";
```

---

## Props

| Component      | Custom props          | Description                    |
| -------------- | --------------------- | ------------------------------ | ------ | -------- | ------------- |
| `SheetContent` | `side?: "top"         | "bottom"                       | "left" | "right"` | Slide-in side |
| `SheetContent` | `hideClose?: boolean` | Hides the default close button |

All other props are forwarded to the Radix Dialog primitives.

---

## Usage

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open panel</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
      <SheetDescription>Adjust search options.</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <Button variant="outline">Reset</Button>
      <Button>Apply</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

## Rules

- ✅ Use `side` to align with navigation or screen edge.
- ✅ Keep primary actions in `SheetFooter`.
- ❌ Do not render long forms without a scroll container.
