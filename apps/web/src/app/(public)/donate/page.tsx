"use client";
import { cn } from "@/shared/lib/utils";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconCheck,
  IconChevronDown,
  IconCircleCheckFilled,
  IconCirclePlusFilled,
  IconCreditCard,
  IconDropletFilled,
  IconHeartFilled,
  IconHomeFilled,
  IconPhoneFilled,
  IconShieldCheck,
} from "@dniproanimals/icons";
import {
  Badge,
  Button,
  Card,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dniproanimals/ui";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type OrganizationNeed = {
  id: number;
  org_id: number;
  item_name: string;
  quantity: string;
  price_per_unit: number | null;
  org_name: string;
};

// Subtle Paw icon for the background pattern
const PawIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11 20c-3 0-5.5-2.5-6-5s3-6 7-6 7 3.5 7 6-3 5-8 5z" />
    <circle cx="7" cy="8" r="2.5" />
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="17" cy="8" r="2.5" />
  </svg>
);

type Organization = {
  id: number;
  name: string;
  monobank_jar_id: string | null;
};

export default function DonatePage() {
  const [amount, setAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState<string>("500");
  const [checkoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string>("general");
  const [organizations, setOrganizations] = useState<
    { id: string; name: string; jarId: string | null }[]
  >([
    {
      id: "general",
      name: "DniproAnimals (Загальний фонд)",
      jarId: "jjJbZRhoQ",
    },
  ]);
  const [orgSearch, setOrgSearch] = useState("");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then((orgs: Organization[]) => {
        setOrganizations([
          {
            id: "general",
            name: "DniproAnimals (Загальний фонд)",
            jarId: "jjJbZRhoQ",
          },
          ...orgs
            .filter((o) => o.monobank_jar_id)
            .map((o) => ({
              id: String(o.id),
              name: o.name,
              jarId: o.monobank_jar_id,
            })),
        ]);
      })
      .catch(() => {});
  }, []);

  const [needs] = useState<OrganizationNeed[]>([
    {
      id: 1,
      org_id: 1,
      item_name: "Сухий корм для собак 'Brit Premium'",
      quantity: "15 мішків по 15 кг",
      price_per_unit: 1200,
      org_name: "Притулок 'Вірний друг'",
    },
    {
      id: 2,
      org_id: 2,
      item_name: "Вологий корм для кошенят 'Royal Canin'",
      quantity: "50 павучів",
      price_per_unit: 45,
      org_name: "Ковчег",
    },
    {
      id: 3,
      org_id: 1,
      item_name: "Деревний наповнювач для туалетів",
      quantity: "10 упаковок",
      price_per_unit: 250,
      org_name: "Притулок 'Вірний друг'",
    },
    {
      id: 4,
      org_id: 3,
      item_name: "Пелюшки поглинаючі 60х90",
      quantity: "5 упаковок",
      price_per_unit: 350,
      org_name: "Реабілітаційний центр 'Шанс'",
    },
  ]);

  const handleCheckout = () => {
    const finalAmount = amount || parseInt(customAmount) || 0;
    if (finalAmount < 10) {
      setCheckoutError("Мінімальна сума — 10 ₴");
      return;
    }

    const org = organizations.find((o) => o.id === selectedOrg);
    const jarId = org?.jarId;

    if (!jarId) {
      setCheckoutError("Ця організація ще не підключила Monobank банку");
      return;
    }

    window.open(
      `https://send.monobank.ua/jar/${jarId}?amount=${finalAmount}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-[#Fcfcfc] text-foreground selection:bg-primary selection:text-primary-foreground relative z-0">
      {/* Background Decorative Paws */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-[-1]">
        <PawIcon className="absolute top-[5%] left-[5%] size-32 -rotate-12" />
        <PawIcon className="absolute top-[20%] right-[10%] size-48 rotate-45" />
        <PawIcon className="absolute top-[50%] left-[15%] size-24 rotate-12" />
        <PawIcon className="absolute bottom-[20%] right-[20%] size-40 -rotate-45" />
        <PawIcon className="absolute bottom-[5%] left-[30%] size-20 rotate-90" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 lg:py-12 relative z-10">
        {/* TOP SECTION: Hero Text + Native Billing Widget Side-by-Side to minimize scrolling */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between mb-16">
          {/* Left: Hero Intro */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 text-center lg:text-left pt-4 lg:pt-0"
          >
            <Badge
              variant="soft"
              size="lg"
              className="mb-6 border border-primary/40 shadow-sm font-bold"
            >
              <span className="size-2 rounded-full bg-green-secondary animate-pulse" />
              Вбудована система підтримки
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Рятуємо життя{" "}
              <span className="text-green-secondary">хвостатих</span> разом.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
              Ваш внесок — це не просто гроші. Це їжа, тепло, і найголовніше —
              шанс на нове щасливе життя для сотень тварин у притулку.
            </p>
          </motion.div>

          {/* Right: The Billing Widget */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[480px] bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 relative shrink-0"
          >
            <div className="absolute top-0 right-0 size-32 bg-primary rounded-full mix-blend-multiply opacity-20 -translate-y-1/2 translate-x-1/2 blur-[40px]" />

            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-foreground">
              Швидка пожертва онлайн
            </h2>

            <div
              className={cn("mb-5 relative", orgDropdownOpen ? "z-40" : "z-10")}
            >
              <Label className="block text-sm font-bold text-gray-700 mb-2">
                Кому допомагаємо?
              </Label>
              <Popover open={orgDropdownOpen} onOpenChange={setOrgDropdownOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between bg-gray-50 border-2 rounded-2xl py-3 pl-4 pr-10 text-left outline-none transition-colors font-medium cursor-pointer relative",
                      orgDropdownOpen
                        ? "border-primary bg-white"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <span className="truncate">
                      {organizations.find((o) => o.id === selectedOrg)?.name ||
                        "Оберіть організацію"}
                    </span>
                    <IconChevronDown
                      size={16}
                      className={cn(
                        "absolute right-4 text-gray-500 transition-transform",
                        orgDropdownOpen && "rotate-180",
                      )}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="p-0 w-[var(--radix-popover-trigger-width)] rounded-2xl border-2 border-gray-200 max-h-60 overflow-hidden"
                >
                  <div className="p-2 border-b border-gray-100">
                    <Input
                      type="text"
                      size="sm"
                      placeholder="Пошук організації..."
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                      className="rounded-xl border-none bg-gray-50"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-auto py-1">
                    {organizations
                      .filter((o) =>
                        o.name.toLowerCase().includes(orgSearch.toLowerCase()),
                      )
                      .map((org) => (
                        <button
                          key={org.id}
                          type="button"
                          onClick={() => {
                            setSelectedOrg(org.id);
                            setOrgSearch("");
                            setOrgDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        >
                          <span
                            className={cn(
                              selectedOrg === org.id &&
                                "font-bold text-green-secondary",
                            )}
                          >
                            {org.name}
                          </span>
                          {selectedOrg === org.id && (
                            <IconCheck
                              size={14}
                              className="text-primary"
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      ))}
                    {organizations.filter((o) =>
                      o.name.toLowerCase().includes(orgSearch.toLowerCase()),
                    ).length === 0 && (
                      <p className="px-4 py-2 text-xs text-gray-400">
                        Не знайдено
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5 relative z-10">
              {[100, 500, 1000].map((val) => (
                <Button
                  key={val}
                  type="button"
                  variant={amount === val ? "primary" : "outline"}
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount(String(val));
                  }}
                  className={cn(
                    "py-4 h-auto text-xl font-bold rounded-2xl border-2 transition-all duration-300",
                    amount === val
                      ? "border-primary shadow-[0_8px_20px_-6px_rgba(206,212,140,0.6)] scale-[1.02]"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300",
                  )}
                >
                  {val} ₴
                </Button>
              ))}
            </div>

            <div className="relative mb-6 z-10">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                <span className="text-gray-400 text-xl font-medium">₴</span>
              </div>
              <Input
                type="number"
                min="1"
                placeholder="Або введіть свою суму..."
                value={customAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || Number(val) > 0) {
                    setCustomAmount(val);
                    setAmount(null);
                  }
                }}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl h-auto py-4 pl-12 pr-6 text-xl focus-visible:border-primary focus-visible:bg-white placeholder:text-gray-400 font-medium"
              />
            </div>

            {checkoutError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center relative z-10">
                {checkoutError}
              </div>
            )}

            <Button
              type="button"
              variant="secondary"
              onClick={handleCheckout}
              disabled={
                checkoutLoading || !(amount || parseInt(customAmount) > 0)
              }
              className="w-full py-5 h-auto rounded-2xl text-xl font-bold uppercase tracking-wide hover:shadow-xl hover:bg-[#1a232c] hover:-translate-y-1 transition-all disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none relative z-10"
            >
              Допомогти хвостатим
            </Button>
            <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1 relative z-10">
              <IconShieldCheck size={12} />
              Безпечний платіж через Monobank
            </p>
          </motion.div>
        </div>

        {/* Alternative Methods (Colors Restored & No Hover Grayscale needed) */}
        <div className="mb-16">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-400 uppercase tracking-wider">
            Інші способи допомоги
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Monobank",
                desc: "Банка",
                url: "https://send.monobank.ua/jar/jjJbZRhoQ",
                color: "from-black to-gray-800",
                text: "text-white",
                icon: "🐈",
              },
              {
                name: "Buy Me a Coffee",
                desc: "Міжнародні",
                url: "https://buymeacoffee.com/dniproanimals",
                color: "from-[#FFDD00] to-[#F1C40F]",
                text: "text-black",
                icon: "☕",
              },
              {
                name: "Patreon",
                desc: "Підписка",
                url: "https://www.patreon.com/foxrescueteam",
                color: "from-[#FF424D] to-[#E91E63]",
                text: "text-white",
                icon: "♥️",
              },
              {
                name: "PayPal",
                desc: "Увесь світ",
                url: "https://paypal.me/dniproanimals",
                color: "from-[#003087] to-[#001D4F]",
                text: "text-white",
                icon: "💳",
              },
            ].map((btn) => (
              <a
                key={btn.name}
                href={btn.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-5 shadow-sm hover:shadow-xl bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 block",
                  btn.color,
                  btn.text,
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-0.5 leading-tight">
                      {btn.name}
                    </h3>
                    <p className="opacity-80 text-xs font-medium">{btn.desc}</p>
                  </div>
                  <span className="text-3xl opacity-90 group-hover:scale-110 transition-transform">
                    {btn.icon}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Offline & Banking Details in light style */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-8 rounded-3xl border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-foreground">
              <IconCreditCard size={24} />
              Прямі банківські реквізити
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Monobank
                </p>
                <p className="text-xl font-mono font-bold text-green-secondary">
                  4441 1144 4172 7326
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Отримувач: Капінус Інеса
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  ПриватБанк
                </p>
                <p className="text-xl font-mono font-bold text-green-secondary">
                  5168 7456 0790 6259
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Отримувач: Капінус Інеса
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 rounded-3xl border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-brown-accent" />
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-foreground">
              Крипта та Відправка речей (📦)
            </h2>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                USDT (TRC20)
              </p>
              <p className="text-sm font-mono break-all text-gray-800 font-bold">
                TB8owr1wSr7DyX6arVBNjmvtoGp3Fw/dMw
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                Нова Пошта (Речі, корм)
              </p>
              <p className="font-semibold text-gray-800">
                м. Дніпро, Відділення №85
              </p>
              <p className="font-mono text-brown-accent font-bold mt-1">
                +380 96 660 18 17
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Отримувач: Капінус Інеса
              </p>
            </div>
          </Card>
        </div>

        {/* Shelter Needs Section */}
        {needs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-primary rounded-full"></div>
              <h2 className="text-3xl font-extrabold text-foreground">
                Актуальні потреби притулків
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {needs.map((need, i) => (
                <motion.div
                  key={need.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Card className="p-6 rounded-3xl border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <PawIcon className="size-16 rotate-12" />
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-green-secondary bg-green-light px-2.5 py-1 rounded-full mb-2 inline-block">
                        {need.org_name}
                      </span>
                      <h3 className="text-xl font-bold text-foreground leading-tight">
                        {need.item_name}
                      </h3>
                    </div>

                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold mb-0.5">
                          Кількість
                        </p>
                        <p className="text-lg font-bold text-gray-700">
                          {need.quantity}
                        </p>
                      </div>
                      {need.price_per_unit && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase font-bold mb-0.5">
                            Орієнтовна ціна
                          </p>
                          <p className="text-lg font-bold text-green-secondary">
                            {need.price_per_unit} ₴{" "}
                            <span className="text-xs font-medium text-gray-400">
                              / од.
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedOrg(need.org_id.toString());
                        if (need.price_per_unit) {
                          setAmount(null);
                          setCustomAmount(need.price_per_unit.toString());
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="w-full mt-6 py-3 h-auto rounded-xl border-2 border-primary text-green-secondary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      Задонатити на це
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Що потрібно притулкам */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-brown-accent rounded-full"></div>
            <h2 className="text-3xl font-extrabold text-foreground">
              Що потрібно притулкам
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Корми та смаколики */}
            <Card className="rounded-3xl border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-green-secondary" />
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-2xl bg-green-light flex items-center justify-center">
                  <IconHeartFilled size={20} className="text-green-secondary" />
                </div>
                <h3 className="font-bold text-lg">Корми та смаколики</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-green-secondary uppercase tracking-wider mb-2">
                    Вологі корми для котів
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Клуб 4 лапи", price: "~25₴" },
                      { name: "Фелікс", price: "~20₴" },
                      { name: "Гурме", price: "~35₴" },
                    ].map((i) => (
                      <span
                        key={i.name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100"
                      >
                        {i.name}{" "}
                        <span className="text-xs text-green-secondary font-semibold">
                          {i.price}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-green-secondary uppercase tracking-wider mb-2">
                    Сухий корм 4 лапи
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Для цуценят всіх порід", price: "~120₴/кг" },
                      { name: "Для собак середніх порід", price: "~100₴/кг" },
                    ].map((i) => (
                      <span
                        key={i.name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100"
                      >
                        {i.name}{" "}
                        <span className="text-xs text-green-secondary font-semibold">
                          {i.price}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-green-secondary uppercase tracking-wider mb-2">
                    Проплан
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100">
                      Ренал паштети{" "}
                      <span className="text-xs text-green-secondary font-semibold">
                        ~95₴
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Мед. препарати */}
            <Card className="rounded-3xl border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-300 to-red-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-2xl bg-red-50 flex items-center justify-center">
                  <IconCircleCheckFilled size={20} className="text-red-500" />
                </div>
                <h3 className="font-bold text-lg">Мед. препарати</h3>
              </div>
              <div className="flex flex-wrap gap-2">
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
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50/50 text-sm text-gray-700 border border-red-100"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </Card>

            {/* Побутова хімія */}
            <Card className="rounded-3xl border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-blue-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <IconDropletFilled size={20} className="text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">Побутова хімія</h3>
              </div>
              <div className="flex flex-wrap gap-2">
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
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50/50 text-sm text-gray-700 border border-blue-100"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </Card>

            {/* Інше важливе */}
            <Card className="rounded-3xl border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-300 to-purple-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                  <IconCirclePlusFilled size={20} className="text-purple-500" />
                </div>
                <h3 className="font-bold text-lg">Інше важливе</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Іграшки для котів та собак",
                  "Лежанки",
                  "Дряпки",
                  "Комплекси для котиків",
                ].map((i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50/50 text-sm text-gray-700 border border-purple-100"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </Card>

            {/* Для утеплення */}
            <Card className="rounded-3xl border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 to-orange-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <IconHomeFilled size={20} className="text-orange-500" />
                </div>
                <h3 className="font-bold text-lg">Для утеплення</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Великі покривала", "Пледи", "Ковдри"].map((i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-50/50 text-sm text-gray-700 border border-orange-100"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* How to help */}
      <div className="bg-gray-light rounded-2xl p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">Як ще допомогти?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: "🏠",
              title: "Відвідати притулок",
              desc: "Ви завжди можете приїхати до нас з допомогою — кожен внесок рятує життя!",
            },
            {
              icon: "🛒",
              title: "Купити зі списку",
              desc: "Важливо купувати тільки зі списку — це перевірені корми, ліки та засоби догляду.",
            },
            {
              icon: "🤝",
              title: "Стати волонтером",
              desc: "Допомога з кормлінням, вигулом, прибиранням та соціалізацією тварин.",
            },
            {
              icon: "📢",
              title: "Поширити інформацію",
              desc: "Розкажіть друзям — кожен репост може врятувати життя тварини.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-4 flex gap-3"
            >
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-gray-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="text-center">
        <p className="font-semibold text-sm mb-3">Зв&apos;язатися з нами</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Button variant="subtle" size="lg" shape="square" asChild>
            <a
              href="https://instagram.com/dniproanimals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:bg-primary/30"
            >
              <IconBrandInstagram size={16} />
              Instagram
            </a>
          </Button>
          <Button variant="subtle" size="lg" shape="square" asChild>
            <a
              href="https://facebook.com/dniproanimals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:bg-primary/30"
            >
              <IconBrandFacebook size={16} />
              Facebook
            </a>
          </Button>
          <Button variant="subtle" size="lg" shape="square" asChild>
            <a
              href="https://t.me/itsmotherofcats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:bg-primary/30"
            >
              <IconBrandTelegram size={16} />
              Telegram
            </a>
          </Button>
          <Button variant="subtle" size="lg" shape="square" asChild>
            <a
              href="tel:+380966601817"
              className="text-sm font-medium hover:bg-primary/30"
            >
              <IconPhoneFilled size={16} />
              +380 (96) 660 18 17
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
