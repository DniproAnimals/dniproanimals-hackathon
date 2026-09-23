import { EmailLayout } from "./EmailLayout";
import type { EmailTemplateText } from "./template";
import { resolveEmailTemplate } from "./template";

interface AnimalSupportThankYouEmailProps {
  supporterName: string;
  animalName: string;
  supportType: string;
  phone: string;
  animalUrl: string;
  template: EmailTemplateText;
}

export function AnimalSupportThankYouEmail({
  supporterName,
  animalName,
  supportType,
  phone,
  animalUrl,
  template,
}: AnimalSupportThankYouEmailProps) {
  const content = resolveEmailTemplate(template, {
    supporterName,
    animalName,
    supportType,
    phone,
  });

  return (
    <EmailLayout
      preview={content.preview}
      content={content.content}
      actionUrl={animalUrl}
    />
  );
}
