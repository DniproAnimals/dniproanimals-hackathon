# `@dniproanimals/ui` — Card

## Import

```ts
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@dniproanimals/ui";
```

---

## Types

| Value             | When to use                                   |
| ----------------- | --------------------------------------------- |
| `Card`            | Main CTA — one per view                       |
| `CardHeader`      | Card Header -                                 |
| `CardTitle`       | Secondary action alongside primary            |
| `CardDescription` | Neutral action, bordered                      |
| `CardContent`     | Toolbar / icon-adjacent action, no background |
| `CardFooter`      | Inline text-like action                       |

---

## Sizes

| Value     | Height  | Use case                 |
| --------- | ------- | ------------------------ |
| `sm`      | 32px    | Dense UIs, table rows    |
| `md`      | 40px    | Default                  |
| `lg`      | 48px    | Forms, prominent actions |
| `xl`      | 56px    | Hero / landing CTAs      |
| `icon`    | 36×36px | Square icon-only button  |
| `icon-sm` | 28×28px | Compact icon button      |
| `icon-lg` | 44×44px | Large icon button        |

---

## Usage

**Basic:**

```tsx
<Button>Save</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>
```

**With icon:**

```tsx
import { IconSearch } from "@dniproanimals/icons";

<Button variant="primary">
  <IconSearch /> Search
</Button>;
```

**Icon-only:**

```tsx
<Button size="icon" variant="ghost">
  <IconSearch />
</Button>
```

**As link (`asChild`):**

```tsx
import Link from "next/link";

<Button asChild variant="outline">
  <Link href="/animals">View all</Link>
</Button>;
```

**Using `buttonVariants` outside Button** (e.g. styling a plain `<a>`):

```tsx
import { buttonVariants } from "@dniproanimals/ui";

<a href="/back" className={buttonVariants({ variant: "ghost", size: "sm" })}>
  Go back
</a>;
```

---

## Rules

- ❌ Don't add a new variant in `apps/web` — extend `packages/ui/src/components/button/button.tsx` instead.
- ❌ Don't use `type="submit"` implicitly — Button defaults to `type="button"`. Set `type="submit"` explicitly on form submit buttons.
- ✅ Use `asChild` + Next.js `<Link>` for navigation buttons to keep routing client-side.
- ✅ Icon-only buttons should always have an `aria-label` for accessibility.

# `@dniproanimals/ui` — Card

## Import

```ts
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@dniproanimals/ui";
```

---

## Anatomy

Card is a compound component. All sub-components are optional — use only what the layout needs.

```
Card
├── CardHeader
│   ├── CardTitle
│   └── CardDescription
├── CardContent
└── CardFooter
```

---

## Sub-components

| Component         | Element | Default padding | Description                      |
| ----------------- | ------- | --------------- | -------------------------------- |
| `Card`            | `div`   | —               | Outer container, border + bg     |
| `CardHeader`      | `div`   | `p-5`           | Wraps title + description        |
| `CardTitle`       | `div`   | —               | Bold heading inside the header   |
| `CardDescription` | `div`   | —               | Muted subtitle inside the header |
| `CardContent`     | `div`   | `p-5 pt-0`      | Main body content                |
| `CardFooter`      | `div`   | `p-5 pt-0`      | Action row, flex layout          |

All sub-components accept `className` and forward any standard `div` HTML attributes.

---

## Usage

**Full card:**

```tsx
<Card className="w-80">
  <CardHeader>
    <CardTitle>Card title</CardTitle>
    <CardDescription>
      Short description of what this card is about.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-foreground">Main content goes here.</p>
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
```

**Header only (read-only info block):**

```tsx
<Card className="w-80">
  <CardHeader>
    <CardTitle>Header only</CardTitle>
    <CardDescription>Card without content or footer.</CardDescription>
  </CardHeader>
</Card>
```

**No header (content + footer only):**

```tsx
<Card className="w-80">
  <CardContent className="pt-5">
    <p className="text-sm text-foreground">Content without a header.</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost" size="sm">
      Action
    </Button>
  </CardFooter>
</Card>
```

> When `CardHeader` is omitted, add `pt-5` to `CardContent` to restore the top padding.

**Full width (stretches to container):**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Full width card</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**With media (e.g. animal card):**

```tsx
<Card className="w-72 overflow-hidden">
  <img
    src={animal.photo}
    alt={animal.name}
    className="h-40 w-full object-cover"
  />
  <CardHeader>
    <CardTitle>{animal.name}</CardTitle>
    <CardDescription>
      {animal.breed} · {animal.age}
    </CardDescription>
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
```

---

## Rules

- ✅ Use `overflow-hidden` on `Card` when placing media (images) inside — the rounded corners won't clip otherwise.
- ✅ Add `pt-5` to `CardContent` when `CardHeader` is absent.
- ✅ Use `gap-*` on `CardFooter` to space out action buttons.
- ❌ Don't nest cards — use a plain `div` with `bg-muted` for inner sections.
- ❌ Don't skip `CardTitle` inside `CardHeader` for accessibility — screen readers use it as the card's label.
