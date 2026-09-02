"use client";
import {
  useFoundationQuery,
  useUpdateFoundationMutation,
} from "@/shared/query-hooks";
import type { UpdateFoundationBody } from "@dniproanimals/contracts";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandTiktok,
  IconCreditCard,
  IconMail,
  IconMapPin,
  IconPhone,
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

export default function FoundationPage() {
  const { data: foundation, isLoading } = useFoundationQuery();
  const updateMutation = useUpdateFoundationMutation();

  const form = useForm<Partial<UpdateFoundationBody>>({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      instagram: "",
      telegram: "",
      facebook: "",
      tiktokUrl: "",
      monobankJarUrl: "",
      monobankCardNumber: "",
      privatBankCardNumber: "",
      paypalEmail: "",
      patreonUrl: "",
      buyMeACoffeeUrl: "",
    },
  });

  useEffect(() => {
    if (foundation) {
      form.reset({
        name: foundation.name || "",
        description: foundation.description || "",
        address: foundation.address || "",
        phone: foundation.phone || "",
        email: foundation.email || "",
        instagram: foundation.instagram || "",
        telegram: foundation.telegram || "",
        facebook: foundation.facebook || "",
        tiktokUrl: foundation.tiktokUrl || "",
        monobankJarUrl: foundation.monobankJarUrl || "",
        monobankCardNumber: foundation.monobankCardNumber || "",
        privatBankCardNumber: foundation.privatBankCardNumber || "",
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
      <h1 className="text-2xl font-bold text-foreground">
        Налаштування притулку
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва притулку *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Притулок ДніпроAnimals"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <IconMapPin size={16} />
                    Місцезнаходження
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="м. Дніпро, вул. ..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Card className="p-6 space-y-6">
            <h2 className="text-lg font-bold">Контакти та соцмережі</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconPhone size={16} />
                      Телефон
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+380..."
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconMail size={16} />
                      Email
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
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBrandInstagram size={16} />
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
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
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBrandTelegram size={16} />
                      Telegram
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
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
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBrandFacebook size={16} />
                      Facebook
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="URL або Username"
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
                name="tiktokUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBrandTiktok size={16} />
                      TikTok
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.tiktok.com/@..."
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

          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-green-light flex items-center justify-center text-green-secondary">
                <IconCreditCard size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Платіжні дані</h2>
                <p className="text-sm text-gray-medium">
                  Посилання та реквізити, які бачать відвідувачі на сайті
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="monobankJarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconCreditCard size={16} />
                      Monobank банка
                    </FormLabel>
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

              <FormField
                control={form.control}
                name="monobankCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monobank карта</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="4441 1144 4172 7326"
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
                name="privatBankCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ПриватБанк карта</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="5168 7456 0790 6259"
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
