import type { Animal } from "@dniproanimals/contracts";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUser,
} from "@dniproanimals/icons";
import { AnimalContactRow } from "./components/AnimalContactRow";

interface AnimalContactsProps {
  animal: Animal;
}

const ICON_CLS = "text-gray-400 shrink-0";

export function AnimalContacts({ animal }: AnimalContactsProps) {
  const hasAny =
    animal.contactName ||
    animal.contactPhone ||
    animal.contactEmail ||
    animal.contactInstagram ||
    animal.contactTelegram ||
    animal.contactFacebook ||
    animal.contactLocation;

  if (!hasAny) return null;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold mb-3">Контакти</h2>
      <div className="space-y-2.5">
        {animal.contactName && (
          <AnimalContactRow icon={<IconUser size={16} className={ICON_CLS} />}>
            <span className="text-foreground font-medium">
              {animal.contactName}
            </span>
          </AnimalContactRow>
        )}
        {animal.contactPhone && (
          <AnimalContactRow icon={<IconPhone size={16} className={ICON_CLS} />}>
            <a
              href={`tel:${animal.contactPhone}`}
              className="text-foreground hover:underline"
            >
              {animal.contactPhone}
            </a>
          </AnimalContactRow>
        )}
        {animal.contactEmail && (
          <AnimalContactRow icon={<IconMail size={16} className={ICON_CLS} />}>
            <a
              href={`mailto:${animal.contactEmail}`}
              className="text-foreground hover:underline"
            >
              {animal.contactEmail}
            </a>
          </AnimalContactRow>
        )}
        {animal.contactInstagram && (
          <AnimalContactRow
            icon={<IconBrandInstagram size={16} className={ICON_CLS} />}
          >
            <a
              href={`https://instagram.com/${animal.contactInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              @{animal.contactInstagram}
            </a>
          </AnimalContactRow>
        )}
        {animal.contactTelegram && (
          <AnimalContactRow
            icon={<IconBrandTelegram size={16} className={ICON_CLS} />}
          >
            <a
              href={`https://t.me/${animal.contactTelegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              @{animal.contactTelegram}
            </a>
          </AnimalContactRow>
        )}
        {animal.contactFacebook && (
          <AnimalContactRow
            icon={<IconBrandFacebook size={16} className={ICON_CLS} />}
          >
            <a
              href={`https://facebook.com/${animal.contactFacebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              {animal.contactFacebook}
            </a>
          </AnimalContactRow>
        )}
        {animal.contactLocation && (
          <div className="pt-1">
            <AnimalContactRow
              icon={<IconMapPin size={16} className={ICON_CLS} />}
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(animal.contactLocation)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                {animal.contactLocation}
              </a>
            </AnimalContactRow>
          </div>
        )}
      </div>
    </div>
  );
}
