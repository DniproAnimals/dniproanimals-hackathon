# `@dniproanimals/ui` — Checkbox

## Import

```ts
import { Checkbox } from "@dniproanimals/ui";
```

---

## Props

Checkbox forwards all props from Radix `Checkbox.Root`.

| Prop              | Type                                            | Default | Description                                   |
| ----------------- | ----------------------------------------------- | ------- | --------------------------------------------- |
| `checked`         | `boolean \| "indeterminate"`                    | —       | Controlled checked state                      |
| `defaultChecked`  | `boolean`                                       | —       | Uncontrolled initial state                    |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | —       | Change handler                                |
| `disabled`        | `boolean`                                       | `false` | Disables interaction + reduces opacity        |
| `required`        | `boolean`                                       | `false` | Marks field as required for form validation   |
| `name`            | `string`                                        | —       | Form field name                               |
| `value`           | `string`                                        | —       | Value submitted with the form                 |
| `className`       | `string`                                        | —       | Merged via `cn()`, safe to pass extra classes |

---

## Usage

**Uncontrolled:**

```tsx
<Checkbox defaultChecked />
```

**Controlled:**

```tsx
const [checked, setChecked] = useState(false);

<Checkbox checked={checked} onCheckedChange={setChecked} />;
```

**With label (accessible):**

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
    I agree to the terms
  </label>
</div>
```

**Disabled:**

```tsx
<Checkbox disabled />
<Checkbox disabled defaultChecked />
```

**Inside a form with `react-hook-form`:**

```tsx
<FormField
  control={form.control},
  name="agree",
  render={({ field }) => (
    <FormItem className="flex items-center gap-2">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormLabel>I agree to the terms</FormLabel>
    </FormItem>
  )}
/>
```

---

## Rules

- ✅ Always pair with a `<label>` using `htmlFor` / `id` for accessibility.
- ✅ Use `onCheckedChange` instead of `onChange` — Radix returns `boolean | "indeterminate"`, not a native event.
- ✅ Use inside `FormField` from `@dniproanimals/ui` when part of a validated form — see `forms.md`.
- ❌ Don't use a raw `<input type="checkbox">` — Checkbox handles focus ring, checked styles, and keyboard nav correctly.
