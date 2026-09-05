import { Img } from "react-email";
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
      content={content.content}
      actionUrl={animalUrl}
    >
      {photos.map((photo, index) => (
        <Img
          key={photo}
          src={photo}
          width="520"
          alt={`${animalName}: фото ${index + 1}`}
          className="mb-4 w-full rounded-xl"
        />
      ))}
    </EmailLayout>
  );
}
