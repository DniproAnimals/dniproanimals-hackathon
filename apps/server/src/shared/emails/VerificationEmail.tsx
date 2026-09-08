import { EmailLayout } from "./EmailLayout";
import type { EmailTemplateText } from "./template";
import { resolveEmailTemplate } from "./template";

interface VerificationEmailProps {
  verficationLink: string;
  template: EmailTemplateText;
}

export function VerificationEmail({
  verficationLink,
  template,
}: VerificationEmailProps) {
  const content = resolveEmailTemplate(template);

  return (
    <EmailLayout
      preview={content.preview}
      content={content.content}
      actionUrl={verficationLink}
    />
  );
}
