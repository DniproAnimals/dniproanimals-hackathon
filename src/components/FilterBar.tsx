"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";

const breedOptions = ["Німецька вівчарка", "Лабрадор", "Стаффордширський тер'єр", "Хаскі", "Бульдог", "Такса", "Чихуахуа", "Коргі", "Мопс", "Європейська короткошерста", "Ангорська", "Мейн-кун", "Сфінкс", "Бенгальська", "Мікс"];

const colorOptions = [
  { value: "Білий", color: "#ffffff" },
  { value: "Чорний", color: "#1a1a1a" },
  { value: "Сірий", color: "#9e9e9e" },
  { value: "Рудий", color: "#c45e1a" },
  { value: "Коричневий", color: "#6d4c2e" },
  { value: "Золотистий", color: "#d4a017" },
  { value: "Кремовий", color: "#f5deb3" },
  { value: "Тигровий", color: "#8B6914" },
];

const commandOptions = ["Сидіти", "Лежати", "Дай лапу", "Голос", "Фу", "Поруч", "Апорт", "Чекай", "До мене", "Місце"];

// Reusable dropdown component
function FilterDropdown({ label, icon, values, options, onToggle, search, colorCircles }: {
  label: string; icon: string; values: string[]; options: { value: string; label: string; color?: string }[];
  onToggle: (v: string) => void; search?: boolean; colorCircles?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = search && query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options;
  const displayText = values.length > 0
    ? (colorCircles ? values.join(", ") : values.map((v) => options.find((o) => o.value === v)?.label || v).join(", "))
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm text-left transition-colors ${
          open ? "border-[#ced48c] ring-2 ring-[#ced48c]/20 bg-white" : values.length > 0 ? "border-[#ced48c] bg-[#ced48c]/5" : "border-gray-border bg-white hover:border-gray-400"
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-xs flex-shrink-0">{icon}</span>
          <span className={`truncate text-xs ${values.length > 0 ? "text-foreground font-medium" : "text-gray-medium"}`}>
            {displayText || label}
          </span>
        </span>
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          {values.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#ced48c] text-foreground text-[9px] font-bold flex items-center justify-center">{values.length}</span>
          )}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-border shadow-lg z-30 py-1 max-h-52 overflow-auto">
          {search && (
            <div className="p-2 border-b border-gray-border">
              <input type="text" placeholder="Пошук..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-gray-light border-none outline-none text-xs" autoFocus />
            </div>
          )}
          {filtered.map((opt) => {
            const sel = values.includes(opt.value);
            return (
              <button key={opt.value} type="button" onClick={() => onToggle(opt.value)} className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-light transition-colors">
                <span className="flex items-center gap-2">
                  {colorCircles && opt.color && <span className="w-4 h-4 rounded-full border border-gray-border flex-shrink-0" style={{ backgroundColor: opt.color }} />}
                  <span className={sel ? "font-medium" : ""}>{opt.label}</span>
                </span>
                {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ced48c" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            );
          })}
          {search && filtered.length === 0 && <p className="px-3 py-2 text-[11px] text-gray-medium">Не знайдено</p>}
        </div>
      )}
    </div>
  );
}

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getMulti = useCallback((key: string) => (searchParams.get(key) || "").split(",").filter(Boolean), [searchParams]);

  const toggleMulti = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = (params.get(key) || "").split(",").filter(Boolean);
    const idx = current.indexOf(value);
    if (idx >= 0) current.splice(idx, 1); else current.push(value);
    if (current.length > 0) params.set(key, current.join(",")); else params.delete(key);
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const toggleExtra = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(value) === "1") params.delete(value); else params.set(value, "1");
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const currentSearch = searchParams.get("q") || "";
  const updateSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value); else params.delete("q");
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const typeValues = getMulti("type");
  const breedValues = getMulti("breed");
  const sexValues = getMulti("sex");
  const sizeValues = getMulti("size");
  const colorValues = getMulti("color");
  const extraValues = [
    ...(searchParams.get("vaccinated") === "1" ? ["vaccinated"] : []),
    ...(searchParams.get("sterilized") === "1" ? ["sterilized"] : []),
    ...(searchParams.get("trained") === "1" ? ["trained"] : []),
  ];

  const totalActive = typeValues.length + breedValues.length + sexValues.length + sizeValues.length + colorValues.length + extraValues.length;

  return (
    <div className="space-y-2.5">
      {/* Search */}
      <div className="relative">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input type="text" placeholder="Пошук..." value={currentSearch} onChange={(e) => updateSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-gray-border focus:ring-2 focus:ring-[#ced48c]/40 focus:border-[#ced48c] outline-none text-xs placeholder:text-gray-medium" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-medium uppercase tracking-wider">Фільтри</span>
        {totalActive > 0 && <span className="w-4 h-4 rounded-full bg-[#ced48c] text-foreground text-[9px] font-bold flex items-center justify-center">{totalActive}</span>}
        {totalActive > 0 && (
          <button onClick={() => { const params = new URLSearchParams(); const q = searchParams.get("q"); if (q) params.set("q", q); router.push(`/?${params.toString()}`); }} className="ml-auto text-[10px] text-gray-medium hover:text-foreground transition-colors">
            Скинути
          </button>
        )}
      </div>

      {/* Dropdowns */}
      <FilterDropdown label="Категорія" icon="🐾" values={typeValues} onToggle={(v) => toggleMulti("type", v)} options={[
        { value: "dog", label: "🐕 Собаки" }, { value: "cat", label: "🐈 Коти" }, { value: "other", label: "🐾 Інше" },
      ]} />

      <FilterDropdown label="Порода" icon="🏷️" values={breedValues} onToggle={(v) => toggleMulti("breed", v)} search options={breedOptions.map((b) => ({ value: b, label: b }))} />

      <FilterDropdown label="Стать" icon="⚤" values={sexValues} onToggle={(v) => toggleMulti("sex", v)} options={[
        { value: "male", label: "♂️ Хлопчик" }, { value: "female", label: "♀️ Дівчинка" },
      ]} />

      <FilterDropdown label="Розмір" icon="📏" values={sizeValues} onToggle={(v) => toggleMulti("size", v)} options={[
        { value: "small", label: "Малий" }, { value: "medium", label: "Середній" }, { value: "large", label: "Великий" },
      ]} />

      <FilterDropdown label="Колір" icon="🎨" values={colorValues} onToggle={(v) => toggleMulti("color", v)} colorCircles options={colorOptions.map((c) => ({ value: c.value, label: c.value, color: c.color }))} />

      <FilterDropdown label="Додатково" icon="⚙️" values={extraValues} onToggle={toggleExtra} options={[
        { value: "vaccinated", label: "💉 Вакциновано" }, { value: "sterilized", label: "✂️ Стерилізовано" }, { value: "trained", label: "🎓 Навчено" },
      ]} />

      {/* Active chips */}
      {totalActive > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {[...typeValues.map((v) => ({ key: "type", v, label: v === "dog" ? "Собаки" : v === "cat" ? "Коти" : "Інше" })),
            ...breedValues.map((v) => ({ key: "breed", v, label: v })),
            ...sexValues.map((v) => ({ key: "sex", v, label: v === "male" ? "Хлопчик" : "Дівчинка" })),
            ...sizeValues.map((v) => ({ key: "size", v, label: v === "small" ? "Малий" : v === "medium" ? "Середній" : "Великий" })),
            ...colorValues.map((v) => ({ key: "color", v, label: v })),
            ...extraValues.map((v) => ({ key: "extra", v, label: v === "vaccinated" ? "Вакциновано" : v === "sterilized" ? "Стерилізовано" : "Навчено" })),
          ].map((chip) => (
            <button
              key={`${chip.key}-${chip.v}`}
              onClick={() => chip.key === "extra" ? toggleExtra(chip.v) : chip.key === "color" ? toggleMulti("color", chip.v) : toggleMulti(chip.key, chip.v)}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#ced48c]/20 text-[10px] font-medium text-foreground hover:bg-[#ced48c]/40 transition-colors"
            >
              {chip.label}
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-400"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
