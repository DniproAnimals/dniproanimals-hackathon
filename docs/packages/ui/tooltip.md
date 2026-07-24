# `@dniproanimals/ui` — Tooltip

## Import

```ts
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@dniproanimals/ui";
```

---

## Usage

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost">Info</Button>
    </TooltipTrigger>
    <TooltipContent>Helpful hint</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## Rules

- ✅ Keep tooltips to one short sentence.
- ✅ Wrap the app with one `TooltipProvider` when possible.
- ❌ Do not place interactive content inside tooltips.
