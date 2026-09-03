import type {
  EmailTemplateKey,
  UpdateEmailTemplateBody,
} from "@dniproanimals/contracts";
import { db, emailTemplatesTable, eq } from "@dniproanimals/database";

const EMAIL_TEMPLATE_DEFAULTS: Record<
  EmailTemplateKey,
  UpdateEmailTemplateBody
> = {
  verification: {
    subject: "Підтвердження пошти | DniproAnimals",
    preview:
      "Підтвердьте адресу електронної пошти для облікового запису DniproAnimals",
    heading: "Останній крок",
    message:
      "Дякуємо за створення облікового запису.\nЩоб продовжити слідкувати за тваринками, будь ласка, підтвердьте адресу електронної пошти.",
    actionLabel: "Підтвердити пошту",
    secondaryMessage: "Якщо це не ви, просто проігноруйте це повідомлення.",
    footer:
      "Ми — невелика команда волонтерів, яка робить все можливе для порятунку тварин. Наш притулок завжди відкритий для тих, хто хоче навістити наших мешканців.",
  },
  "password-reset": {
    subject: "Скидання пароля | DniproAnimals",
    preview: "Створіть новий пароль для облікового запису DniproAnimals",
    heading: "Скинути пароль",
    message:
      "Хтось надіслав запит на отримання посилання для зміни пароля. Перейдіть за посиланням нижче, щоб створити новий пароль.",
    actionLabel: "Створити новий пароль",
    secondaryMessage: "Якщо це не ви, просто проігноруйте це повідомлення.",
    footer:
      "Ми — невелика команда волонтерів, яка робить все можливе для порятунку тварин. Наш притулок завжди відкритий для тих, хто хоче навістити наших мешканців.",
  },
  "adoption-applicant": {
    subject: "Ми отримали вашу заявку на прихисток {{animalName}}",
    preview: "Ми отримали вашу заявку на прихисток {{animalName}}",
    heading: "Дякуємо за вашу заявку",
    message:
      "Вітаємо, {{applicantName}}! Ми отримали вашу заявку на прихисток {{animalName}}. Дякуємо за бажання подарувати тваринці дім.",
    actionLabel: null,
    secondaryMessage:
      "Після опрацювання заявки наші волонтери зателефонують вам за номером {{phone}}, щоб уточнити деталі та домовитися про наступні кроки.\n\nБудь ласка, очікуйте на дзвінок і переконайтеся, що вказаний номер телефону доступний для зв'язку.",
    footer: "Дякуємо, що допомагаєте тваринам Дніпра.",
  },
  "adoption-admin": {
    subject: "Нова заявка на прихисток: {{animalName}}",
    preview: "Нова заявка на прихисток {{animalName}}",
    heading: "Нова заявка на прихисток",
    message: "Надійшла нова заявка на усиновлення тварини.",
    actionLabel: null,
    secondaryMessage: null,
    footer: "DniproAnimals",
  },
  "animal-support-update": {
    subject: "Нові фото від {{animalName}} — DniproAnimals",
    preview: "Нові фото від {{animalName}}",
    heading: "Новини від {{animalName}}",
    message:
      "Дякуємо, що підтримуєте {{animalName}}. Завдяки вам ми можемо піклуватися про тварину щодня. Ділимося новими фотографіями.",
    actionLabel: "Переглянути сторінку тварини",
    secondaryMessage: null,
    footer: "Дякуємо, що допомагаєте тваринам Дніпра.",
  },
};

export const emailTemplateService = {
  async get(key: EmailTemplateKey) {
    await db
      .insert(emailTemplatesTable)
      .values({ key, ...EMAIL_TEMPLATE_DEFAULTS[key] })
      .onConflictDoNothing();

    const [template] = await db
      .select()
      .from(emailTemplatesTable)
      .where(eq(emailTemplatesTable.key, key))
      .limit(1);

    return template!;
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
