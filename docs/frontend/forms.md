# Forms

`react-hook-form` + `@hookform/resolvers/zod` + `zod`, composed with the **shadcn-style `<Form>` / `<FormField>` primitives from `@dniproanimals/ui`**. Every form has four pieces:

1. A **Zod schema** in `Component/schema.ts` (sibling — not in `constants/`).
2. A **form hook** in `Component/hooks/useComponentForm.ts` that wires the schema to `useForm` plus a typed `useFormContext` wrapper.
3. **Per-field components** in `Component/components/<FieldName>/<FieldName>.tsx`, each using `<FormField>` + the matching primitive.
4. The **component itself** in `Component.tsx` that wraps everything in `<Form {...form}><form>…</form></Form>` and accepts `defaultValues` + `onSubmit` props.

The canonical reference is `apps/web/src/shared/components/OrganizationForm/`.

## Form-component contract

A form component is a controlled view over `defaultValues` and `onSubmit`. The page that uses it owns the mutation:

```tsx
interface OrganizationFormProps {
  defaultValues?: OrganizationFormValues;
  onSubmit: (values: OrganizationFormValues) => void;
  submitting?: boolean;
  submitLabel: string;
}

export function OrganizationForm({
  defaultValues = ORGANIZATION_FORM_DEFAULTS,
  onSubmit,
  submitting,
  submitLabel,
}: OrganizationFormProps) {
  const form = useOrganizationForm(defaultValues);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <OrganizationPhotoField />
        <OrganizationNameField />
        <OrganizationDescriptionField />
        <OrganizationLocationField />
        <OrganizationContactsFields />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Збереження..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
```

Saved feedback (`memory/feedback_forms_rhf_routes.md`):

- Forms accept **only** `defaultValues` + `onSubmit` (plus presentational `submitting`/`submitLabel`). No mutation logic, no router, no toast inside the form.
- Add and edit live in **separate routes** (`/dashboard/animals/add` and `/dashboard/animals/[id]/edit`). The form is the same; the page wires up the mutation.

## Schema (sibling file)

```ts
// Component/schema.ts
import { z } from "zod";

export const organizationFormSchema = z.object({
  name: z.string().min(1, "Вкажіть назву"),
  description: z.string(),
  photo: z.string(),
  location: z.string(),
  phone: z.string(),
  email: z.string(),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

export const ORGANIZATION_FORM_DEFAULTS: OrganizationFormValues = {
  name: "",
  description: "",
  photo: "",
  location: "",
  phone: "",
  email: "",
};
```

The schema is the **source of truth**. `OrganizationFormValues` comes from `z.infer`, defaults are typed against it.

If the form needs to seed from a server entity, write a small mapper in the same file:

```ts
import type { Organization } from "@dniproanimals/contracts";

export function organizationToFormValues(
  org: Organization,
): OrganizationFormValues {
  return {
    name: org.name,
    description: org.description ?? "",
    // …
  };
}
```

## Form hook (`Component/hooks/useComponentForm.ts`)

The hook wires the schema to `useForm` and exposes a **typed `useFormContext`** wrapper so deeply nested fields don't have to specify the schema generic at every call site.

```ts
// Component/hooks/useOrganizationForm.ts
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  ORGANIZATION_FORM_DEFAULTS,
  type OrganizationFormValues,
  organizationFormSchema,
} from "../schema";

export const useOrganizationForm = (
  defaultValues = ORGANIZATION_FORM_DEFAULTS,
) =>
  useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues,
  });

export const useOrganizationFormContext = () =>
  useFormContext<OrganizationFormValues>();
```

Per-field components import `useOrganizationFormContext()` instead of receiving `control`/`form` via props. Saved feedback (`memory/feedback_autonomous_subcomponents.md`): page-scoped sub-components read context directly — no `value`/`onChange` drilling.

## Per-field components

Each field is its own `Component/components/<FieldName>/` folder, exporting one component that uses `<FormField>` plus the matching primitive from `@dniproanimals/ui`.

```tsx
// Component/components/OrganizationNameField/OrganizationNameField.tsx
"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useOrganizationFormContext } from "../../hooks/useOrganizationForm";

export function OrganizationNameField() {
  const { control } = useOrganizationFormContext();
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Назва організації *</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Наприклад: Притулок «Друг»"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

The bricks from `@dniproanimals/ui`:

- `FormField` — wraps RHF's `Controller`, provides field context.
- `FormItem` — wraps the label + control + message; provides a stable `id`.
- `FormLabel` — renders `<label htmlFor>` automatically; turns red when there's an error.
- `FormControl` — wires `id`, `aria-invalid`, `aria-describedby` onto the input via Radix `<Slot>`. Spread it onto exactly one child.
- `FormMessage` — renders the Zod error message under the control.
- `FormDescription` — optional helper text below the label.

For inputs that don't expose a standard `onChange(event)` shape (custom selects, file pickers, dropdowns), wire them via `field.value` / `field.onChange`:

```tsx
<FormField
  control={control}
  name="size"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Розмір</FormLabel>
      <FormControl>
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{/* … */}</SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Note: shadcn `<Select>` uses `onValueChange`, not `onChange`.

