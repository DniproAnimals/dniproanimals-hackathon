export default function DonatePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Допомогти притулку</h1>
      <p className="text-sm text-gray-medium mb-6">
        Кожна гривня рятує життя наших 300+ хвостиків
      </p>

      <div className="md:grid md:grid-cols-2 md:gap-6">
        {/* Monobank */}
        <div className="bg-green-soft rounded-2xl p-6 mb-5 md:mb-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-green-light flex items-center justify-center">
              <span className="text-lg">🏦</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">Банка на Monobank</p>
              <p className="text-xs text-gray-medium">Найшвидший спосіб допомогти</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Кошти йдуть на корм, ветеринарне лікування та утримання притулку.
          </p>
          <a
            href="https://send.monobank.ua/jar/dniproanimals"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#ced48c] text-foreground py-3.5 rounded-xl font-semibold text-center text-sm hover:bg-[#b8be72] transition-colors"
          >
            Задонатити через Monobank →
          </a>
        </div>

        <div className="space-y-5">
          {/* What we need */}
          <div className="bg-white rounded-2xl border border-gray-border p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
                <span className="text-sm">🍖</span>
              </div>
              <h3 className="font-semibold text-sm">Щоденні потреби</h3>
            </div>
            <div className="space-y-2">
              {[
                "50 кг сухого корму на день",
                "2.5 кг вологого корму на день",
                "Протипаразитарні препарати",
                "Вакцини та ветеринарні витратні",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-primary flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-border p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-green-light flex items-center justify-center">
                <span className="text-sm">🤝</span>
              </div>
              <h3 className="font-semibold text-sm">Як ще допомогти</h3>
            </div>
            <div className="space-y-2">
              {[
                "Стати волонтером притулку",
                "Привезти корм або ліки",
                "Поширити інформацію",
                "Стати опікуном тварини",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-primary flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-light rounded-2xl p-5 mt-6 text-center">
        <p className="font-semibold text-sm mb-3">Зв&apos;язатися з нами</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { href: "https://instagram.com/dniproanimals", icon: "📸", label: "Instagram" },
            { href: "https://facebook.com/dniproanimals", icon: "📘", label: "Facebook" },
            { href: "https://t.me/itsmotherofcats", icon: "✈️", label: "Telegram" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-green-soft transition-colors"
            >
              {link.icon} {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
