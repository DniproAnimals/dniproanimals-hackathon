# `@dniproanimals/ui` — Form

## Import

```ts
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from "@dniproanimals/ui";
```

---

## Overview

Form helpers are built on `react-hook-form` and provide consistent wiring for labels, descriptions, and error messages.

---

## Usage

```tsx
const form = useForm({ defaultValues: { name: "" } });

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter name" {...field} />
          </FormControl>
          <FormDescription>Visible in public profile.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>;
```

---

## Rules

- ✅ Use `FormControl` to wire `aria-*` attributes automatically.
- ✅ Keep `FormMessage` in every field to reserve error space.
- ❌ Do not use these helpers without `react-hook-form`.
