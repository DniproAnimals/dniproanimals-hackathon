"use client";

import { useFoundationQuery } from "@/shared/query-hooks";
import type { Foundation } from "@dniproanimals/contracts";
import {
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandTiktok,
} from "@dniproanimals/icons";
import { Button, type ButtonProps } from "@dniproanimals/ui";
import React from "react";

type SocialField = "instagram" | "telegram" | "facebook" | "tiktokUrl";

type SocialLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }> | React.ReactNode;
  bgClass: string;
  external?: boolean;
};

const SOCIAL_LINKS: Array<{
  field: SocialField;
  label: string;
  icon: React.ComponentType<{ size?: number }> | React.ReactNode;
  bgClass: string;
}> = [
  {
    field: "instagram",
    label: "Instagram",
    icon: IconBrandInstagram,
    bgClass:
      "bg-linear-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white",
  },
  {
    field: "telegram",
    label: "Telegram",
    icon: IconBrandTelegram,
    bgClass: "bg-linear-to-br from-[#0088cc] to-[#0088cc] text-white",
  },
  {
    field: "facebook",
    label: "Facebook",
    icon: IconBrandFacebookFilled,
    bgClass: "bg-linear-to-br from-[#1877F2] to-[#1877F2] text-white",
  },
  {
    field: "tiktokUrl",
    label: "TikTok",
    icon: IconBrandTiktok,
    bgClass: "bg-linear-to-br from-[#000000] to-[#000000] text-white",
  },
];

function renderSocialIcon(
  icon: SocialLink["icon"],
  size: number,
): React.ReactNode {
  if (React.isValidElement(icon)) {
    return icon;
  }

  if (
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null)
  ) {
    return React.createElement(icon as React.ElementType, { size });
  }

  return icon;
}

function buildSocialHref(field: SocialField, value: string): string | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  const handle = trimmedValue.replace(/^@/, "");

  switch (field) {
    case "instagram":
      return `https://instagram.com/${handle}`;
    case "telegram":
      return `https://t.me/${handle}`;
    case "facebook":
      return `https://facebook.com/${handle}`;
    case "tiktokUrl":
      return `https://www.tiktok.com/@${handle}`;
  }
}

function getSocialLinks(foundation?: Foundation | null): SocialLink[] {
  return SOCIAL_LINKS.flatMap((link) => {
    const value = foundation?.[link.field];
    if (!value) {
      return [];
    }

    const href = buildSocialHref(link.field, value);
    if (!href) {
      return [];
    }

    return [
      {
        href,
        label: link.label,
        icon: link.icon,
        bgClass: link.bgClass,
        external: true,
      },
    ];
  });
}

export function SocialLinksPills({ className }: { className?: string }) {
  const { data: foundation } = useFoundationQuery();
  const links = getSocialLinks(foundation);

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
        {links.map((link) => (
          <Button
            key={link.label}
            asChild
            variant="secondary"
            size="lg"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-md ${link.bgClass}`}
          >
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {renderSocialIcon(link.icon, 20)}
              {link.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function SocialLinksList({ className }: { className?: string }) {
  const { data: foundation } = useFoundationQuery();
  const links = getSocialLinks(foundation);

  return (
    <div className={className}>
      <div className="space-y-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            {renderSocialIcon(link.icon, 14)}
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function SocialLinksIcons({ className }: { className?: string }) {
  const { data: foundation } = useFoundationQuery();
  const links = getSocialLinks(foundation);

  return (
    <div className={className}>
      <div className="flex gap-3 mt-4 justify-center">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="text-gray-400 hover:text-foreground transition-colors"
          >
            {renderSocialIcon(link.icon, 20)}
          </a>
        ))}
      </div>
    </div>
  );
}

export function SocialLinksButtons({
  className,
  variant = "subtle",
  size = "lg",
}: {
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  const { data: foundation } = useFoundationQuery();
  const links = getSocialLinks(foundation);

  return (
    <div className={`flex justify-center gap-3 flex-wrap ${className || ""}`}>
      {links.map((link) => (
        <Button key={link.href} variant={variant} size={size} asChild>
          <a
            href={link.href}
            {...(link.external && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
          >
            {renderSocialIcon(link.icon, 16)}
            {link.label}
          </a>
        </Button>
      ))}
    </div>
  );
}
