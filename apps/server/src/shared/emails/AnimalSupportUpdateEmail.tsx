import { Button, Img, Section, Text } from "react-email";
import { EmailLayout } from "./EmailLayout";
import type { EmailTemplateText } from "./template";
import { resolveEmailTemplate } from "./template";

interface AnimalSupportUpdateEmailProps {
  animalName: string;
  animalUrl: string;
  photos: string[];
  template: EmailTemplateText;
}

export function AnimalSupportUpdateEmail({
  animalName,
  animalUrl,
  photos,
  template,
}: AnimalSupportUpdateEmailProps) {
  const content = resolveEmailTemplate(template, { animalName });

  return (
    <EmailLayout
      preview={content.preview}
      heading={content.heading}
      footer={content.footer}
    >
      <Text className="m-0 mb-6 whitespace-pre-line text-base leading-6 text-[#0c1014]">
        {content.message}
      </Text>
      {content.secondaryMessage ? (
        <Text className="m-0 mb-6 whitespace-pre-line text-base leading-6 text-[#0c1014]">
          {content.secondaryMessage}
        </Text>
      ) : null}
      {photos.map((photo, index) => (
        <Img
          key={photo}
          src={photo}
          width="520"
          alt={`${animalName}: фото ${index + 1}`}
          className="mb-4 w-full rounded-xl"
        />
      ))}
      {content.actionLabel ? (
        <Section className="pt-3 text-center">
          <Button
            href={animalUrl}
            className="inline-block rounded-lg bg-[#5b7765] px-5 py-3 font-bold text-white no-underline"
          >
            {content.actionLabel}
          </Button>
        </Section>
      ) : null}
    </EmailLayout>
  );
}
