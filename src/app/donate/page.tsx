import Image from "next/image";

export default function DonatePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      {/* Hero */}
      <div className="bg-[#ced48c] rounded-3xl p-8 md:p-12 mb-8 md:flex md:items-center md:gap-10">
        <div className="flex-1 mb-6 md:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Друзі, котики та собачки потребують допомоги!
          </h1>
          <p className="text-sm md:text-base text-foreground/70 leading-relaxed mb-5">
            Кожен внесок рятує життя. Навіть маленька допомога — це велика підтримка для тих, хто не може подбати про себе сам.
          </p>
          <a
            href="https://send.monobank.ua/jar/dniproanimals"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-foreground/90 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Задонатити через Monobank
          </a>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/logo.jpg"
            alt="DniproAnimals"
            width={160}
            height={160}
            className="rounded-2xl object-cover mx-auto"
          />
        </div>
      </div>

      {/* Payment methods */}
      <h2 className="text-xl md:text-2xl font-bold mb-5">Допоможіть тим, хто так на це чекає...</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Monobank */}
        <a href="https://send.monobank.ua/jar/jjJbZRhoQ" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl border border-gray-border p-5 hover:border-[#ced48c] hover:shadow-md transition-all group">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-gray-light flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h3 className="font-semibold text-sm">Monobank</h3>
          </div>
          <p className="text-xs text-gray-medium font-mono mb-1">4441 1144 4172 7326</p>
          <p className="text-xs text-gray-medium">Капінус Інеса</p>
          <p className="text-xs text-[#ced48c] font-medium mt-2 group-hover:underline">Банка Monobank →</p>
        </a>

        {/* ПриватБанк */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-green-light flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-accent"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h3 className="font-semibold text-sm">ПриватБанк</h3>
          </div>
          <p className="text-xs text-gray-medium font-mono mb-1">5168 7456 0790 6259</p>
          <p className="text-xs text-gray-medium">Капінус Інеса</p>
        </div>

        {/* Buy Me a Coffee */}
        <a href="https://buymeacoffee.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl border border-gray-border p-5 hover:border-[#ced48c] hover:shadow-md transition-all group">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            </div>
            <h3 className="font-semibold text-sm">Buy Me a Coffee</h3>
          </div>
          <p className="text-xs text-gray-medium mb-1">Міжнародні перекази</p>
          <p className="text-xs text-[#ced48c] font-medium mt-2 group-hover:underline">buymeacoffee.com →</p>
        </a>

        {/* Інше */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            </div>
            <h3 className="font-semibold text-sm">PayPal & Crypto</h3>
          </div>
          <div className="space-y-1.5">
            <div>
              <p className="text-[10px] text-gray-medium uppercase tracking-wider">PayPal</p>
              <p className="text-xs text-gray-medium font-mono">dniproanimals.org@gmail.com</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-medium uppercase tracking-wider">Crypto (USDT TRC20)</p>
              <p className="text-[10px] text-gray-medium font-mono break-all">TB8owr1wSr7DyX6arVBNjmvtoGp3Fw/dMw</p>
            </div>
          </div>
        </div>
      </div>

      {/* Нова Пошта + Contact */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <h3 className="font-semibold text-sm">Відправити допомогу Новою Поштою</h3>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>НП Дніпро, 85 відділення</p>
            <p className="font-mono">+380 (96) 660 18 17</p>
            <p>Капінус Інеса</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3 className="font-semibold text-sm">Відвідати нас</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Провести час з котиками та собачками</p>
          <p className="text-xs text-gray-medium">Пишіть в дірект Instagram або Telegram</p>
          <p className="text-lg font-bold text-foreground mt-3">Кожен внесок — це шанс на життя!</p>
        </div>
      </div>

      {/* Patreon */}
      <div className="bg-[#ced48c]/20 rounded-2xl p-5 mb-10 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#ced48c] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Підтримуйте нас на Patreon</p>
            <p className="text-xs text-gray-medium">Щомісячна підтримка притулку</p>
          </div>
        </div>
        <a href="https://www.patreon.com/foxrescueteam" target="_blank" rel="noopener noreferrer" className="ml-auto bg-[#ced48c] text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#b8be72] transition-colors">
          Patreon →
        </a>
      </div>

      {/* Needs grid */}
      <h2 className="text-xl md:text-2xl font-bold mb-5">Наші потреби</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {/* Корми Royal Canin */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
            </div>
            <h3 className="font-semibold">Корми Royal Canin</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Паштет</p>
              <div className="space-y-1">
                {["Гастро кітен", "Рекавері", "Babycat"].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                    {i}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Сухий корм</p>
              <div className="space-y-1">
                {["Кітен", "Ренал", "Фіт"].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                    {i}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Лікувальний корм</p>
              <div className="space-y-1">
                {["Ренал", "Урінарі", "Гастроінтестінал (звичайний)", "Діабетік"].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                    {i}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">А також</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                Проплан ренал паштети
              </div>
            </div>
          </div>
        </div>

        {/* Корми та смаколики */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-green-light flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-accent"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </div>
            <h3 className="font-semibold">Корми та смаколики</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Вологі корми для котів</p>
              <div className="space-y-1">
                {["Клуб 4 лапи", "Фелікс", "Гурме"].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                    {i}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Сухий корм 4 лапи</p>
              <div className="space-y-1">
                {["Для цуценят всіх порід", "Для собак середніх порід"].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Мед. препарати */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 className="font-semibold">Мед. препарати</h3>
          </div>
          <div className="space-y-1">
            {[
              "Серенія",
              "Кладакса 40 мг",
              "РеналВет (таблетки / флакони)",
              "Епобіокорін2000",
              "Гепадол міні",
              "Віракса, гептрал",
              "Ферум лек, мільгама (в ампулах)",
              "Квамател і омез (у флаконах)",
            ].map((i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Побутова хімія */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
            </div>
            <h3 className="font-semibold">Побутова хімія та інше</h3>
          </div>
          <div className="space-y-1">
            {[
              "Гель для прання Перволь",
              "Фері для посуду",
              "Доместос",
              "Містер пропер для підлоги",
              "Пакети для сміття 120 л",
              "Чисте ганчір'я з натуральних тканин",
              "Одноразові рушники",
              "Одноразові пелюшки 60x60, 90x60",
            ].map((i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Інше, але важливе */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </div>
            <h3 className="font-semibold">Інше, але також важливе</h3>
          </div>
          <div className="space-y-1">
            {[
              "Іграшки для котів та собак",
              "Лежанки",
              "Дряпки",
              "Комплекси для котиків",
            ].map((i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Для утеплення */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
            </div>
            <h3 className="font-semibold">Для утеплення</h3>
          </div>
          <div className="space-y-1">
            {[
              "Великі покривала",
              "Пледи",
              "Ковдри",
            ].map((i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to help */}
      <div className="bg-gray-light rounded-2xl p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">Як ще допомогти?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: "🏠", title: "Відвідати притулок", desc: "Ви завжди можете приїхати до нас з допомогою — кожен внесок рятує життя!" },
            { icon: "🛒", title: "Купити зі списку", desc: "Важливо купувати тільки зі списку — це перевірені корми, ліки та засоби догляду, які не зашкодять хвостикам." },
            { icon: "🤝", title: "Стати волонтером", desc: "Допомога з кормлінням, вигулом, прибиранням та соціалізацією тварин." },
            { icon: "📢", title: "Поширити інформацію", desc: "Кожна пачка корму, кожна гривня — це шанс для тварини знайти тепло, здоров'я та любов." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-4 flex gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-gray-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="text-center">
        <p className="font-semibold text-sm mb-3">Зв&apos;язатися з нами</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a href="https://instagram.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-light px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-[#ced48c]/30 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Instagram
          </a>
          <a href="https://facebook.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-light px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-[#ced48c]/30 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            Facebook
          </a>
          <a href="https://t.me/itsmotherofcats" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-light px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-[#ced48c]/30 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
