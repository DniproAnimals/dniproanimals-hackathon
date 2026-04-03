"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import ImageFallback from "@/components/ImageFallback";
import AnimalCard from "@/components/AnimalCard";
import type { Animal } from "@/lib/db";
import {
  IconMapPinFilled, IconPhoneFilled, IconMailFilled,
  IconBrandInstagram, IconBrandTelegram, IconBrandFacebook,
  IconWorldWww, IconChevronLeft, IconUsersGroup, IconPawFilled,
  IconCalendarFilled, IconShieldCheckFilled, IconHeartHandshake,
} from "@tabler/icons-react";

type Org = {
  id: number; name: string; description: string | null; photo: string | null;
  location: string | null; phone: string | null; email: string | null;
  instagram: string | null; telegram: string | null; facebook: string | null;
  website: string | null; owner_id: number; status: string; created_at: string;
  monobank_jar_id: string | null;
};

type Volunteer = {
  id: number; name: string; surname: string | null; photo: string | null;
  description: string | null; phone: string | null; email: string | null;
  instagram: string | null; telegram: string | null;
};

export default function OrganizationPage() {
  const { id } = useParams();
  const [org, setOrg] = useState<Org | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/organizations/${id}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/organizations/${id}/volunteers`).then((r) => r.ok ? r.json() : []),
      fetch(`/api/organizations/${id}/animals`).then((r) => r.ok ? r.json() : []),
    ]).then(([orgData, volData, animalData]) => {
      setOrg(orgData);
      if (Array.isArray(volData)) setVolunteers(volData);
      if (Array.isArray(animalData)) setAnimals(animalData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-light rounded-2xl" />
          <div className="h-8 bg-gray-light rounded-lg w-1/3" />
          <div className="h-4 bg-gray-light rounded-lg w-2/3" />
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-lg font-semibold mb-2">Організацію не знайдено</p>
        <Link href="/organizations" className="text-sm text-[#5b7765] hover:underline">← Повернутися до списку</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6"
    >
      {/* Back */}
      <Link href="/organizations" className="inline-flex items-center gap-1.5 text-gray-medium hover:text-foreground transition-colors text-sm mb-6">
        <IconChevronLeft size={18} />
        Організації
      </Link>

      {/* Hero — photo + meta */}
      <div className="md:flex md:gap-8 mb-10">
        {/* Photo */}
        <div className="md:w-80 flex-shrink-0 mb-6 md:mb-0">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-light">
            {org.photo ? (
              <ImageFallback src={org.photo} alt={org.name} fill className="object-cover" sizes="320px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">🏠</div>
            )}
            {org.status === "approved" && (
              <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <IconShieldCheckFilled size={12} />
                Перевірено
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{org.name}</h1>

          {org.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{org.description}</p>
          )}

          {/* Info list */}
          <div className="divide-y divide-gray-border mb-5">
            {org.location && (
              <div className="flex items-center gap-2.5 py-2.5">
                <IconMapPinFilled size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium">Місцезнаходження</span>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(org.location)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-medium ml-auto hover:underline">{org.location}</a>
              </div>
            )}
            {org.phone && (
              <div className="flex items-center gap-2.5 py-2.5">
                <IconPhoneFilled size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium">Телефон</span>
                <a href={`tel:${org.phone}`} className="text-sm text-gray-medium ml-auto hover:underline">{org.phone}</a>
              </div>
            )}
            {org.email && (
              <div className="flex items-center gap-2.5 py-2.5">
                <IconMailFilled size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium">Email</span>
                <a href={`mailto:${org.email}`} className="text-sm text-gray-medium ml-auto hover:underline">{org.email}</a>
              </div>
            )}
            <div className="flex items-center gap-2.5 py-2.5">
              <IconCalendarFilled size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium">На платформі з</span>
              <span className="text-sm text-gray-medium ml-auto">{new Date(org.created_at).toLocaleDateString("uk-UA", { month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* Social links */}
          {(org.instagram || org.telegram || org.facebook || org.website) && (
            <div className="flex gap-2 flex-wrap">
              {org.instagram && (
                <a href={`https://instagram.com/${org.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-light text-sm hover:bg-[#ced48c]/20 transition-colors">
                  <IconBrandInstagram size={16} className="text-gray-medium" />
                  {org.instagram}
                </a>
              )}
              {org.telegram && (
                <a href={`https://t.me/${org.telegram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-light text-sm hover:bg-[#ced48c]/20 transition-colors">
                  <IconBrandTelegram size={16} className="text-gray-medium" />
                  {org.telegram}
                </a>
              )}
              {org.facebook && (
                <a href={`https://facebook.com/${org.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-light text-sm hover:bg-[#ced48c]/20 transition-colors">
                  <IconBrandFacebook size={16} className="text-gray-medium" />
                  {org.facebook}
                </a>
              )}
              {org.website && (
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-light text-sm hover:bg-[#ced48c]/20 transition-colors">
                  <IconWorldWww size={16} className="text-gray-medium" />
                  Вебсайт
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Donate */}
      {org.monobank_jar_id && (
        <div className="mb-10 p-6 rounded-3xl bg-gradient-to-br from-[#f2f4e4] to-[#e8ebd4] border border-[#ced48c]/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#ced48c] rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 blur-[60px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#5b7765] flex items-center justify-center">
                <IconHeartHandshake size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0c1014]">Допомогти організації</h2>
                <p className="text-xs text-[#5b7765]">Кожна гривня рятує життя тварин</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Ви можете підтримати <b>{org.name}</b> фінансово через Monobank банку. Кошти йдуть на корм, ліки та утримання тварин.
            </p>
            <div className="flex flex-wrap gap-3">
              {[100, 250, 500].map((sum) => (
                <a
                  key={sum}
                  href={`https://send.monobank.ua/jar/${org.monobank_jar_id}?amount=${sum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#ced48c] text-sm font-bold text-[#5b7765] hover:bg-[#ced48c] hover:text-[#0c1014] transition-all"
                >
                  {sum} ₴
                </a>
              ))}
              <a
                href={`https://send.monobank.ua/jar/${org.monobank_jar_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#0c1014] text-sm font-bold text-white hover:bg-[#1a232c] transition-all"
              >
                Інша сума
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Volunteers */}
      {volunteers.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <IconUsersGroup size={20} className="text-[#ced48c]" />
            <h2 className="text-xl font-bold">Команда</h2>
            <span className="text-sm text-gray-medium">({volunteers.length})</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {volunteers.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-border p-4 text-center hover:border-[#ced48c] transition-colors"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden relative bg-[#ced48c]/20">
                  {v.photo ? (
                    <ImageFallback src={v.photo} alt={v.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[#5b7765]">{v.name.charAt(0)}</div>
                  )}
                </div>
                <p className="font-semibold text-sm truncate">{v.name}{v.surname ? ` ${v.surname}` : ""}</p>
                {v.description && <p className="text-xs text-gray-medium mt-0.5 line-clamp-2">{v.description}</p>}
                {(v.phone || v.email) && (
                  <div className="mt-2 space-y-0.5">
                    {v.phone && <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1"><IconPhoneFilled size={10} />{v.phone}</p>}
                    {v.email && <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1"><IconMailFilled size={10} />{v.email}</p>}
                  </div>
                )}
                <div className="flex justify-center gap-2 mt-2">
                  {v.instagram && (
                    <a href={`https://instagram.com/${v.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-foreground"><IconBrandInstagram size={14} /></a>
                  )}
                  {v.telegram && (
                    <a href={`https://t.me/${v.telegram}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-foreground"><IconBrandTelegram size={14} /></a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Animals */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <IconPawFilled size={20} className="text-[#ced48c]" />
          <h2 className="text-xl font-bold">Тварини</h2>
          <span className="text-sm text-gray-medium">({animals.length})</span>
        </div>
        {animals.length === 0 ? (
          <div className="bg-gray-light rounded-2xl p-10 text-center">
            <p className="text-sm text-gray-medium">Організація ще не додала тварин</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {animals.map((animal, i) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <AnimalCard animal={animal} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
