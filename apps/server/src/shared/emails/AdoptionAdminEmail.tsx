import type { CreateAdoptionBody } from "@dniproanimals/contracts";
import { Section, Text } from "react-email";
import { EmailLayout } from "./EmailLayout";
import type { EmailTemplateText } from "./template";
import { resolveEmailTemplate } from "./template";

interface AdoptionAdminEmailProps {
  body: CreateAdoptionBody;
  animalName: string;
  date?: Date;
  template: EmailTemplateText;
}

export function AdoptionAdminEmail({
  body,
  animalName,
  date = new Date(),
  template,
}: AdoptionAdminEmailProps) {
  const content = resolveEmailTemplate(template, { animalName });
  const formattedDate =
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const hasAdditionalContacts =
    body.location || body.telegram || body.instagram || body.facebook;

  return (
    <EmailLayout preview={content.preview} content={content.content}>
      <Section className="mb-6 rounded-xl bg-[#eef0d3] px-4 py-4">
        <Text className="m-0 text-base leading-7 text-[#0c1014]">
          <strong>Ім&apos;я тварини:</strong> {animalName}
          <br />
          <strong>ПІБ заявника:</strong> {body.name}
          <br />
          <strong>Електронна пошта:</strong> {body.email}
          <br />
          <strong>Номер телефону:</strong> {body.phone}
          <br />
          <strong>Дата подання заявки:</strong> {formattedDate}
        </Text>
      </Section>
      {body.message ? (
        <Section className="mb-4">
          <Text className="m-0 mb-1 text-base font-bold text-[#0c1014]">
            Повідомлення заявника:
          </Text>
          <Text className="m-0 whitespace-pre-line text-base leading-6 text-[#0c1014]">
            {body.message}
          </Text>
        </Section>
      ) : null}
      {hasAdditionalContacts ? (
        <Section>
          <Text className="m-0 mb-1 text-base font-bold text-[#0c1014]">
            Додаткові контакти:
          </Text>
          <Text className="m-0 whitespace-pre-line text-base leading-6 text-[#0c1014]">
            {body.location && `Локація: ${body.location}\n`}
            {body.telegram && `Telegram: ${body.telegram}\n`}
            {body.instagram && `Instagram: ${body.instagram}\n`}
            {body.facebook && `Facebook: ${body.facebook}`}
          </Text>
        </Section>
      ) : null}
    </EmailLayout>
  );
}
