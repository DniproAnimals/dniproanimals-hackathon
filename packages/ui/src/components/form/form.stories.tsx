import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../button/button";
import { Input } from "../input/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

type FormValues = {
  email: string;
};

type FormStoryArgs = {
  placeholder: string;
  description: string;
  submitText: string;
  showError: boolean;
  label: string;
};

const meta: Meta<FormStoryArgs> = {
  title: "packages/ui/src/components/Form",
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    description: { control: "text" },
    submitText: { control: "text" },
    showError: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    placeholder: "you@example.com",
    description: "We will not share your email.",
    submitText: "Submit",
    showError: false,
    label: "Email",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ExampleForm({
  placeholder,
  description,
  submitText,
  showError,
  label,
}: FormStoryArgs) {
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!showError) return;
    form.setError("email", {
      type: "manual",
      message: "Email is required",
    });
  }, [showError, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => undefined)}
        className="w-80 space-y-3"
      >
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={placeholder} {...field} />
              </FormControl>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary">
          {submitText}
        </Button>
      </form>
    </Form>
  );
}

// --- Playground ---

export const Playground: Story = {
  render: (args) => <ExampleForm {...args} />,
};

// --- With error ---

export const WithError: Story = {
  args: {
    showError: true,
  },
  render: (args) => <ExampleForm {...args} />,
};
