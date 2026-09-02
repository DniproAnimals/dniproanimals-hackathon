"use client";

import { SocialLinksButtons } from "@/shared/components/Contacts/SocialLinks";
import { useFoundationQuery } from "@/shared/query-hooks";
import { IconPhoneFilled } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";

export function DonateContact() {
  const { data: foundation } = useFoundationQuery();

  return (
    <div className="text-center">
      <p className="font-semibold text-sm mb-3">Зв&apos;язатися з нами</p>
      <div className="flex gap-2 justify-center">
        <SocialLinksButtons className="mb-3" variant="subtle" size="lg" />
        {foundation?.phone && (
          <Button variant="subtle" size="lg" asChild>
            <a href={`tel:${foundation.phone.replace(/\s+/g, "")}`}>
              <IconPhoneFilled size={16} />
              {foundation.phone}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
