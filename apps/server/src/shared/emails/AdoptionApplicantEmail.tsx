import { EmailLayout } from "./EmailLayout";
import type { EmailTemplateText } from "./template";
import { resolveEmailTemplate } from "./template";

interface AdoptionApplicantEmailProps {
  applicantName: string;
  animalName: string;
  phone: string;
  template: EmailTemplateText;
}

export function AdoptionApplicantEmail({
  applicantName,
  animalName,
  phone,
  template,
}: AdoptionApplicantEmailProps) {
  const content = resolveEmailTemplate(template, {
    applicantName,
    animalName,
    phone,
  });

  return <EmailLayout preview={content.preview} content={content.content} />;
}
