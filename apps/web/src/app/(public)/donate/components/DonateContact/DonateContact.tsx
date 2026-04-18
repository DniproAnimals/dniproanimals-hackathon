import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconPhoneFilled,
} from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import type { ComponentType } from "react";

interface ContactLink {
  href: string;
  label: string;
  icon: ComponentType<{ size: number }>;
  external?: boolean;
}

const CONTACT_LINKS: ContactLink[] = [
  {
    href: "https://instagram.com/dniproanimals",
    label: "Instagram",
    icon: IconBrandInstagram,
    external: true,
  },
  {
    href: "https://facebook.com/dniproanimals",
    label: "Facebook",
    icon: IconBrandFacebook,
    external: true,
  },
  {
    href: "https://t.me/itsmotherofcats",
    label: "Telegram",
    icon: IconBrandTelegram,
    external: true,
  },
  {
    href: "tel:+380966601817",
    label: "+380 96 660 18 17",
    icon: IconPhoneFilled,
  },
];

export function DonateContact() {
  return (
    <div className="text-center">
      <p className="font-semibold text-sm mb-3">Зв&apos;язатися з нами</p>
      <div className="flex justify-center gap-3 flex-wrap">
        {CONTACT_LINKS.map(({ href, label, icon: Icon, external }) => (
          <Button key={href} variant="subtle" size="lg" asChild>
            <a
              href={href}
              {...(external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              <Icon size={16} />
              {label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
