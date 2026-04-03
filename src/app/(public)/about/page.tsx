import Image from "next/image";
import Link from "next/link";
import InstagramFeed from "@/components/InstagramFeed";

export default function AboutPage() {
  return (
    <div className="pb-24 md:pb-0">
      {/* Hero — full bleed, bold */}
      <div className="relative bg-foreground text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/uploads/cat1_1.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-8 md:px-12 py-20 md:py-32">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-4 max-w-3xl">
            <span className="text-[#ced48c]">Dnipro</span>Animals
          </h1>
          <p className="text-lg md:text-2xl text-white/70 max-w-xl mb-2 leading-snug font-medium">
            Рятуємо тих, хто не може попросити про допомогу
          </p>
          <p className="text-sm md:text-base text-white/40 max-w-lg mb-8 leading-relaxed">
            Благодійний фонд · м. Дніпро · Понад 300 тварин у притулку · З 2015 року
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/" className="bg-[#ced48c] text-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#b8be72] transition-colors">
              Знайти друга
            </Link>
            <Link href="/donate" className="bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors border border-white/10">
              Допомогти
            </Link>
          </div>
        </div>
      </div>

      {/* Stats — floating cards */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { number: "300+", label: "Тварин у притулку", accent: "text-[#ced48c]" },
            { number: "2015", label: "Рік заснування", accent: "text-blue-400" },
            { number: "23K", label: "Підписників", accent: "text-pink-400" },
            { number: "24/7", label: "Піклування", accent: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-lg shadow-black/5 text-center">
              <p className={`text-3xl md:text-4xl font-bold ${s.accent}`}>{s.number}</p>
              <p className="text-xs text-gray-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story — two column with offset */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-20 md:py-28">
        <div className="md:flex md:gap-16 md:items-center">
          <div className="flex-1 mb-10 md:mb-0">
            <p className="text-[#ced48c] text-xs font-semibold uppercase tracking-widest mb-3">Наша історія</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Від волонтерки до фонду, що рятує сотні життів</h2>
            <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed">
              <p>
                <strong className="text-foreground">Інесса Капінус</strong> заснувала DniproAnimals у 2015 році. Спочатку це була ініціатива однієї волонтерки — сьогодні це зареєстрований фонд з командою, притулком та понад 300 підопічними.
              </p>
              <p>
                Притулок розташований на <strong className="text-foreground">вул. Героїв Дніпра</strong> і повністю існує за рахунок пожертвувань — жодного державного фінансування.
              </p>
              <p>
                З 2022 року фонд активно евакуює поранених та покинутих тварин із зон бойових дій по всій Україні.
              </p>
            </div>
          </div>
          <div className="md:w-96 flex-shrink-0">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden">
                <Image src="/logo.jpg" alt="DniproAnimals" width={384} height={384} className="w-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#ced48c] rounded-2xl px-5 py-3 shadow-lg">
                <p className="text-sm font-bold text-foreground">З 2015 року</p>
                <p className="text-xs text-foreground/60">рятуємо тварин</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission — card grid */}
      <div className="bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
          <p className="text-[#ced48c] text-xs font-semibold uppercase tracking-widest mb-3 text-center">Що ми робимо</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Кожен день — це боротьба за життя</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "🏠", title: "Усиновлення", desc: "Знаходимо люблячі родини для наших підопічних. Кожна тварина проходить огляд та вакцинацію." },
              { icon: "🚑", title: "Евакуація", desc: "Рятуємо тварин із зон бойових дій та обстрілів по всій Україні з 2022 року." },
              { icon: "💉", title: "Ветеринарія", desc: "Лікування, реабілітація, вакцинація та стерилізація — повний цикл ветеринарної допомоги." },
              { icon: "🔍", title: "Пошук загублених", desc: "Платформа для розміщення оголошень про загублених тварин та возз'єднання з господарями." },
              { icon: "📚", title: "Освіта", desc: "Просвіта щодо гуманного та відповідального ставлення до домашніх тварин." },
              { icon: "🤝", title: "Волонтерство", desc: "Координація волонтерів для кормління, вигулу, прибирання та соціалізації тварин." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-[#ced48c]/30 transition-colors">
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily needs — horizontal scroll feel */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
        <p className="text-[#ced48c] text-xs font-semibold uppercase tracking-widest mb-3 text-center">Щоденні потреби</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">300+ тварин потребують<br />вашої допомоги</h2>
        <p className="text-sm text-gray-medium text-center mb-10 max-w-lg mx-auto">Важливо купувати тільки зі списку — це перевірені корми, ліки та засоби догляду, які не зашкодять хвостикам</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "50 кг", label: "Сухого корму", sub: "щодня", color: "bg-amber-50 border-amber-200" },
            { value: "2.5 кг", label: "Вологого корму", sub: "щодня", color: "bg-green-50 border-green-200" },
            { value: "∞", label: "Ліків та вакцин", sub: "постійно", color: "bg-red-50 border-red-200" },
            { value: "∞", label: "Любові", sub: "завжди", color: "bg-[#ced48c]/20 border-[#ced48c]/40" },
          ].map((n) => (
            <div key={n.label} className={`${n.color} border rounded-2xl p-6 text-center`}>
              <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{n.value}</p>
              <p className="text-sm font-medium text-foreground">{n.label}</p>
              <p className="text-xs text-gray-medium mt-0.5">{n.sub}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/donate" className="inline-flex items-center gap-2 bg-[#ced48c] text-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#b8be72] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Переглянути список потреб
          </Link>
        </div>
      </div>

      {/* Founder — quote style */}
      <div className="bg-[#ced48c]/10">
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-[#ced48c] mx-auto flex items-center justify-center text-4xl mb-6">
              🐾
            </div>
            <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6 italic">
              &laquo;Ми — невелика команда волонтерів, яка робить все можливе для порятунку тварин. Наш притулок завжди відкритий для тих, хто хоче навістити наших мешканців.&raquo;
            </blockquote>
            <p className="text-base font-bold text-foreground">Інесса Капінус</p>
            <p className="text-sm text-gray-medium">Засновниця БО &laquo;Дніпро Енімалс&raquo;</p>
            <div className="flex gap-3 mt-4 justify-center">
              <a href="https://instagram.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-foreground transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://t.me/itsmotherofcats" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-foreground transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </a>
              <a href="https://facebook.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-foreground transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
        <p className="text-[#ced48c] text-xs font-semibold uppercase tracking-widest mb-3 text-center">Контакти</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Де нас знайти</h2>
        <div className="md:flex md:gap-10">
          <div className="flex-1 mb-6 md:mb-0">
            <div className="rounded-2xl overflow-hidden border border-gray-border h-80 md:h-full">
              <iframe
                title="Розташування DniproAnimals"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 320 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=вул.+Героїв+Дніпра,+Дніпро,+Україна&output=embed&z=14"
              />
            </div>
          </div>
          <div className="md:w-80 flex-shrink-0 space-y-5">
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, title: "Адреса", text: "вул. Героїв Дніпра, м. Дніпро, Україна" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>, title: "Телефон", text: "+380 (96) 660 18 17", href: "tel:+380966601817" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, title: "Email", text: "dniproanimals.org@gmail.com", href: "mailto:dniproanimals.org@gmail.com" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title: "Візит", text: "Пишіть в дірект Instagram" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-[#ced48c] flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-gray-medium hover:underline">{item.text}</a>
                  ) : (
                    <p className="text-sm text-gray-medium">{item.text}</p>
                  )}
                </div>
              </div>
            ))}
            <a href="https://www.google.com/maps/search/?api=1&query=вул.+Героїв+Дніпра,+Дніпро" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#ced48c] text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#b8be72] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Прокласти маршрут
            </a>
          </div>
        </div>
      </div>

      {/* Instagram */}
      <div className="bg-gray-light">
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[#ced48c] text-xs font-semibold uppercase tracking-widest mb-2">Соціальні мережі</p>
              <h2 className="text-3xl md:text-4xl font-bold">Ми в Instagram</h2>
              <p className="text-sm text-gray-medium mt-1">@dniproanimals · 23K підписників</p>
            </div>
            <a href="https://instagram.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-[#ced48c]/20 transition-colors border border-gray-border">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Підписатися
            </a>
          </div>
          <InstagramFeed />
          <div className="mt-6 text-center md:hidden">
            <a href="https://instagram.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground border border-gray-border">
              Підписатися в Instagram
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#ced48c]">
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Кожен внесок — це шанс на життя</h2>
          <p className="text-sm text-foreground/60 mb-8 max-w-lg mx-auto">
            Допоможіть нашим 300+ хвостикам. Задонатьте, станьте волонтером, усиновіть тварину або просто поширте інформацію.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/donate" className="bg-foreground text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-foreground/90 transition-colors">
              Задонатити
            </Link>
            <Link href="/" className="bg-white text-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/80 transition-colors">
              Знайти друга
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
