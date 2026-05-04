# Component anatomy

How to lay out a single component folder. Where the folder lives in the tree is covered in [structure.md](structure.md) — short version: route-local components in `app/<route>/components/`, cross-route components in `src/shared/components/`, UI primitives in the **`@dniproanimals/ui`** package.

## Sibling files

These live next to `Component.tsx` inside the component's folder:

| File                 | Purpose                   | Required?                                |
| -------------------- | ------------------------- | ---------------------------------------- |
| `Component.tsx`      | The component itself      | Yes                                      |
| `Component.test.tsx` | Tests (singular `.test.`) | When non-trivial logic is worth covering |
| `index.ts`           | Barrel re-export          | Yes                                      |

Naming is **always** `PascalCase` and matches the component name exactly. Folder name matches too: `Component/Component.tsx`.

> **CVA variants** (`Component.variants.ts`) are a pattern used inside `@dniproanimals/ui`. App-level components in `apps/web` typically don't define their own variant files — they compose `@dniproanimals/ui` primitives that already carry variants.
>
> **Storybook stories** (`Component.stories.tsx`) are a pattern in the separate `apps/storybook` workspace, not in `apps/web`.
>
> **Tests**: `apps/web` has no Vitest/Jest setup yet. The `.test.tsx` row is forward-looking; until the test runner is wired up there's no harness to run them.

## Local subfolders

Create these **only when the component grows non-trivial**. Don't pre-create empty folders.

| Folder        | What goes inside                                                                              |
| ------------- | --------------------------------------------------------------------------------------------- |
| `components/` | Private subcomponents owned by this component                                                 |
| `hooks/`      | Hooks coupled to this component (e.g. its form hook + typed `useFormContext` wrapper)         |
| `utils/`      | Pure helpers used only inside this component. Promote to `shared/utils/` on a second consumer |
| `constants/`  | Local constants                                                                               |
| `types/`      | Local types/interfaces when they grow beyond a few lines                                      |

For form components, the project keeps the Zod schema as a **sibling** (`schema.ts`), not under `constants/` — see [forms.md](forms.md) and the real example at `src/shared/components/OrganizationForm/`.

## When sibling vs subfolder

- **Small component** (one file): only `Component.tsx` + `index.ts`.
- **Growing component** (helpers, hooks, multiple subcomponents): add subfolders as needed, one at a time.
- **Empty folders are noise.** A subfolder must contain at least one file.

Saved feedback: even at "medium" size, prefer extracting controls into their own folders (e.g. `SearchField/`, `StatusTabs/`) instead of inlining 80-line subcomponents next to the parent.

## Example layout

A fully grown component (mirrors the real `OrganizationForm/`):

```text
OrganizationForm/
├── OrganizationForm.tsx
├── schema.ts                      # Zod schema + inferred type + defaults
├── components/
│   ├── OrganizationNameField/
│   │   ├── OrganizationNameField.tsx
│   │   └── index.ts
│   ├── OrganizationDescriptionField/
│   ├── OrganizationLocationField/
│   ├── OrganizationContactsFields/
│   └── OrganizationPhotoField/
├── hooks/
│   └── useOrganizationForm.ts     # useForm + typed useFormContext wrapper
└── index.ts
```

A small component:

```text
SearchField/
├── SearchField.tsx
└── index.ts
```

## Example

```tsx
// Component.tsx
import { cn } from "@dniproanimals/ui";
import type { ComponentProps } from "react";

interface SectionProps extends ComponentProps<"section"> {
  title: string;
}

export function Section({
  title,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("rounded-2xl bg-card p-4", className)} {...props}>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
```

```ts
// index.ts
export * from "./Component";
```

Notes:

- `cn` is imported from `@dniproanimals/ui`, not `@/shared/utils`.
- Props extend the appropriate DOM element so `className` and the rest of the standard HTML attrs flow through naturally.
- Use semantic tokens (`bg-card`, `text-foreground`) rather than hex values — see [styling.md](styling.md).

## Choosing primitives vs DOM

In `apps/web`, **prefer primitives from `@dniproanimals/ui`** over rolling raw DOM:

```tsx
import { Button, Input, Form, FormField, Select } from "@dniproanimals/ui";
```

Drop down to raw DOM only for layout (`<div>`, `<section>`, `<ul>`, …) or when no primitive exists.

If you need a primitive that doesn't exist yet (e.g. a new variant of `Button`), add or extend it inside `packages/ui/src/components/` rather than reimplementing it in the app.

## Checklist

- [ ] Single responsibility — the component does one thing.
- [ ] Reasonable size (under ~200 lines). If larger, extract subcomponents.
- [ ] Props count under ~7. More than that usually means the component should be split or accept `children` instead of flags.
- [ ] State is colocated with the consumer that needs it.
- [ ] Server state comes from React Query (`src/shared/query-hooks/`), not `useState` + `useEffect`.
- [ ] Imports `cn`, `Button`, `Input`, etc. from `@dniproanimals/ui` — never re-implements them.
- [ ] Uses semantic tokens (`text-foreground`, `bg-primary`) — no hex codes.
- [ ] No premature memoization (`memo`/`useMemo`/`useCallback`) — see [performance.md](performance.md).
