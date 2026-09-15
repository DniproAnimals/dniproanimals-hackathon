import type {
  EmailTemplateKey,
  UpdateEmailTemplateBody,
} from "@dniproanimals/contracts";
import { db, emailTemplatesTable, eq } from "@dniproanimals/database";

export const EMAIL_TEMPLATE_DEFAULTS: Record<
  EmailTemplateKey,
  UpdateEmailTemplateBody
> = {
  verification: {
    subject: "Підтвердження пошти | DniproAnimals",
    preview:
      "Підтвердьте адресу електронної пошти для облікового запису DniproAnimals",
    content: createDocument([
      heading("Останній крок"),
      paragraph(
        "Дякуємо за створення облікового запису. Щоб продовжити слідкувати за тваринками, будь ласка, підтвердьте адресу електронної пошти.",
      ),
      action("Підтвердити пошту"),
      paragraph("Якщо це не ви, просто проігноруйте це повідомлення."),
      paragraph(
        "Ми — невелика команда волонтерів, яка робить все можливе для порятунку тварин. Наш притулок завжди відкритий для тих, хто хоче навістити наших мешканців.",
      ),
    ]),
  },
  "password-reset": {
    subject: "Скидання пароля | DniproAnimals",
    preview: "Створіть новий пароль для облікового запису DniproAnimals",
    content: createDocument([
      heading("Скинути пароль"),
      paragraph(
        "Хтось надіслав запит на отримання посилання для зміни пароля. Перейдіть за посиланням нижче, щоб створити новий пароль.",
      ),
      action("Створити новий пароль"),
      paragraph("Якщо це не ви, просто проігноруйте це повідомлення."),
      paragraph(
        "Ми — невелика команда волонтерів, яка робить все можливе для порятунку тварин. Наш притулок завжди відкритий для тих, хто хоче навістити наших мешканців.",
      ),
    ]),
  },
  "adoption-applicant": {
    subject: "Ми отримали вашу заявку на прихисток {{animalName}}",
    preview: "Ми отримали вашу заявку на прихисток {{animalName}}",
    content: createDocument([
      heading("Дякуємо за вашу заявку"),
      paragraph(
        "Вітаємо, {{applicantName}}! Ми отримали вашу заявку на прихисток {{animalName}}. Дякуємо за бажання подарувати тваринці дім.",
      ),
      quote(
        "Після опрацювання заявки наші волонтери зателефонують вам за номером {{phone}}, щоб уточнити деталі та домовитися про наступні кроки.",
      ),
      paragraph(
        "Будь ласка, очікуйте на дзвінок і переконайтеся, що вказаний номер телефону доступний для зв'язку.",
      ),
      paragraph("Дякуємо, що допомагаєте тваринам Дніпра."),
    ]),
  },
  "adoption-admin": {
    subject: "Нова заявка на прихисток: {{animalName}}",
    preview: "Нова заявка на прихисток {{animalName}}",
    content: createDocument([
      heading("Нова заявка на прихисток"),
      paragraph("Надійшла нова заявка на усиновлення тварини."),
      paragraph("DniproAnimals"),
    ]),
  },
  "animal-support-update": {
    subject: "Нові фото від {{animalName}} — DniproAnimals",
    preview: "Нові фото від {{animalName}}",
    content: createDocument([
      heading("Новини від {{animalName}}"),
      paragraph(
        "Дякуємо, що підтримуєте {{animalName}}. Завдяки вам ми можемо піклуватися про тварину щодня. Ділимося новими фотографіями.",
      ),
      action("Переглянути сторінку тварини"),
      paragraph("Дякуємо, що допомагаєте тваринам Дніпра."),
    ]),
  },
};

type EmailContentNode = {
  type: "heading" | "paragraph" | "blockquote" | "emailAction";
  attrs?: { level: number };
  content: Array<EmailContentNode | { type: "text"; text: string }>;
};

function heading(text: string): EmailContentNode {
  return {
    type: "heading",
    attrs: { level: 2 },
    content: [{ type: "text", text }],
  };
}

function paragraph(text: string): EmailContentNode {
  return { type: "paragraph", content: [{ type: "text", text }] };
}

function quote(text: string): EmailContentNode {
  return { type: "blockquote", content: [paragraph(text)] };
}

function action(text: string): EmailContentNode {
  return { type: "emailAction", content: [{ type: "text", text }] };
}

function createDocument(content: EmailContentNode[]) {
  return JSON.stringify({ type: "doc", content });
}

export const emailTemplateService = {
  async get(key: EmailTemplateKey) {
    await db
      .insert(emailTemplatesTable)
      .values({
        key,
        ...EMAIL_TEMPLATE_DEFAULTS[key],
        heading: "",
        message: "",
        actionLabel: null,
        footer: "",
      })
      .onConflictDoNothing();

    const [template] = await db
      .select()
      .from(emailTemplatesTable)
      .where(eq(emailTemplatesTable.key, key))
      .limit(1);

    if (!template) throw new Error(`Email template not found: ${key}`);
    if (template.content) return { ...template, content: template.content };

    const defaults = EMAIL_TEMPLATE_DEFAULTS[key];
    const [updated] = await db
      .update(emailTemplatesTable)
      .set({ ...defaults, updatedAt: new Date() })
      .where(eq(emailTemplatesTable.id, template.id))
      .returning();

    return { ...updated!, content: defaults.content };
  },

  async list() {
    return Promise.all(
      Object.keys(EMAIL_TEMPLATE_DEFAULTS).map((key) =>
        this.get(key as EmailTemplateKey),
      ),
    );
  },

  async update(
    key: EmailTemplateKey,
    body: UpdateEmailTemplateBody,
    updatedBy: number,
  ) {
    await this.get(key);
    await db
      .update(emailTemplatesTable)
      .set({ ...body, updatedBy, updatedAt: new Date() })
      .where(eq(emailTemplatesTable.key, key));
  },
};
