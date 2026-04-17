"use client";
import { Badge, Button, Card, Input } from "@/components/ui";
import {
  IconCheck,
  IconCoin,
  IconCopy,
  IconExternalLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useDashboard } from "../layout";

export default function DonationsPage() {
  const { org, isOwner } = useDashboard();
  const [jarId, setJarId] = useState(org?.monobank_jar_id ?? "");
  const [jarInput, setJarInput] = useState(
    org?.monobank_jar_id
      ? `https://send.monobank.ua/jar/${org.monobank_jar_id}`
      : "",
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncedOrgJar, setSyncedOrgJar] = useState(org?.monobank_jar_id);

  if (org?.monobank_jar_id !== syncedOrgJar) {
    setSyncedOrgJar(org?.monobank_jar_id);
    if (org?.monobank_jar_id) {
      setJarId(org.monobank_jar_id);
      setJarInput(`https://send.monobank.ua/jar/${org.monobank_jar_id}`);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/organizations/jar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monobank_jar_id: jarId || null }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleInputChange = (val: string) => {
    setJarInput(val);
    const trimmed = val.trim();
    const match = trimmed.match(/send\.monobank\.ua\/jar\/([A-Za-z0-9]+)/);
    setJarId(match ? match[1] : "");
  };

  const donateUrl = jarId
    ? `${window.location.origin}/organizations/${org?.id}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(donateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOwner) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-4">Пожертви</h1>
        <p className="text-gray-medium">
          Тільки власник організації може налаштовувати прийом пожертв.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Пожертви</h1>

      {/* Monobank setup */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="size-10 rounded-xl bg-secondary/5 flex items-center justify-center">
            <IconCoin size={22} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Monobank Банка
            </h2>
            <p className="text-xs text-gray-medium">
              Підключіть банку, щоб отримувати пожертви на сторінці організації
              та на сторінці донатів
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-medium mb-1.5">
              Посилання на банку
            </p>
            <Input
              type="text"
              placeholder="https://send.monobank.ua/jar/jjJbZRhoQ"
              value={jarInput}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <p className="text-xs text-gray-medium mt-1.5">
              Вставте посилання з додатку Monobank (Банка → Поділитися)
            </p>
          </div>

          {jarId && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
              <IconCheck size={16} className="text-green-600 shrink-0" />
              <p className="text-xs text-green-700">
                Банку розпізнано:{" "}
                <a
                  href={`https://send.monobank.ua/jar/${jarId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  send.monobank.ua/jar/{jarId}
                </a>
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Збереження..." : "Зберегти"}
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <IconCheck size={16} />
                Збережено!
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Other donation methods — Coming Soon */}
      <Card className="p-6 mb-6">
        <h3 className="font-bold text-foreground mb-4">
          Інші способи допомоги
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: "PayPal",
              icon: "💳",
              color: "from-[#003087] to-[#001D4F]",
            },
            {
              name: "Patreon",
              icon: "♥️",
              color: "from-[#FF424D] to-[#E91E63]",
            },
            {
              name: "Buy Me a Coffee",
              icon: "☕",
              color: "from-[#FFDD00] to-[#F1C40F]",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="relative rounded-2xl bg-linear-to-br p-4 border border-gray-border overflow-hidden opacity-60"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-bold text-foreground text-sm">
                    {item.name}
                  </p>
                  <Badge
                    variant="soft"
                    size="sm"
                    className="mt-1 uppercase tracking-wider text-green-secondary"
                  >
                    Soon
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* How it works */}
      {jarId && (
        <>
          <Card className="p-6 mb-6">
            <h3 className="font-bold text-foreground mb-3">Як це працює?</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="size-7 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-green-secondary shrink-0">
                  1
                </div>
                <p className="text-sm text-foreground">
                  На сторінці вашої організації з&apos;являється секція
                  &quot;Допомогти організації&quot; з кнопками сум
                </p>
              </div>
              <div className="flex gap-3">
                <div className="size-7 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-green-secondary shrink-0">
                  2
                </div>
                <p className="text-sm text-foreground">
                  На загальній сторінці донатів ваша організація також доступна
                  для пожертв
                </p>
              </div>
              <div className="flex gap-3">
                <div className="size-7 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-green-secondary shrink-0">
                  3
                </div>
                <p className="text-sm text-foreground">
                  Донор натискає кнопку → відкривається Monobank з обраною сумою
                  → кошти йдуть на вашу банку
                </p>
              </div>
            </div>
          </Card>

          {/* Share link */}
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-3">Поділитися</h3>
            <p className="text-sm text-gray-medium mb-3">
              Надішліть це посилання донорам — на сторінці є кнопки для швидких
              пожертв:
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border text-sm text-foreground truncate">
                {donateUrl}
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={copyLink}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <IconCheck size={14} /> Скопійовано
                  </>
                ) : (
                  <>
                    <IconCopy size={14} /> Копіювати
                  </>
                )}
              </Button>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mt-3 text-green-secondary hover:bg-transparent hover:underline"
            >
              <Link
                href={`/organizations/${org?.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconExternalLink size={14} />
                Переглянути сторінку організації
              </Link>
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}
