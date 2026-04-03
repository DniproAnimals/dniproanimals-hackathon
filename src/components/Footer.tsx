import Image from "next/image";
import { IconBrandInstagram, IconBrandFacebookFilled, IconBrandTelegram, IconHeartFilled } from "@tabler/icons-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#ced48c] mt-16 pb-16 md:pb-0">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="md:flex md:justify-between gap-10">
          {/* Left — Logo */}
          <div className="mb-6 md:mb-0 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/logo.jpg"
                alt="DniproAnimals"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="text-xl font-bold text-foreground">DniproAnimals</span>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Благодійний фонд допомоги безхатнім тваринам у Дніпрі. Понад 300 хвостиків шукають дім.
            </p>
          </div>

          {/* Right — Nav + Contacts + Donate */}
          <div className="flex gap-10 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">Навігація</p>
              <div className="space-y-2">
                <Link href="/animals" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Тварини</Link>
                <Link href="/lost" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Загублені</Link>
                <Link href="/donate" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Допомогти</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">Контакти</p>
              <div className="space-y-2">
                <a href="https://instagram.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <IconBrandInstagram size={14} />
                  Instagram
                </a>
                <a href="https://facebook.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <IconBrandFacebookFilled size={14} />
                  Facebook
                </a>
                <a href="https://t.me/itsmotherofcats" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <IconBrandTelegram size={14} />
                  Telegram
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">Допомога</p>
              <a
                href="https://send.monobank.ua/jar/dniproanimals"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-foreground/10 text-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-foreground/20 transition-colors"
              >
                <IconHeartFilled size={16} />
                Задонатити
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-4 border-t border-foreground/10 flex items-center justify-between text-xs text-foreground/40">
          <span>&copy; {new Date().getFullYear()} DniproAnimals</span>
          <span>м. Дніпро, Україна</span>
        </div>
      </div>
    </footer>
  );
}
