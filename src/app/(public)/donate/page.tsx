"use client";

import { IconHeartFilled, IconCircleCheckFilled, IconDropletFilled, IconCirclePlusFilled, IconHomeFilled, IconBrandInstagram, IconBrandFacebook, IconBrandTelegram, IconPhoneFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useState, useEffect } from "react";

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
    <path d="M11 20c-3 0-5.5-2.5-6-5s3-6 7-6 7 3.5 7 6-3 5-8 5z"/>
    <circle cx="7" cy="8" r="2.5"/>
    <circle cx="12" cy="5" r="2.5"/>
    <circle cx="17" cy="8" r="2.5"/>
  </svg>
);

type Organization = { id: number; name: string };

export default function DonatePage() {
  const [amount, setAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
  const [selectedOrg, setSelectedOrg] = useState<string>("general");
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([
    { id: "general", name: "DniproAnimals (Загальний фонд)" },
  ]);
  const [orgSearch, setOrgSearch] = useState("");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then((orgs: Organization[]) => {
        setOrganizations([
          { id: "general", name: "DniproAnimals (Загальний фонд)" },
          ...orgs.map((o) => ({ id: String(o.id), name: o.name })),
        ]);
      })
      .catch(() => {});
  }, []);

  const [needs, setNeeds] = useState<OrganizationNeed[]>([
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
    }
  ]);
  const [loadingNeeds, setLoadingNeeds] = useState(false);


  const handleCheckout = () => {
    const finalAmount = amount || parseInt(customAmount) || 0;
    if (finalAmount > 0) {
      setShowCheckout(true);
    }
  };

  const simulatePayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
      setTimeout(() => {
        setShowCheckout(false);
        setPaymentStatus("idle");
        setAmount(500);
        setCustomAmount("");
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#Fcfcfc] text-[#0c1014] selection:bg-[#ced48c] selection:text-[#0c1014] relative z-0">
      
      {/* Background Decorative Paws */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-[-1]">
        <PawIcon className="absolute top-[5%] left-[5%] w-32 h-32 -rotate-12" />
        <PawIcon className="absolute top-[20%] right-[10%] w-48 h-48 rotate-45" />
        <PawIcon className="absolute top-[50%] left-[15%] w-24 h-24 rotate-12" />
        <PawIcon className="absolute bottom-[20%] right-[20%] w-40 h-40 -rotate-45" />
        <PawIcon className="absolute bottom-[5%] left-[30%] w-20 h-20 rotate-90" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 lg:py-12 relative z-10">
        
        {/* TOP SECTION: Hero Text + Native Billing Widget Side-by-Side to minimize scrolling */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between mb-16">
          
          {/* Left: Hero Intro */}
          <div className="flex-1 text-center lg:text-left pt-4 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f4e4] text-[#5b7765] text-sm font-bold mb-6 border border-[#ced48c]/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#5b7765] animate-pulse" />
              Вбудована система підтримки
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Рятуємо життя <span className="text-[#5b7765]">хвостатих</span> разом.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
              Ваш внесок — це не просто гроші. Це їжа, тепло, і найголовніше — шанс на нове щасливе життя для сотень тварин у притулку.
            </p>
          </div>

          {/* Right: The Billing Widget */}
          <div className="w-full lg:w-[480px] bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 relative flex-shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ced48c] rounded-full mix-blend-multiply opacity-20 -translate-y-1/2 translate-x-1/2 blur-[40px]" />
            
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-[#0c1014]">Швидка пожертва онлайн</h2>
            
            <div className={`mb-5 relative ${orgDropdownOpen ? "z-40" : "z-10"}`}>
              <label className="block text-sm font-bold text-gray-700 mb-2">Кому допомагаємо?</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                  className={`w-full flex items-center justify-between bg-gray-50 border-2 rounded-2xl py-3 pl-4 pr-10 text-left outline-none transition-colors font-medium cursor-pointer ${orgDropdownOpen ? "border-[#ced48c] bg-white" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span className="truncate">{organizations.find((o) => o.id === selectedOrg)?.name || "Оберіть організацію"}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`absolute right-4 text-gray-500 transition-transform ${orgDropdownOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {orgDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border-2 border-gray-200 shadow-lg z-30 py-1 max-h-60 overflow-auto">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Пошук організації..."
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 border-none outline-none text-sm"
                        autoFocus
                      />
                    </div>
                    {organizations
                      .filter((o) => o.name.toLowerCase().includes(orgSearch.toLowerCase()))
                      .map((org) => (
                        <button
                          key={org.id}
                          type="button"
                          onClick={() => { setSelectedOrg(org.id); setOrgSearch(""); setOrgDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        >
                          <span className={selectedOrg === org.id ? "font-bold text-[#5b7765]" : ""}>{org.name}</span>
                          {selectedOrg === org.id && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ced48c" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      ))}
                    {organizations.filter((o) => o.name.toLowerCase().includes(orgSearch.toLowerCase())).length === 0 && (
                      <p className="px-4 py-2 text-xs text-gray-400">Не знайдено</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5 relative z-10">
              {[100, 500, 1000].map(val => (
                <button
                  key={val}
                  onClick={() => { setAmount(val); setCustomAmount(String(val)); }}
                  className={`py-4 text-xl font-bold rounded-2xl border-2 transition-all duration-300 ${
                    amount === val 
                      ? "bg-[#ced48c] text-[#0c1014] border-[#ced48c] shadow-[0_8px_20px_-6px_rgba(206,212,140,0.6)] scale-[1.02]" 
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  {val} ₴
                </button>
              ))}
            </div>

            <div className="relative mb-6 z-10">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl font-medium">₴</span>
              </div>
              <input 
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
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-xl text-foreground outline-none focus:border-[#ced48c] focus:bg-white transition-colors placeholder:text-gray-400 font-medium"
              />
            </div>

            <button 
              onClick={handleCheckout}
              disabled={!(amount || parseInt(customAmount) > 0)}
              className="w-full py-5 rounded-2xl bg-[#0c1014] text-white text-xl font-bold uppercase tracking-wide hover:shadow-xl hover:bg-[#1a232c] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none relative z-10"
            >
              Допомогти хвостатим
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1 relative z-10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Безпечний платіж
            </p>
          </div>
        </div>

        {/* Alternative Methods (Colors Restored & No Hover Grayscale needed) */}
        <div className="mb-16">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-400 uppercase tracking-wider">Інші способи допомоги</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Monobank", desc: "Банка", url: "https://send.monobank.ua/jar/jjJbZRhoQ", color: "from-black to-gray-800", text: "text-white", icon: "🐈" },
              { name: "Buy Me a Coffee", desc: "Міжнародні", url: "https://buymeacoffee.com/dniproanimals", color: "from-[#FFDD00] to-[#F1C40F]", text: "text-black", icon: "☕" },
              { name: "Patreon", desc: "Підписка", url: "https://www.patreon.com/foxrescueteam", color: "from-[#FF424D] to-[#E91E63]", text: "text-white", icon: "♥️" },
              { name: "PayPal", desc: "Увесь світ", url: "https://paypal.me/dniproanimals", color: "from-[#003087] to-[#001D4F]", text: "text-white", icon: "💳" }
            ].map(btn => (
              <a 
                key={btn.name} 
                href={btn.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-2xl p-5 shadow-sm hover:shadow-xl bg-gradient-to-br ${btn.color} ${btn.text} transition-all duration-300 hover:-translate-y-1 block`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-0.5 leading-tight">{btn.name}</h3>
                    <p className="opacity-80 text-xs font-medium">{btn.desc}</p>
                  </div>
                  <span className="text-3xl opacity-90 group-hover:scale-110 transition-transform">{btn.icon}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Offline & Banking Details in light style */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-[#ced48c]" />
             <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#0c1014]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                Прямі банківські реквізити
             </h2>
             <div className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Monobank</p>
                  <p className="text-xl font-mono font-bold text-[#5b7765]">4441 1144 4172 7326</p>
                  <p className="text-xs text-gray-500 mt-1">Отримувач: Капінус Інеса</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">ПриватБанк</p>
                  <p className="text-xl font-mono font-bold text-[#5b7765]">5168 7456 0790 6259</p>
                  <p className="text-xs text-gray-500 mt-1">Отримувач: Капінус Інеса</p>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-[#7c4b22]" />
             <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#0c1014]">
               Крипта та Відправка речей (📦)
             </h2>
             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">USDT (TRC20)</p>
                <p className="text-sm font-mono break-all text-gray-800 font-bold">TB8owr1wSr7DyX6arVBNjmvtoGp3Fw/dMw</p>
             </div>
             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Нова Пошта (Речі, корм)</p>
                <p className="font-semibold text-gray-800">м. Дніпро, Відділення №85</p>
                <p className="font-mono text-[#7c4b22] font-bold mt-1">+380 96 660 18 17</p>
                <p className="text-xs text-gray-500 mt-1">Отримувач: Капінус Інеса</p>
             </div>
          </div>
        </div>

        {/* Shelter Needs Section */}
        {needs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-[#ced48c] rounded-full"></div>
              <h2 className="text-3xl font-extrabold text-[#0c1014]">Актуальні потреби притулків</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {needs.map((need) => (
                <div key={need.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <PawIcon className="w-16 h-16 rotate-12" />
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#5b7765] bg-[#f2f4e4] px-2.5 py-1 rounded-full mb-2 inline-block">
                      {need.org_name}
                    </span>
                    <h3 className="text-xl font-bold text-[#0c1014] leading-tight">{need.item_name}</h3>
                  </div>
                  
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-0.5">Кількість</p>
                      <p className="text-lg font-bold text-gray-700">{need.quantity}</p>
                    </div>
                    {need.price_per_unit && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-0.5">Орієнтовна ціна</p>
                        <p className="text-lg font-bold text-[#5b7765]">{need.price_per_unit} ₴ <span className="text-xs font-medium text-gray-400">/ од.</span></p>
                      </div>
                    )}
                  </div>
                  
                  <button 
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
                    className="w-full mt-6 py-3 rounded-xl border-2 border-[#ced48c] text-[#5b7765] font-bold text-sm hover:bg-[#ced48c] hover:text-[#0c1014] transition-all"
                  >
                    Задонатити на це
                  </button>
                </div>
              ))}
            </div>
          </div>)} 


        {/* Що потрібно притулкам */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-[#7c4b22] rounded-full"></div>
            <h2 className="text-3xl font-extrabold text-[#0c1014]">Що потрібно притулкам</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Корми та смаколики */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ced48c] to-[#5b7765]" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#f2f4e4] flex items-center justify-center">
                  <IconHeartFilled size={20} className="text-[#5b7765]" />
                </div>
                <h3 className="font-bold text-lg">Корми та смаколики</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-[#5b7765] uppercase tracking-wider mb-2">Вологі корми для котів</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Клуб 4 лапи", price: "~25₴" },
                      { name: "Фелікс", price: "~20₴" },
                      { name: "Гурме", price: "~35₴" },
                    ].map((i) => (
                      <span key={i.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100">
                        {i.name} <span className="text-xs text-[#5b7765] font-semibold">{i.price}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#5b7765] uppercase tracking-wider mb-2">Сухий корм 4 лапи</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Для цуценят всіх порід", price: "~120₴/кг" },
                      { name: "Для собак середніх порід", price: "~100₴/кг" },
                    ].map((i) => (
                      <span key={i.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100">
                        {i.name} <span className="text-xs text-[#5b7765] font-semibold">{i.price}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#5b7765] uppercase tracking-wider mb-2">Проплан</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100">
                      Ренал паштети <span className="text-xs text-[#5b7765] font-semibold">~95₴</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Мед. препарати */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-300 to-red-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                  <IconCircleCheckFilled size={20} className="text-red-500" />
                </div>
                <h3 className="font-bold text-lg">Мед. препарати</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Серенія", "Кладакса 40 мг", "РеналВет (таблетки / флакони)",
                  "Епобіокорін2000", "Гепадол міні", "Віракса, гептрал",
                  "Ферум лек, мільгама (в ампулах)", "Квамател і омез (у флаконах)",
                ].map((i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50/50 text-sm text-gray-700 border border-red-100">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            {/* Побутова хімія */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-blue-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <IconDropletFilled size={20} className="text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">Побутова хімія</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Гель для прання Перволь", "Фері для посуду", "Доместос",
                  "Містер пропер для підлоги", "Пакети для сміття 120 л",
                  "Чисте ганчір'я з натуральних тканин",
                  "Одноразові рушники", "Одноразові пелюшки 60x60, 90x60",
                ].map((i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50/50 text-sm text-gray-700 border border-blue-100">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            {/* Інше важливе */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-300 to-purple-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                  <IconCirclePlusFilled size={20} className="text-purple-500" />
                </div>
                <h3 className="font-bold text-lg">Інше важливе</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Іграшки для котів та собак", "Лежанки", "Дряпки", "Комплекси для котиків"].map((i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50/50 text-sm text-gray-700 border border-purple-100">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            {/* Для утеплення */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 to-orange-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <IconHomeFilled size={20} className="text-orange-500" />
                </div>
                <h3 className="font-bold text-lg">Для утеплення</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Великі покривала", "Пледи", "Ковдри"].map((i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-50/50 text-sm text-gray-700 border border-orange-100">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
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