import {
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandTelegram,
  IconFileText,
  IconHeartFilled,
} from "@dniproanimals/icons";
import { Button, Separator } from "@dniproanimals/ui";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/animals", label: "Тварини" },
  { href: "/donate", label: "Допомогти" },
];

const socials = [
  {
    href: "https://instagram.com/dniproanimals",
    label: "Instagram",
    icon: IconBrandInstagram,
  },
  {
    href: "https://facebook.com/dniproanimals",
    label: "Facebook",
    icon: IconBrandFacebookFilled,
  },
  {
    href: "https://t.me/itsmotherofcats",
    label: "Telegram",
    icon: IconBrandTelegram,
  },
];

export function Footer() {
  return (
    <footer className="bg-primary mt-16 pb-16 md:pb-0">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="md:flex md:justify-between gap-10">
          <div className="mb-6 md:mb-0 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/logo.jpg"
                alt="DniproAnimals"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="text-xl font-bold text-foreground">
                DniproAnimals
              </span>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Благодійний фонд допомоги безхатнім тваринам у Дніпрі. Понад 300
              хвостиків шукають дім.
            </p>
          </div>

          <div className="flex gap-10 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">
                Навігація
              </p>
              <div className="space-y-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">
                Контакти
              </p>
              <div className="space-y-2">
                {socials.map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    <Icon size={14} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">
                  Документи
                </p>
                <Button
                  asChild
                  variant="soft"
                  size="md"
                  className="bg-foreground/10 text-foreground hover:bg-foreground/20"
                >
                  <Link href="/contract">
                    <IconFileText size={16} />
                    Договір
                  </Link>
                </Button>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">
                  Допомога
                </p>
                <Button
                  asChild
                  variant="soft"
                  size="md"
                  className="bg-foreground/10 text-foreground hover:bg-foreground/20"
                >
                  <a
                    href="https://send.monobank.ua/jar/dniproanimals"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconHeartFilled size={16} />
                    Задонатити
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-foreground/10 mt-8 mb-4" />
        <div className="flex items-center justify-between text-xs text-foreground/40">
          <span>&copy; {new Date().getFullYear()} DniproAnimals</span>
          <span>м. Дніпро, Україна</span>
        </div>
      </div>
    </footer>
  );
}
