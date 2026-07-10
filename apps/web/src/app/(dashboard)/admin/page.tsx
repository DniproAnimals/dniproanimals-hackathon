"use client";

import { RequiredRole } from "@/shared/components/RequiredRole";
import {
  useContractTemplateQuery,
  useUpdateContractTemplateMutation,
} from "@/shared/query-hooks";
import type { UpdateContractTemplateBody } from "@dniproanimals/contracts";
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
  Textarea,
} from "@dniproanimals/ui";
import { useEffect } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import { AdminHeader } from "./components/AdminHeader";

const CONTRACT_TYPE = "adoption";

function ContractSectionCard({
  control,
  index,
  setValue,
  onRemove,
}: {
  control: Control<UpdateContractTemplateBody>;
  index: number;
  setValue: UseFormSetValue<UpdateContractTemplateBody>;
  onRemove: () => void;
}) {
  const paragraphs =
    useWatch({
      control,
      name: `content.sections.${index}.paragraphs` as const,
    }) ?? [];

  const updateParagraphs = (next: string[]) => {
    setValue(`content.sections.${index}.paragraphs` as const, next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="rounded-2xl border border-gray-border p-4 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <FormField
          control={control}
          name={`content.sections.${index}.title` as const}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Заголовок секції</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="ghost" onClick={onRemove}>
          Видалити
        </Button>
      </div>

      <div className="space-y-3">
        {paragraphs.map((_, paragraphIndex) => (
          <div key={paragraphIndex} className="space-y-2">
            <FormField
              control={control}
              name={
                `content.sections.${index}.paragraphs.${paragraphIndex}` as const
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Абзац</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      className="min-h-[96px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  updateParagraphs(
                    paragraphs.filter(
                      (_, currentIndex) => currentIndex !== paragraphIndex,
                    ),
                  )
                }
              >
                Видалити абзац
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => updateParagraphs([...paragraphs, ""])}
        >
          Додати абзац
        </Button>
      </div>
    </div>
  );
}

export default function ContractsChangePage() {
  const { data: template, isLoading } = useContractTemplateQuery(CONTRACT_TYPE);
  const updateMutation = useUpdateContractTemplateMutation(CONTRACT_TYPE);

  const form = useForm<UpdateContractTemplateBody>({
    defaultValues: {
      title: "",
      subtitle: "",
      content: {
        parties: { shelter: "", adopter: "" },
        sections: [],
        signatures: [],
        datePlaceholder: "Дата: ____________",
      },
    },
  });

  const sections = useFieldArray({
    control: form.control,
    name: "content.sections",
  });
  const signatures = useFieldArray({
    control: form.control,
    name: "content.signatures",
  });

  useEffect(() => {
    if (template) {
      form.reset({
        title: template.title,
        subtitle: template.subtitle ?? "",
        content: template.content,
      });
    }
  }, [form, template]);

  const onSubmit = (values: UpdateContractTemplateBody) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  return (
    <RequiredRole roles={["superadmin"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Шаблон договору
            </h1>
            <p className="text-sm text-gray-medium">
              Редагуйте структуру договору для типу {CONTRACT_TYPE}.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Назва *</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Підзаголовок</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          className="min-h-[96px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>

              <Card className="p-6 space-y-6">
                <h2 className="text-lg font-bold">Сторони</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="content.parties.shelter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Притулок</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content.parties.adopter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Усиновлювач</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              <Card className="p-6 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-bold">Секції</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      sections.append({ title: "", paragraphs: [""] })
                    }
                  >
                    Додати секцію
                  </Button>
                </div>

                <div className="space-y-4">
                  {sections.fields.length === 0 ? (
                    <p className="text-sm text-gray-medium">
                      Додайте хоча б одну секцію.
                    </p>
                  ) : null}

                  {sections.fields.map((section, sectionIndex) => (
                    <ContractSectionCard
                      key={section.id}
                      control={form.control}
                      index={sectionIndex}
                      setValue={form.setValue}
                      onRemove={() => sections.remove(sectionIndex)}
                    />
                  ))}
                </div>
              </Card>

              <Card className="p-6 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-bold">Підписи</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => signatures.append({ role: "", line: "" })}
                  >
                    Додати підпис
                  </Button>
                </div>

                <div className="space-y-4">
                  {signatures.fields.map((signature, index) => (
                    <div
                      key={signature.id}
                      className="grid gap-4 rounded-2xl border border-gray-border p-4 md:grid-cols-[1fr_1fr_auto]"
                    >
                      <FormField
                        control={form.control}
                        name={`content.signatures.${index}.role` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Роль</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`content.signatures.${index}.line` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Рядок для підпису</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => signatures.remove(index)}
                        >
                          Видалити
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="content.datePlaceholder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Плейсхолдер дати</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Збереження..." : "Зберегти"}
                  </Button>
                </div>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </RequiredRole>
  );
}
