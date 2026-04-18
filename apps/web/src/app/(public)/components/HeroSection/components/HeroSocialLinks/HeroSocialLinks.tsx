// TODO: social URLs should move server-side (admin-editable config).
// See AGENTS.md §7.2.

type SocialLink = {
  href: string;
  label: string;
  bgClass: string;
  icon: React.ReactNode;
};

const INSTAGRAM_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TELEGRAM_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const FACEBOOK_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const TIKTOK_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.95-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.37-3.4-5.74.04-2.18 1.34-4.14 3.26-5.11 1.25-.66 2.7-.91 4.11-.83V15c-.86-.03-1.73.18-2.48.64-.84.5-1.4 1.4-1.46 2.37-.05 1.05.47 2.05 1.33 2.6.93.58 2.11.66 3.12.28 1.18-.45 1.97-1.64 2.02-2.93.02-3.19.01-6.38.01-9.56 0-2.8-.02-5.61.02-8.42z" />
  </svg>
);

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://instagram.com/dniproanimals",
    label: "Instagram",
    bgClass:
      "bg-linear-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white",
    icon: INSTAGRAM_ICON,
  },
  {
    href: "https://t.me/itsmotherofcats",
    label: "Telegram",
    bgClass: "bg-[#0088cc] text-white",
    icon: TELEGRAM_ICON,
  },
  {
    href: "https://facebook.com/dniproanimals",
    label: "Facebook",
    bgClass: "bg-[#1877F2] text-white",
    icon: FACEBOOK_ICON,
  },
  {
    href: "#",
    label: "TikTok",
    bgClass: "bg-black text-white",
    icon: TIKTOK_ICON,
  },
];

export function HeroSocialLinks() {
  return (
    <div className="mb-10">
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
        Слідкуйте за життям хвостиків:
      </p>
      <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-md ${link.bgClass}`}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
