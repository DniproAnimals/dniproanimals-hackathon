"use client";
import {
  useFoundationQuery,
  useUpdateFoundationMutation,
} from "@/shared/query-hooks";
import type { UpdateFoundationBody } from "@dniproanimals/contracts";
import {
  IconBrandPatreon,
  IconBrandPaypal,
  IconCoffee,
  IconCreditCard,
} from "@dniproanimals/icons";
import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function DonationsPage() {
  const { data: foundation, isLoading } = useFoundationQuery();
  const updateMutation = useUpdateFoundationMutation();

  const form = useForm<Partial<UpdateFoundationBody>>({
    defaultValues: {
      monobankJarUrl: "",
      paypalEmail: "",
      patreonUrl: "",
      buyMeACoffeeUrl: "",
    },
  });

  useEffect(() => {
    if (foundation) {
      form.reset({
        monobankJarUrl: foundation.monobankJarUrl || "",
        paypalEmail: foundation.paypalEmail || "",
        patreonUrl: foundation.patreonUrl || "",
        buyMeACoffeeUrl: foundation.buyMeACoffeeUrl || "",
      });
    }
  }, [foundation, form]);

  const onSubmit = (values: Partial<UpdateFoundationBody>) => {
    updateMutation.mutate(values as UpdateFoundationBody);
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Пожертви</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <IconCreditCard size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Monobank Банка</h2>
                <p className="text-sm text-gray-medium">
                  Підключіть банку, щоб отримувати пожертви
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="monobankJarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Посилання на банку</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://send.monobank.ua/jar/..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold mb-6">Інші способи допомоги</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="paypalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBrandPaypal size={16} className="text-blue-500" />
                      PayPal Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patreonUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBrandPatreon size={16} className="text-orange-500" />
                      Patreon URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://patreon.com/..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buyMeACoffeeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconCoffee size={16} className="text-yellow-600" />
                      Buy Me a Coffee URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://buymeacoffee.com/..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Збереження..." : "Зберегти зміни"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
