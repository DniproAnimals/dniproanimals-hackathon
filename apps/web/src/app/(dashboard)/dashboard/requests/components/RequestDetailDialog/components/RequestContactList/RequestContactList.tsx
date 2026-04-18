import type { AdoptionRequestWithAnimal } from "@dniproanimals/contracts";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconMailFilled,
  IconMapPinFilled,
  IconPhoneFilled,
} from "@dniproanimals/icons";

interface RequestContactListProps {
  request: AdoptionRequestWithAnimal;
}

export function RequestContactList({ request }: RequestContactListProps) {
  return (
    <div className="space-y-2.5 mb-5">
      <div className="flex items-center gap-2.5 text-sm">
        <IconPhoneFilled size={16} className="text-gray-medium" />
        <a
          href={`tel:${request.phone}`}
          className="text-foreground hover:underline"
        >
          {request.phone}
        </a>
      </div>
      <div className="flex items-center gap-2.5 text-sm">
        <IconMailFilled size={16} className="text-gray-medium" />
        <a
          href={`mailto:${request.email}`}
          className="text-foreground hover:underline"
        >
          {request.email}
        </a>
      </div>
      {request.location && (
        <div className="flex items-center gap-2.5 text-sm">
          <IconMapPinFilled size={16} className="text-gray-medium" />
          <span>{request.location}</span>
        </div>
      )}
      {request.instagram && (
        <div className="flex items-center gap-2.5 text-sm">
          <IconBrandInstagram size={16} className="text-gray-medium" />
          <span>@{request.instagram}</span>
        </div>
      )}
      {request.telegram && (
        <div className="flex items-center gap-2.5 text-sm">
          <IconBrandTelegram size={16} className="text-gray-medium" />
          <span>@{request.telegram}</span>
        </div>
      )}
      {request.facebook && (
        <div className="flex items-center gap-2.5 text-sm">
          <IconBrandFacebook size={16} className="text-gray-medium" />
          <span>{request.facebook}</span>
        </div>
      )}
    </div>
  );
}
