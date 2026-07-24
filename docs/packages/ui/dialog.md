# `@dniproanimals/ui` — Dialog

## Import

```ts
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@dniproanimals/ui";
```

---

## Exports

- `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`
- `DialogOverlay`, `DialogContent`
- `DialogHeader`, `DialogFooter`
- `DialogTitle`, `DialogDescription`

---

## Props

| Component           | Custom props       | Description                      |
| ------------------- | ------------------ | -------------------------------- |
| `DialogContent`     | `hideClose?: bool` | Hides the default close button   |
| `DialogOverlay`     | —                  | Forwards Radix overlay props     |
| `DialogTitle`       | —                  | Forwards Radix title props       |
| `DialogDescription` | —                  | Forwards Radix description props |

All other props are forwarded to the Radix Dialog primitives.

---

## Usage

```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogDescription>Are you sure you want to continue?</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Rules

- ✅ Use `DialogTitle` for accessibility.
- ✅ Use `hideClose` only when you render your own close control.
- ❌ Do not mount dialog content outside `DialogContent`.
