import { Section, Text } from "react-email";
import { EmailLayout } from "./EmailLayout";
import type { EmailTemplateText } from "./template";
import { resolveEmailTemplate } from "./template";

interface AnimalSupportAdminEmailProps {
  supporterName: string;
  supporterEmail: string;
  animalName: string;
  supportType: string;
  phone: string;
  dashboardUrl: string;
  template: EmailTemplateText;
}

export function AnimalSupportAdminEmail({
  supporterName,
  supporterEmail,
  animalName,
  supportType,
  phone,
  dashboardUrl,
  template,
}: AnimalSupportAdminEmailProps) {
  const content = resolveEmailTemplate(template, {
    supporterName,
    email: supporterEmail,
    animalName,
    supportType,
    phone,
  });

  return (
    <EmailLayout
      preview={content.preview}
      content={content.content}
      actionUrl={dashboardUrl}
    >
      <Section className="rounded-xl bg-[#eef0d3] px-4 py-4">
        <Text className="m-0 text-base leading-7 text-[#0c1014]">
          <strong>Тварина:</strong> {animalName}
          <br />
          <strong>Користувач:</strong> {supporterName}
          <br />
          <strong>Email:</strong> {supporterEmail}
          <br />
          <strong>Телефон:</strong> {phone}
          <br />
          <strong>Тип підтримки:</strong> {supportType}
        </Text>
      </Section>
    </EmailLayout>
  );
}
