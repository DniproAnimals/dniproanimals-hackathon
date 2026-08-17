"use client";
import {
  useAddBreedsMutation,
  useCreateSpeciesMutation,
  useSpeciesQuery,
} from "@/shared/query-hooks";
import { IconPlus } from "@dniproanimals/icons";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@dniproanimals/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const addSpeciesSchema = z
  .object({
    tab: z.enum(["create", "update"]),
    name: z.string(),
    selectedSpeciesId: z.string(),
    breedsText: z.string().min(1, "Вкажіть хоча б одну породу"),
  })
  .superRefine((data, ctx) => {
    if (data.tab === "create" && !data.name.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Вкажіть назву виду",
        path: ["name"],
      });
    }
    if (data.tab === "update" && !data.selectedSpeciesId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Оберіть вид тварини",
        path: ["selectedSpeciesId"],
      });
    }
  });

type AddSpeciesFormValues = z.infer<typeof addSpeciesSchema>;

export function AddSpeciesDialog() {
  const [open, setOpen] = useState(false);
  const { data: species = [] } = useSpeciesQuery();

  const form = useForm<AddSpeciesFormValues>({
    resolver: zodResolver(addSpeciesSchema),
    defaultValues: {
      tab: "create",
      name: "",
      selectedSpeciesId: "",
      breedsText: "",
    },
  });

  const handleSuccess = () => {
    setOpen(false);
    form.reset();
    window.location.reload();
  };

  const createMutation = useCreateSpeciesMutation({
    onSuccess: handleSuccess,
  });

  const addBreedsMutation = useAddBreedsMutation({
    onSuccess: handleSuccess,
  });

  const onSubmit = (values: AddSpeciesFormValues) => {
    const breeds = values.breedsText
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    if (values.tab === "create") {
      createMutation.mutate({
        name: values.name.trim(),
        breeds,
      });
    } else {
      addBreedsMutation.mutate({
        speciesId: Number(values.selectedSpeciesId),
        breeds,
      });
    }
  };

  const isPending = createMutation.isPending || addBreedsMutation.isPending;
  const activeTab = useWatch({ control: form.control, name: "tab" });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1.5 bg-white border-gray-border"
        >
          <IconPlus size={16} />
          Додати вид
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Додати вид або породи</DialogTitle>
          <DialogDescription>
            Створіть новий вид тварини або додайте нові породи до вже існуючого
            виду.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              form.setValue("tab", v as "create" | "update");
              form.clearErrors();
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="create">Новий вид</TabsTrigger>
              <TabsTrigger value="update">Існуючий вид</TabsTrigger>
            </TabsList>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="create" className="mt-0 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Назва виду *</FormLabel>
                      <FormControl>
                        <Input placeholder="Наприклад: Лисиця" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="update" className="mt-0 space-y-4">
                <FormField
                  control={form.control}
                  name="selectedSpeciesId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Оберіть вид *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger id="existing-species">
                            <SelectValue placeholder="Оберіть вид тварини" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {species.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <FormField
                control={form.control}
                name="breedsText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Породи (через кому) *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Наприклад: Руда, Сіра, Полярна"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 font-light font-sans">
                      Вкажіть породи, розділяючи їх комами. Вони будуть доступні
                      при додаванні тварини цього виду.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    form.reset();
                  }}
                  disabled={isPending}
                >
                  Скасувати
                </Button>
                <Button type="submit" variant="primary" disabled={isPending}>
                  {isPending ? "Збереження..." : "Додати"}
                </Button>
              </div>
            </form>
          </Tabs>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
