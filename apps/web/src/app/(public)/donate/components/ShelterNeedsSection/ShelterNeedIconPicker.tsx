"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";

import { IconCheck, IconSearch, IconX } from "@dniproanimals/icons";

import { shelterNeedIcons, type ShelterNeedIcon } from "./shelterNeedIcons";

type Props = {
  value: string;
  onChange: (value: ShelterNeedIcon) => void;
  onClose: () => void;
};

const ShelterNeedIconPicker = ({ value, onChange, onClose }: Props) => {
  const [search, setSearch] = useState("");

  const icons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return Object.entries(shelterNeedIcons).filter(([key, item]) => {
      if (!query) {
        return true;
      }

      return (
        key.toLowerCase().includes(query) ||
        item.label.toLowerCase().includes(query)
      );
    }) as [ShelterNeedIcon, (typeof shelterNeedIcons)[ShelterNeedIcon]][];
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSelect = (key: ShelterNeedIcon) => {
    onChange(key);
    onClose();
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="shelter-need-icon-picker-title"
        className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2
              id="shelter-need-icon-picker-title"
              className="text-lg font-semibold text-gray-900"
            >
              Виберіть іконку
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Оберіть іконку для секції матеріальної допомоги
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити каталог іконок"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <IconX size={20} />
          </button>
        </header>

        {/* Search */}
        <div className="border-b px-6 py-4">
          <label htmlFor="shelter-need-icon-search" className="sr-only">
            Пошук іконки
          </label>

          <div className="relative">
            <IconSearch
              size={19}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="shelter-need-icon-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Пошук іконки..."
              autoFocus
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="min-h-0 overflow-y-auto p-6">
          {icons.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
              {icons.map(([key, item]) => {
                const Icon = item.icon;
                const selected = value === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelect(key)}
                    aria-pressed={selected}
                    title={item.label}
                    className={[
                      "group relative flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border p-3 transition focus:outline-none focus:ring-2 focus:ring-gray-400",
                      selected
                        ? "border-gray-900 bg-gray-50 shadow-sm"
                        : "border-gray-100 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md",
                    ].join(" ")}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white">
                        <IconCheck size={12} stroke={3} />
                      </span>
                    )}

                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: item.background,
                      }}
                    >
                      <Icon
                        size={30}
                        stroke="1.8"
                        style={{
                          color: item.color,
                        }}
                      />
                    </span>

                    <span className="max-w-full truncate text-xs font-medium text-gray-700">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-gray-500">
              Іконок не знайдено
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
          <p className="text-xs text-gray-500">
            Доступно іконок: {Object.keys(shelterNeedIcons).length}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Скасувати
          </button>
        </footer>
      </section>
    </div>
  );
};

export default ShelterNeedIconPicker;
