"use client";

import {
  useShelterNeedsQuery,
  useUpdateShelterNeedsMutation,
} from "@/shared/query-hooks";
import type {
  ShelterNeedCard,
  ShelterNeedItem,
  ShelterNeedSubgroup,
} from "@dniproanimals/contracts";
import { IconPlus, IconTrash } from "@dniproanimals/icons";
import { Button, Card, Input, Label } from "@dniproanimals/ui";
import { useEffect, useState } from "react";

const makeId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

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
  icon: "",
  gradient: "#5B7765",
  color: "#5B7765",
  items: [newItem()],
});

export default function MaterialHelpPage() {
  const { data, isLoading } = useShelterNeedsQuery();
  const updateMutation = useUpdateShelterNeedsMutation();
  const [cards, setCards] = useState<ShelterNeedCard[]>([]);

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
        if (card.id !== cardId) return card;
        if (!subgroupId) return { ...card, items };
        return {
          ...card,
          subgroups: card.subgroups?.map((group) =>
            group.id === subgroupId ? { ...group, items } : group,
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
                group.id === subgroupId ? { ...group, ...update } : group,
              ),
            }
          : card,
      ),
    );
  };

  const save = () => updateMutation.mutate({ cards });

  if (isLoading) {
    return <div>Завантаження...</div>;
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
          <IconPlus size={17} /> Додати секцію
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
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
          <IconPlus size={17} /> Додати секцію
        </Button>
      </div>

      {cards.map((card) => (
        <Card
          key={card.id}
          className="space-y-5 rounded-3xl border-gray-100 p-6 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <EditorField
              label="Назва секції"
              value={card.title}
              onChange={(value) => updateCard(card.id, { title: value })}
            />
            <EditorField
              label="URL іконки"
              value={card.icon}
              onChange={(value) => updateCard(card.id, { icon: value })}
            />
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

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold">Теги секції</h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => updateItems(card.id, [...card.items, newItem()])}
              >
                <IconPlus size={15} /> Додати тег
              </Button>
            </div>
            <ItemEditor
              items={card.items}
              onChange={(items) => updateItems(card.id, items)}
            />
          </div>

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
                <IconPlus size={15} /> Додати підсекцію
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
                          updateGroup(card.id, group.id, { title: value })
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
                    onChange={(items) => updateItems(card.id, items, group.id)}
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
                    <IconPlus size={15} /> Додати тег
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-5">
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:text-red-700"
              onClick={() =>
                setCards(cards.filter((item) => item.id !== card.id))
              }
            >
              <IconTrash size={17} /> Видалити секцію
            </Button>
          </div>
        </Card>
      ))}

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
            aria-label={`Назва тегу ${index + 1}`}
            onChange={(event) =>
              onChange(
                items.map((current) =>
                  current.id === item.id
                    ? { ...current, name: event.target.value }
                    : current,
                ),
              )
            }
          />
          <Input
            value={item.price ?? ""}
            placeholder="Ціна"
            aria-label={`Ціна тегу ${index + 1}`}
            onChange={(event) =>
              onChange(
                items.map((current) =>
                  current.id === item.id
                    ? { ...current, price: event.target.value }
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
