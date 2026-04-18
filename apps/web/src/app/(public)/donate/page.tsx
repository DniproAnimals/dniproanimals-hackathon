"use client";
import { useOrganizationsQuery } from "@/shared/query-hooks";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconCheck,
  IconChevronDown,
  IconCreditCard,
  IconPhoneFilled,
  IconShieldCheck,
  PawIcon,
} from "@dniproanimals/icons";
import {
  Badge,
  Button,
  Card,
  cn,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dniproanimals/ui";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export default function DonatePage() {
  const { data: orgsData = [] } = useOrganizationsQuery();
  const [amount, setAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState<string>("500");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string>("general");
  const [orgSearch, setOrgSearch] = useState("");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const organizations = useMemo(
    () => [
      {
        id: "general",
        name: "DniproAnimals (Загальний фонд)",
        jarId: "jjJbZRhoQ",
      },
      ...orgsData
        .filter((o) => o.monobankJarId)
        .map((o) => ({
          id: String(o.id),
          name: o.name,
          jarId: o.monobankJarId,
        })),
    ],
    [orgsData],
  );

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
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-[-1]">
        <PawIcon className="absolute top-[5%] left-[5%] size-32 -rotate-12" />
        <PawIcon className="absolute top-[20%] right-[10%] size-48 rotate-45" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 lg:py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between mb-16">
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[480px] bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 relative shrink-0"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-foreground">
              Швидка пожертва онлайн
            </h2>

            <div className="mb-5 relative z-10">
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
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50"
                        >
                          <span>{org.name}</span>
                          {selectedOrg === org.id && (
                            <IconCheck size={14} className="text-primary" />
                          )}
                        </button>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5 relative z-10">
              {[100, 500, 1000].map((val) => (
                <Button
                  key={val}
                  
                  variant={amount === val ? "primary" : "outline"}
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount(String(val));
                  }}
                  className="py-4 h-auto text-xl font-bold rounded-2xl border-2"
                >
                  {val} ₴
                </Button>
              ))}
            </div>

            <div className="relative mb-6 z-10">
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
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl h-auto py-4 pl-4 pr-6 text-xl"
              />
            </div>

            {checkoutError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {checkoutError}
              </div>
            )}

            <Button
              variant="secondary"
              onClick={handleCheckout}
              disabled={!(amount || parseInt(customAmount) > 0)}
              className="w-full py-5 h-auto rounded-2xl text-xl font-bold uppercase"
            >
              Допомогти хвостатим
            </Button>
            <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
              <IconShieldCheck size={12} />
              Безпечний платіж через Monobank
            </p>
          </motion.div>
        </div>

        <Card className="p-8 rounded-3xl border-gray-100 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <IconCreditCard size={24} />
            Прямі банківські реквізити
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                Monobank
              </p>
              <p className="text-xl font-mono font-bold text-green-secondary">
                4441 1144 4172 7326
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                ПриватБанк
              </p>
              <p className="text-xl font-mono font-bold text-green-secondary">
                5168 7456 0790 6259
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <p className="font-semibold text-sm mb-3">Зв&apos;язатися з нами</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button variant="subtle" size="lg" asChild>
              <a
                href="https://instagram.com/dniproanimals"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandInstagram size={16} />
                Instagram
              </a>
            </Button>
            <Button variant="subtle" size="lg" asChild>
              <a
                href="https://facebook.com/dniproanimals"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandFacebook size={16} />
                Facebook
              </a>
            </Button>
            <Button variant="subtle" size="lg" asChild>
              <a
                href="https://t.me/itsmotherofcats"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandTelegram size={16} />
                Telegram
              </a>
            </Button>
            <Button variant="subtle" size="lg" asChild>
              <a href="tel:+380966601817">
                <IconPhoneFilled size={16} />
                +380 96 660 18 17
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
