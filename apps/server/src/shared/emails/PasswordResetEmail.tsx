import { EmailLayout } from "./EmailLayout";
import type { EmailTemplateText } from "./template";
import { resolveEmailTemplate } from "./template";

interface PasswordResetEmailProps {
  resetLink: string;
  template: EmailTemplateText;
}

export function PasswordResetEmail({
  resetLink,
  template,
}: PasswordResetEmailProps) {
  const content = resolveEmailTemplate(template);

  return (
    <EmailLayout
      preview={content.preview}
      content={content.content}
      actionUrl={resetLink}
    />
  );
}
