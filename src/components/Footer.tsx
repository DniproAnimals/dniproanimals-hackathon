import Image from "next/image";

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
                <a href="/" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Тварини</a>
                <a href="/lost" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Загублені</a>
                <a href="/donate" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Допомогти</a>
                <a href="/organizations/create" className="block text-sm text-foreground/70 hover:text-foreground transition-colors">Створити організацію</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">Контакти</p>
              <div className="space-y-2">
                <a href="https://instagram.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  Instagram
                </a>
                <a href="https://facebook.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  Facebook
                </a>
                <a href="https://t.me/itsmotherofcats" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
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
