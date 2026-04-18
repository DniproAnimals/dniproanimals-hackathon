import type { Volunteer } from "@dniproanimals/contracts";
import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconMailFilled,
  IconPhoneFilled,
} from "@dniproanimals/icons";

export function VolunteerContactList({ volunteer }: { volunteer: Volunteer }) {
  const hasAny =
    volunteer.phone ||
    volunteer.email ||
    volunteer.instagram ||
    volunteer.telegram;
  if (!hasAny) return null;

  return (
    <div className="space-y-2 mb-4">
      {volunteer.phone && (
        <div className="flex items-center gap-2.5 text-sm">
          <IconPhoneFilled size={14} className="text-gray-medium" />
          <a href={`tel:${volunteer.phone}`} className="hover:underline">
            {volunteer.phone}
          </a>
        </div>
      )}
      {volunteer.email && (
        <div className="flex items-center gap-2.5 text-sm">
          <IconMailFilled size={14} className="text-gray-medium" />
          <a href={`mailto:${volunteer.email}`} className="hover:underline">
            {volunteer.email}
          </a>
        </div>
      )}
      {volunteer.instagram && (
        <div className="flex items-center gap-2.5 text-sm">
          <IconBrandInstagram size={14} className="text-gray-medium" />
          <span>@{volunteer.instagram}</span>
        </div>
      )}
      {volunteer.telegram && (
        <div className="flex items-center gap-2.5 text-sm">
          <IconBrandTelegram size={14} className="text-gray-medium" />
          <span>@{volunteer.telegram}</span>
        </div>
      )}
    </div>
  );
}
