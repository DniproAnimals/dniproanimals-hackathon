import Image from "next/image";
import {
  IconCreditCardFilled,
  IconArrowRight,
  IconCoffee,
  IconHeartFilled,
  IconWorld,
  IconTruckDelivery,
  IconShoppingBag,
  IconCircleCheckFilled,
  IconDropletFilled,
  IconCirclePlusFilled,
  IconHomeFilled,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTelegram,
  IconPhoneFilled,
} from "@tabler/icons-react";

export default function DonatePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      {/* Hero */}
      <div className="bg-[#ced48c] rounded-3xl p-8 md:p-12 mb-10 md:flex md:items-center md:gap-10">
        <div className="flex-1 mb-6 md:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Допоможіть тим, хто так на це чекає...
          </h1>
          <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
            Кожна пачка корму, кожна гривня — це шанс для тварини знайти тепло, здоров&apos;я та любов. Кожен внесок — це шанс на життя!
          </p>
        </div>
        <Image src="/logo.jpg" alt="DniproAnimals" width={140} height={140} className="rounded-2xl object-cover mx-auto flex-shrink-0" />
      </div>

      {/* Donate buttons */}
      <h2 className="text-xl md:text-2xl font-bold mb-5">Задонатити</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Monobank */}
        <a href="https://send.monobank.ua/jar/jjJbZRhoQ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#1a1a1a] text-white rounded-2xl p-5 hover:opacity-90 transition-opacity">
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <IconCreditCardFilled size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Monobank</p>
            <p className="text-xs text-white/60">Банка — найшвидший спосіб</p>
          </div>
          <IconArrowRight size={18} className="text-white/40 flex-shrink-0" />
        </a>

        {/* Buy Me a Coffee */}
        <a href="https://buymeacoffee.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#FFDD00] text-[#1a1a1a] rounded-2xl p-5 hover:opacity-90 transition-opacity">
          <div className="w-11 h-11 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
            <IconCoffee size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Buy Me a Coffee</p>
            <p className="text-xs text-black/50">Міжнародні перекази</p>
          </div>
          <IconArrowRight size={18} className="text-black/30 flex-shrink-0" />
        </a>

        {/* Patreon */}
        <a href="https://www.patreon.com/foxrescueteam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#FF424D] text-white rounded-2xl p-5 hover:opacity-90 transition-opacity">
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <IconHeartFilled size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Patreon</p>
            <p className="text-xs text-white/60">Щомісячна підтримка</p>
          </div>
          <IconArrowRight size={18} className="text-white/40 flex-shrink-0" />
        </a>

        {/* PayPal */}
        <a href="https://paypal.me/dniproanimals" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#003087] text-white rounded-2xl p-5 hover:opacity-90 transition-opacity">
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <IconWorld size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">PayPal</p>
            <p className="text-xs text-white/60">dniproanimals.org@gmail.com</p>
          </div>
          <IconArrowRight size={18} className="text-white/40 flex-shrink-0" />
        </a>
      </div>

      {/* Card requisites + Crypto — info blocks */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Cards */}
        <div className="bg-[#ced48c]/20 rounded-2xl p-5 border border-[#ced48c]/30">
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">Реквізити карток</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-medium">Monobank</p>
              <p className="text-sm font-mono font-medium">4441 1144 4172 7326</p>
              <p className="text-xs text-gray-medium">Капінус Інеса</p>
            </div>
            <div className="border-t border-[#ced48c]/20 pt-3">
              <p className="text-xs text-gray-medium">ПриватБанк</p>
              <p className="text-sm font-mono font-medium">5168 7456 0790 6259</p>
              <p className="text-xs text-gray-medium">Капінус Інеса</p>
            </div>
          </div>
        </div>

        {/* Crypto */}
        <div className="bg-[#ced48c]/20 rounded-2xl p-5 border border-[#ced48c]/30">
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">Криптовалюта</p>
          <div>
            <p className="text-xs text-gray-medium mb-1">USDT (TRC20)</p>
            <p className="text-sm font-mono font-medium break-all">TB8owr1wSr7DyX6arVBNjmvtoGp3Fw/dMw</p>
          </div>
          <p className="text-xs text-gray-medium mt-3 leading-relaxed">
            Триває збір на ліки та ветеринарне обслуговування підопічних притулку DniproAnimals — врятованих та евакуйованих тварин.
          </p>
        </div>
      </div>

      {/* Nova Poshta — red block */}
      <div className="bg-red-500 text-white rounded-2xl p-6 mb-10">
        <div className="md:flex md:items-center md:gap-6">
          <div className="flex items-center gap-3 mb-3 md:mb-0">
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <IconTruckDelivery size={22} />
            </div>
            <div>
              <p className="font-bold text-base">Відправити допомогу Новою Поштою</p>
              <p className="text-xs text-white/70">Корм, ліки, побутову хімію, пледи</p>
            </div>
          </div>
          <div className="flex-1 md:text-right">
            <p className="text-sm font-medium">НП Дніпро, 85 відділення</p>
            <p className="text-sm font-mono">+380 (96) 660 18 17</p>
            <p className="text-sm font-semibold">Капінус Інеса</p>
          </div>
        </div>
      </div>

      {/* Needs */}
      <h2 className="text-xl md:text-2xl font-bold mb-5">Наші потреби</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {/* Royal Canin */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
              <IconShoppingBag size={18} className="text-amber-600" />
            </div>
            <h3 className="font-semibold">Корми Royal Canin</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Паштет</p>
              {[
                { name: "Гастро кітен", price: "~90 грн/шт" },
                { name: "Рекавері", price: "~85 грн/шт" },
                { name: "Babycat", price: "~80 грн/шт" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between text-sm text-gray-600 py-0.5">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />{i.name}</div>
                  <span className="text-xs text-gray-400">{i.price}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Сухий корм</p>
              {[
                { name: "Кітен", price: "~350 грн/кг" },
                { name: "Ренал", price: "~450 грн/кг" },
                { name: "Фіт", price: "~280 грн/кг" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between text-sm text-gray-600 py-0.5">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />{i.name}</div>
                  <span className="text-xs text-gray-400">{i.price}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Лікувальний корм</p>
              {["Ренал", "Урінарі", "Гастроінтестінал", "Діабетік"].map((i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 py-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />{i}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Корми та смаколики */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-green-light flex items-center justify-center">
              <IconHeartFilled size={18} className="text-green-accent" />
            </div>
            <h3 className="font-semibold">Корми та смаколики</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Вологі корми для котів</p>
              {[
                { name: "Клуб 4 лапи", price: "~25 грн/шт" },
                { name: "Фелікс", price: "~20 грн/шт" },
                { name: "Гурме", price: "~35 грн/шт" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between text-sm text-gray-600 py-0.5">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />{i.name}</div>
                  <span className="text-xs text-gray-400">{i.price}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Сухий корм 4 лапи</p>
              {[
                { name: "Для цуценят всіх порід", price: "~120 грн/кг" },
                { name: "Для собак середніх порід", price: "~100 грн/кг" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between text-sm text-gray-600 py-0.5">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />{i.name}</div>
                  <span className="text-xs text-gray-400">{i.price}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-1.5">Проплан</p>
              <div className="flex items-center justify-between text-sm text-gray-600 py-0.5">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />Ренал паштети</div>
                <span className="text-xs text-gray-400">~95 грн/шт</span>
              </div>
            </div>
          </div>
        </div>

        {/* Мед. препарати */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
              <IconCircleCheckFilled size={18} className="text-red-500" />
            </div>
            <h3 className="font-semibold">Мед. препарати</h3>
          </div>
          {[
            "Серенія", "Кладакса 40 мг", "РеналВет (таблетки / флакони)",
            "Епобіокорін2000", "Гепадол міні", "Віракса, гептрал",
            "Ферум лек, мільгама (в ампулах)", "Квамател і омез (у флаконах)",
          ].map((i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />{i}
            </div>
          ))}
        </div>

        {/* Побутова хімія */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <IconDropletFilled size={18} className="text-blue-500" />
            </div>
            <h3 className="font-semibold">Побутова хімія</h3>
          </div>
          {[
            "Гель для прання Перволь", "Фері для посуду", "Доместос",
            "Містер пропер для підлоги", "Пакети для сміття 120 л",
            "Чисте ганчір'я з натуральних тканин",
            "Одноразові рушники", "Одноразові пелюшки 60x60, 90x60",
          ].map((i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />{i}
            </div>
          ))}
        </div>

        {/* Інше */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
              <IconCirclePlusFilled size={18} className="text-purple-500" />
            </div>
            <h3 className="font-semibold">Інше важливе</h3>
          </div>
          {["Іграшки для котів та собак", "Лежанки", "Дряпки", "Комплекси для котиків"].map((i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />{i}
            </div>
          ))}
        </div>

        {/* Для утеплення */}
        <div className="bg-white rounded-2xl border border-gray-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
              <IconHomeFilled size={18} className="text-orange-500" />
            </div>
            <h3 className="font-semibold">Для утеплення</h3>
          </div>
          {["Великі покривала", "Пледи", "Ковдри"].map((i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ced48c] flex-shrink-0" />{i}
            </div>
          ))}
        </div>
      </div>

      {/* How to help */}
      <div className="bg-gray-light rounded-2xl p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">Як ще допомогти?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: "🏠", title: "Відвідати притулок", desc: "Ви завжди можете приїхати до нас з допомогою — кожен внесок рятує життя!" },
            { icon: "🛒", title: "Купити зі списку", desc: "Важливо купувати тільки зі списку — це перевірені корми, ліки та засоби догляду." },
            { icon: "🤝", title: "Стати волонтером", desc: "Допомога з кормлінням, вигулом, прибиранням та соціалізацією тварин." },
            { icon: "📢", title: "Поширити інформацію", desc: "Розкажіть друзям — кожен репост може врятувати життя тварини." },
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
            <IconBrandInstagram size={16} />
            Instagram
          </a>
          <a href="https://facebook.com/dniproanimals" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-light px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-[#ced48c]/30 transition-colors">
            <IconBrandFacebook size={16} />
            Facebook
          </a>
          <a href="https://t.me/itsmotherofcats" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-light px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-[#ced48c]/30 transition-colors">
            <IconBrandTelegram size={16} />
            Telegram
          </a>
          <a href="tel:+380966601817" className="flex items-center gap-2 bg-gray-light px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-[#ced48c]/30 transition-colors">
            <IconPhoneFilled size={16} />
            +380 (96) 660 18 17
          </a>
        </div>
      </div>
    </div>
  );
}
