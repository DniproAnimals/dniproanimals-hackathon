import { Section, Text } from "react-email";
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

  return (
    <EmailLayout
      preview={content.preview}
      heading={content.heading}
      footer={content.footer}
    >
      <Text className="m-0 mb-4 whitespace-pre-line text-base leading-6 text-[#0c1014]">
        {content.message}
      </Text>
      {content.secondaryMessage ? (
        <Section className="rounded-xl bg-[#eef0d3] px-4 py-4">
          <Text className="m-0 whitespace-pre-line text-base leading-6 text-[#0c1014]">
            {content.secondaryMessage}
          </Text>
        </Section>
      ) : null}
    </EmailLayout>
  );
}
