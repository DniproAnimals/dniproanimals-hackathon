# `@dniproanimals/ui` — Tabs

## Import

```ts
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@dniproanimals/ui";
```

---

## Usage

```tsx
<Tabs defaultValue="details">
  <TabsList>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="history">History</TabsTrigger>
  </TabsList>
  <TabsContent value="details">Details content</TabsContent>
  <TabsContent value="history">History content</TabsContent>
</Tabs>
```

---

## Rules

- ✅ Keep tab labels short (1–2 words).
- ✅ Use `defaultValue` for initial selection.
- ❌ Do not load heavy content in every tab if not needed.
