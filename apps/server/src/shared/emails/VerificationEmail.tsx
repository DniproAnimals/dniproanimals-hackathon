import { Button, Section, Text } from "react-email";
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
      heading={content.heading}
      footer={content.footer}
    >
      <Text className="m-0 mb-6 whitespace-pre-line text-base leading-6 text-[#0c1014]">
        {content.message}
      </Text>
      {content.actionLabel ? (
        <Section className="mb-6 text-center">
          <Button
            className="inline-block rounded-lg bg-[#5b7765] px-5 py-3 font-bold text-white no-underline"
            href={verficationLink}
          >
            {content.actionLabel}
          </Button>
        </Section>
      ) : null}
      {content.secondaryMessage ? (
        <Text className="m-0 whitespace-pre-line text-sm leading-5 text-[#5b7765]">
          {content.secondaryMessage}
        </Text>
      ) : null}
    </EmailLayout>
  );
}
