"use client";

import { RequiredRole } from "@/shared/components/RequiredRole";
import {
  useEmailTemplatesQuery,
  useUpdateEmailTemplateMutation,
} from "@/shared/query-hooks";
import {
  EMAIL_TEMPLATE_KEYS,
  type EmailTemplateKey,
  type UpdateEmailTemplateBody,
} from "@dniproanimals/contracts";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@dniproanimals/ui";
import { useState } from "react";

const TEMPLATE_META: Record<
  EmailTemplateKey,
  {
    label: string;
    description: string;
    placeholders: string[];
    hasAction: boolean;
  }
> = {
  verification: {
    label: "Підтвердження пошти",
    description: "Надсилається після створення облікового запису.",
    placeholders: [],
    hasAction: true,
  },
  "password-reset": {
    label: "Скидання пароля",
    description: "Надсилається за запитом на відновлення пароля.",
    placeholders: [],
    hasAction: true,
  },
  "adoption-applicant": {
    label: "Заявнику на усиновлення",
    description: "Підтверджує отримання заявки та повідомляє про дзвінок.",
    placeholders: ["{{applicantName}}", "{{animalName}}", "{{phone}}"],
    hasAction: false,
  },
  "adoption-admin": {
    label: "Команді про заявку",
    description: "Надсилається адміністраторам після нової заявки.",
    placeholders: ["{{animalName}}"],
    hasAction: false,
  },
  "animal-support-update": {
    label: "Новини для підтримувачів",
    description: "Надсилається разом з новими фото тварини.",
    placeholders: ["{{animalName}}"],
    hasAction: true,
  },
};

function toDraft(template: UpdateEmailTemplateBody): UpdateEmailTemplateBody {
  return { ...template };
}

export default function EmailTemplatesPage() {
  const [selectedKey, setSelectedKey] = useState<EmailTemplateKey>(
    EMAIL_TEMPLATE_KEYS[0],
  );
  const [drafts, setDrafts] = useState<
    Partial<Record<EmailTemplateKey, UpdateEmailTemplateBody>>
  >({});
  const { data: templates, isLoading, error } = useEmailTemplatesQuery();
  const updateTemplate = useUpdateEmailTemplateMutation();
  const template = templates?.find((item) => item.key === selectedKey);
  const meta = TEMPLATE_META[selectedKey];

  if (isLoading) return <p>Завантаження шаблонів...</p>;
  if (error) return <p role="alert">Не вдалося завантажити шаблони.</p>;
  if (!template) return null;

  const draft = drafts[selectedKey] ?? toDraft(template);

  const updateDraft = <K extends keyof UpdateEmailTemplateBody>(
    field: K,
    value: UpdateEmailTemplateBody[K],
  ) => {
    setDrafts((current) => ({
      ...current,
      [selectedKey]: {
        ...(current[selectedKey] ?? toDraft(template)),
        [field]: value,
      },
    }));
  };

  return (
    <RequiredRole roles={["superadmin"]}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Шаблони листів</h1>
          <p className="mt-1 text-sm text-gray-medium">
            Змінюйте текст листів. Дизайн, кнопки та дані заявок залишаються
            незмінними.
          </p>
        </div>

        <Tabs
          value={selectedKey}
          onValueChange={(value) => setSelectedKey(value as EmailTemplateKey)}
        >
          <TabsList className="max-w-full overflow-x-auto">
            {EMAIL_TEMPLATE_KEYS.map((key) => (
              <TabsTrigger key={key} value={key}>
                {TEMPLATE_META[key].label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedKey}>
            <Card>
              <CardHeader>
                <CardTitle>{meta.label}</CardTitle>
                <CardDescription>{meta.description}</CardDescription>
                {meta.placeholders.length > 0 ? (
                  <CardDescription>
                    Доступні змінні: {meta.placeholders.join(", ")}
                  </CardDescription>
                ) : null}
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Тема листа
                  <Input
                    value={draft.subject}
                    onChange={(event) =>
                      updateDraft("subject", event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Попередній перегляд
                  <Input
                    value={draft.preview}
                    onChange={(event) =>
                      updateDraft("preview", event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Заголовок
                  <Input
                    value={draft.heading}
                    onChange={(event) =>
                      updateDraft("heading", event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Основний текст
                  <Textarea
                    value={draft.message}
                    onChange={(event) =>
                      updateDraft("message", event.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Додатковий текст
                  <Textarea
                    value={draft.secondaryMessage ?? ""}
                    placeholder="Необов'язковий текст"
                    onChange={(event) =>
                      updateDraft(
                        "secondaryMessage",
                        event.target.value || null,
                      )
                    }
                  />
                </label>
                {meta.hasAction ? (
                  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                    Текст кнопки
                    <Input
                      value={draft.actionLabel ?? ""}
                      onChange={(event) =>
                        updateDraft("actionLabel", event.target.value || null)
                      }
                    />
                  </label>
                ) : null}
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Текст у підвалі
                  <Textarea
                    value={draft.footer}
                    onChange={(event) =>
                      updateDraft("footer", event.target.value)
                    }
                  />
                </label>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  disabled={updateTemplate.isPending}
                  onClick={() => {
                    updateTemplate.mutate(
                      { key: selectedKey, body: draft },
                      {
                        onSuccess: () => {
                          setDrafts((current) => {
                            const remainingDrafts = { ...current };
                            delete remainingDrafts[selectedKey];
                            return remainingDrafts;
                          });
                        },
                      },
                    );
                  }}
                >
                  {updateTemplate.isPending ? "Збереження..." : "Зберегти"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequiredRole>
  );
}
