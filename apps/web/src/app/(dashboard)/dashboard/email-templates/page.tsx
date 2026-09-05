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
} from "@dniproanimals/ui";
import { useState } from "react";
import { EmailTextEditor } from "./EmailTextEditor";

const TEMPLATE_META: Record<
  EmailTemplateKey,
  {
    label: string;
    description: string;
    placeholders: Array<{ token: string; description: string }>;
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
    placeholders: [
      { token: "{{applicantName}}", description: "Ім'я заявника" },
      { token: "{{animalName}}", description: "Ім'я тварини" },
      { token: "{{phone}}", description: "Телефон заявника" },
    ],
    hasAction: false,
  },
  "adoption-admin": {
    label: "Команді про заявку",
    description: "Надсилається адміністраторам після нової заявки.",
    placeholders: [{ token: "{{animalName}}", description: "Ім'я тварини" }],
    hasAction: false,
  },
  "animal-support-update": {
    label: "Новини для підтримувачів",
    description: "Надсилається разом з новими фото тварини.",
    placeholders: [{ token: "{{animalName}}", description: "Ім'я тварини" }],
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
  const [savedTemplateKey, setSavedTemplateKey] =
    useState<EmailTemplateKey | null>(null);
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
    setSavedTemplateKey(null);
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
            Відредагуйте весь текст листа в одному composer. Дані заявок та
            посилання кнопок залишаються незмінними.
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
                  <div className="flex flex-col gap-1 text-sm text-gray-medium">
                    <p>Доступні змінні:</p>
                    {meta.placeholders.map((placeholder) => (
                      <p key={placeholder.token}>
                        <code className="font-medium text-foreground">
                          {placeholder.token}
                        </code>{" "}
                        - {placeholder.description}
                      </p>
                    ))}
                  </div>
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
                <div className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Текст листа
                  <EmailTextEditor
                    key={selectedKey}
                    value={draft.content}
                    hasAction={meta.hasAction}
                    onChange={(value) => updateDraft("content", value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                {savedTemplateKey === selectedKey ? (
                  <p role="status" className="mr-auto text-sm text-success">
                    Зміни збережено
                  </p>
                ) : null}
                <Button
                  disabled={updateTemplate.isPending}
                  onClick={() => {
                    updateTemplate.mutate(
                      { key: selectedKey, body: draft },
                      {
                        onSuccess: () => {
                          setSavedTemplateKey(selectedKey);
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