## Submitting via a mutation (the page)

The page owns the mutation; the form is reused for both add and edit:

```tsx
// app/(dashboard)/dashboard/animals/add/page.tsx
"use client";
import { useCreateAnimalMutation } from "@/shared/query-hooks";
import { useRouter } from "next/navigation";
import {
  AnimalForm,
  animalFormValuesToBody,
  type AnimalFormValues,
} from "../components/AnimalForm";

export default function AddAnimalPage() {
  const router = useRouter();
  const createMutation = useCreateAnimalMutation({
    onSuccess: (animal) => router.push(`/animals/${animal.id}`),
  });

  return (
    <AnimalForm
      onSubmit={(values: AnimalFormValues) =>
        createMutation.mutate({
          ...animalFormValuesToBody(values),
          status: "available",
        })
      }
      submitting={createMutation.isPending}
      submitLabel="Додати тварину"
    />
  );
}
```

```tsx
// app/(dashboard)/dashboard/animals/[id]/edit/page.tsx
"use client";
import { useAnimalQuery, useUpdateAnimalMutation } from "@/shared/query-hooks";
import { use } from "react";
// …

export default function EditAnimalPage(
  props: PageProps<"/dashboard/animals/[id]/edit">,
) {
  const { id } = use(props.params);
  const numericId = Number(id);
  const router = useRouter();
  const { data: animal } = useAnimalQuery(numericId);
  const updateMutation = useUpdateAnimalMutation({
    onSuccess: (updated) => router.push(`/animals/${updated.id}`),
  });

  if (!animal) return null;

  return (
    <AnimalForm
      defaultValues={animalToFormValues(animal)}
      onSubmit={(values) =>
        updateMutation.mutate({
          id: numericId,
          body: animalFormValuesToBody(values),
        })
      }
      submitting={updateMutation.isPending}
      submitLabel="Зберегти зміни"
    />
  );
}
```

The matching `layout.tsx` (saved feedback `memory/feedback_layout_chrome_prefetch.md`) owns the back button + heading + `notFound()` for invalid params. The page is **only** the form. See [server-components.md](server-components.md#layout-chrome-pattern).

## RHF rules (high-impact)

A handful of patterns matter more than the rest. The library has many knobs; default to these.

### Configuration

- **Define `defaultValues` for every field**, even empty ones. Missing defaults make fields uncontrolled at first and break value resets.
- **Use `mode: "onSubmit"`** (the default). `onChange` mode validates on every keystroke and re-renders the form repeatedly.
- **Keep the Zod schema outside the component file** (sibling `schema.ts`) so the resolver isn't recreated each render.

### Field subscription

`watch()` re-renders the entire form on every change. When you only need one value, use `useWatch` from inside the consumer with `control` from the typed context hook:

```tsx
function Greeting() {
  const { control } = useOrganizationFormContext();
  const name = useWatch({ control, name: "name" });
  return <h2>Привіт, {name}</h2>;
}
```

### Field arrays

`useFieldArray` returns objects with a stable `id`. Use it as the React `key` — never the array index.

```tsx
const { fields, append, remove } = useFieldArray({ control, name: "items" });

return fields.map((field, index) => (
  <Row key={field.id} index={index} /> // ✅ never key={index}
));
```

### Server-side validation errors

When the API returns field-level errors, surface them with `setError`:

```ts
const onSubmit = (values: FormValues) =>
  mutate(values, {
    onError: (err) => {
      if (isFieldError(err)) form.setError(err.field, { message: err.message });
    },
  });
```

### Files / FormData

For multipart submissions, validate with `z.instanceof(File).refine(...)` and assemble `FormData` in `onSubmit`:

```ts
const onSubmit = (values: FormValues) => {
  const formData = new FormData();
  formData.append("description", values.description);
  values.files.forEach((file) => formData.append("files", file));
  uploadMutation.mutate(formData);
};
```

The `apiClient.upload.*` services accept `FormData` directly.

## What the project doesn't use

- **No raw `<Controller>`** at the call site — go through `<FormField>`.
- **No `register("name")` for fields managed by `<FormField>`** — `<FormField>` handles control wiring.
- **No `<form action={fn}>` Server Actions** in `apps/web` (yet). The mutation+router pattern above is the standard.
- **No `useActionState`** wired anywhere. If you reach for it, propose adding the pattern first.

## Quick checklist

- [ ] Schema lives in `Component/schema.ts`, type via `z.infer`.
- [ ] `useComponentForm` exports both the form hook and the typed `useFormContext` wrapper.
- [ ] Each field is a component in `Component/components/<FieldName>/`, reading context — not props.
- [ ] Form component takes `defaultValues` + `onSubmit` only.
- [ ] Mutation lives on the **page** (`/add` and `/[id]/edit` routes), not in the form.
- [ ] Submit button disabled while `submitting`.
- [ ] `defaultValues` are complete (every field has a starting value).
- [ ] Custom inputs use `field.value` / `field.onChange` (or `onValueChange` for shadcn `Select`).
- [ ] Field-array keys come from `field.id`, never the index.
