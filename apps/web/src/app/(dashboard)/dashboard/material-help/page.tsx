"use client";

import { IconChevronDown, IconPlus, IconTrash } from "@dniproanimals/icons";

import { Button, Card, Input, Label } from "@dniproanimals/ui";

import type {
  ShelterNeedCard,
  ShelterNeedItem,
  ShelterNeedSubgroup,
} from "@dniproanimals/contracts";

import {
  useShelterNeedsQuery,
  useUpdateShelterNeedsMutation,
} from "@/shared/query-hooks";

import { useEffect, useState } from "react";

import ShelterNeedIconPicker from "@/app/(public)/donate/components/ShelterNeedsSection/ShelterNeedIconPicker";

import { getShelterNeedIcon } from "@/app/(public)/donate/components/ShelterNeedsSection/shelterNeedIcons";

const makeId = (prefix: string) =>
  `${prefix} -${Math.random().toString(36).slice(2, 8)} `;

const getCardColor = (card: ShelterNeedCard) =>
  card.color ?? card.gradient.match(/#[\da-f]{6}/i)?.[0] ?? "#5B7765";

const newItem = (): ShelterNeedItem => ({
  id: makeId("item"),
  name: "Новий тег",
  price: "",
});

const newGroup = (): ShelterNeedSubgroup => ({
  id: makeId("group"),
  title: "Нова підсекція",
  items: [newItem()],
});

const newCard = (): ShelterNeedCard => ({
  id: makeId("section"),
  title: "Нова секція",
  icon: "paw",
  gradient: "#5B7765",
  color: "#5B7765",
  items: [newItem()],
});

export default function MaterialHelpPage() {
  const { data, isLoading } = useShelterNeedsQuery();
  const updateMutation = useUpdateShelterNeedsMutation();

  const [cards, setCards] = useState<ShelterNeedCard[]>([]);

  const [iconPickerCardId, setIconPickerCardId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.cards) {
      // The query is asynchronous; keep the editable draft aligned with the loaded record.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCards(data.cards);
    }
  }, [data]);

  const updateCard = (cardId: string, update: Partial<ShelterNeedCard>) => {
    setCards((current) =>
      current.map((card) =>
        card.id === cardId ? { ...card, ...update } : card,
      ),
    );
  };

  const updateItems = (
    cardId: string,
    items: ShelterNeedItem[],
    subgroupId?: string,
  ) => {
    setCards((current) =>
      current.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        if (!subgroupId) {
          return {
            ...card,
            items,
          };
        }

        return {
          ...card,
          subgroups: card.subgroups?.map((group) =>
            group.id === subgroupId
              ? {
                  ...group,
                  items,
                }
              : group,
          ),
        };
      }),
    );
  };

  const updateGroup = (
    cardId: string,
    subgroupId: string,
    update: Partial<ShelterNeedSubgroup>,
  ) => {
    setCards((current) =>
      current.map((card) =>
        card.id === cardId
          ? {
              ...card,
              subgroups: card.subgroups?.map((group) =>
                group.id === subgroupId
                  ? {
                      ...group,
                      ...update,
                    }
                  : group,
              ),
            }
          : card,
      ),
    );
  };

  const save = () => {
    updateMutation.mutate({
      cards,
    });
  };

  const selectedPickerCard = iconPickerCardId
    ? cards.find((card) => card.id === iconPickerCardId)
    : undefined;

  if (isLoading) {
    return (
      <div className="max-w-6xl">
        <p className="text-sm text-gray-medium">Завантаження...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-6xl space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          Матеріальна допомога
        </h1>

        <p className="text-sm text-gray-medium">
          У базі ще немає секцій матеріальної допомоги.
        </p>

        <Button type="button" onClick={() => setCards([newCard()])}>
          <IconPlus size={17} />
          Додати секцію
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Матеріальна допомога
          </h1>

          <p className="mt-1 text-sm text-gray-medium">
            Керуйте секціями та тегами, які бачать на сторінці донату.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setCards([newCard(), ...cards])}
        >
          <IconPlus size={17} />
          Додати секцію
        </Button>
      </div>

      {/* Cards */}
      {cards.map((card) => {
        const selectedIcon = getShelterNeedIcon(card.icon);
        const SelectedIcon = selectedIcon?.icon;

        return (
          <Card
            key={card.id}
            className="space-y-5 rounded-3xl border-gray-100 p-6 shadow-sm"
          >
            {/* Section settings */}
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <EditorField
                label="Назва секції"
                value={card.title}
                onChange={(value) =>
                  updateCard(card.id, {
                    title: value,
                  })
                }
              />

              {/* Icon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Іконка
                </label>

                <button
                  type="button"
                  onClick={() => setIconPickerCardId(card.id)}
                  className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 text-left transition hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {selectedIcon ? (
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: selectedIcon.background,
                      }}
                    >
                      <SelectedIcon
                        size={27}
                        stroke="1.8"
                        style={{
                          color: selectedIcon.color,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg text-gray-400">
                      ?
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {selectedIcon?.label ?? "Іконка не вибрана"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Натисніть, щоб відкрити каталог
                    </p>
                  </div>

                  <IconChevronDown
                    size={18}
                    className="shrink-0 text-gray-400"
                  />
                </button>
              </div>

              {/* Color */}
              <div>
                <Label>Колір</Label>

                <Input
                  type="color"
                  value={getCardColor(card)}
                  onChange={(event) =>
                    updateCard(card.id, {
                      color: event.target.value,
                      gradient: event.target.value,
                    })
                  }
                  className="mt-2 h-10 w-16 p-1"
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold">Теги секції</h2>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateItems(card.id, [...card.items, newItem()])
                  }
                >
                  <IconPlus size={15} />
                  Додати тег
                </Button>
              </div>

              <ItemEditor
                items={card.items}
                onChange={(items) => updateItems(card.id, items)}
              />
            </div>

            {/* Subgroups */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold">Підсекції</h2>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateCard(card.id, {
                      subgroups: [...(card.subgroups ?? []), newGroup()],
                    })
                  }
                >
                  <IconPlus size={15} />
                  Додати підсекцію
                </Button>
              </div>

              <div className="space-y-4">
                {card.subgroups?.map((group) => (
                  <div key={group.id} className="rounded-2xl bg-gray-50 p-4">
                    <div className="mb-3 flex items-end gap-3">
                      <div className="min-w-0 flex-1">
                        <EditorField
                          label="Назва підсекції"
                          value={group.title}
                          onChange={(value) =>
                            updateGroup(card.id, group.id, {
                              title: value,
                            })
                          }
                        />
                      </div>

                      <IconButton
                        label="Видалити підсекцію"
                        onClick={() =>
                          updateCard(card.id, {
                            subgroups: card.subgroups?.filter(
                              (item) => item.id !== group.id,
                            ),
                          })
                        }
                      />
                    </div>

                    <ItemEditor
                      items={group.items}
                      onChange={(items) =>
                        updateItems(card.id, items, group.id)
                      }
                    />

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="mt-3"
                      onClick={() =>
                        updateItems(
                          card.id,
                          [...group.items, newItem()],
                          group.id,
                        )
                      }
                    >
                      <IconPlus size={15} />
                      Додати тег
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delete */}
            <div className="flex justify-end gap-2 border-t border-gray-100 pt-5">
              <Button
                type="button"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                onClick={() =>
                  setCards(cards.filter((item) => item.id !== card.id))
                }
              >
                <IconTrash size={17} />
                Видалити секцію
              </Button>
            </div>
          </Card>
        );
      })}

      {/* Save */}
      <div className="flex justify-end">
        <Button
          type="button"
          size="lg"
          onClick={save}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Збереження..." : "Зберегти зміни"}
        </Button>
      </div>

      {/* Icon picker */}
      {selectedPickerCard && (
        <ShelterNeedIconPicker
          value={selectedPickerCard.icon}
          onChange={(icon) => {
            updateCard(selectedPickerCard.id, {
              icon,
            });

            setIconPickerCardId(null);
          }}
          onClose={() => {
            setIconPickerCardId(null);
          }}
        />
      )}
    </div>
  );
}

function ItemEditor({
  items,
  onChange,
}: {
  items: ShelterNeedItem[];
  onChange: (items: ShelterNeedItem[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id} className="grid gap-2 sm:grid-cols-[1fr_10rem_auto]">
          <Input
            value={item.name}
            aria-label={`Назва тегу ${index + 1} `}
            onChange={(event) =>
              onChange(
                items.map((current) =>
                  current.id === item.id
                    ? {
                        ...current,
                        name: event.target.value,
                      }
                    : current,
                ),
              )
            }
          />

          <Input
            value={item.price ?? ""}
            placeholder="Ціна"
            aria-label={`Ціна тегу ${index + 1} `}
            onChange={(event) =>
              onChange(
                items.map((current) =>
                  current.id === item.id
                    ? {
                        ...current,
                        price: event.target.value,
                      }
                    : current,
                ),
              )
            }
          />

          <IconButton
            label="Видалити тег"
            onClick={() =>
              onChange(items.filter((current) => current.id !== item.id))
            }
          />
        </div>
      ))}
    </div>
  );
}

function EditorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2"
      />
    </div>
  );
}

function IconButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="text-red-600 hover:text-red-700"
    >
      <IconTrash size={17} />
    </Button>
  );
}
