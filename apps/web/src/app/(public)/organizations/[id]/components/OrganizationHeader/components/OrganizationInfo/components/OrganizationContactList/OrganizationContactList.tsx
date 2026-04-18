import type { Organization } from "@dniproanimals/contracts";
import {
  IconCalendarFilled,
  IconMailFilled,
  IconMapPinFilled,
  IconPhoneFilled,
} from "@dniproanimals/icons";

interface OrganizationContactListProps {
  organization: Organization;
}

export function OrganizationContactList({
  organization,
}: OrganizationContactListProps) {
  return (
    <div className="divide-y divide-gray-border mb-5">
      {organization.location && (
        <div className="flex items-center gap-2.5 py-2.5">
          <IconMapPinFilled size={16} className="text-gray-400 shrink-0" />
          <span className="text-sm font-medium">Місцезнаходження</span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(organization.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-medium ml-auto hover:underline"
          >
            {organization.location}
          </a>
        </div>
      )}
      {organization.phone && (
        <div className="flex items-center gap-2.5 py-2.5">
          <IconPhoneFilled size={16} className="text-gray-400 shrink-0" />
          <span className="text-sm font-medium">Телефон</span>
          <a
            href={`tel:${organization.phone}`}
            className="text-sm text-gray-medium ml-auto hover:underline"
          >
            {organization.phone}
          </a>
        </div>
      )}
      {organization.email && (
        <div className="flex items-center gap-2.5 py-2.5">
          <IconMailFilled size={16} className="text-gray-400 shrink-0" />
          <span className="text-sm font-medium">Email</span>
          <a
            href={`mailto:${organization.email}`}
            className="text-sm text-gray-medium ml-auto hover:underline"
          >
            {organization.email}
          </a>
        </div>
      )}
      <div className="flex items-center gap-2.5 py-2.5">
        <IconCalendarFilled size={16} className="text-gray-400 shrink-0" />
        <span className="text-sm font-medium">На платформі з</span>
        <span className="text-sm text-gray-medium ml-auto">
          {new Date(organization.createdAt).toLocaleDateString("uk-UA", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
