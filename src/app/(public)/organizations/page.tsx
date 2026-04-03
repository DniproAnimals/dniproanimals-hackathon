"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageFallback from "@/components/ImageFallback";
import { useUser } from "@/lib/UserContext";
import {
  IconMapPinFilled, IconBrandInstagram, IconBrandTelegram,
  IconBrandFacebook, IconShieldCheckFilled,
} from "@tabler/icons-react";

type Org = {
  id: number; name: string; description: string | null; photo: string | null;
  location: string | null; instagram: string | null; telegram: string | null;
  facebook: string | null; status: string; created_at: string;
};

export default function OrganizationsPage() {
  const { user } = useUser();
  const hasOrg = !!user?.org_id;
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrgs(data.filter((o: Org) => o.status === "approved"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f4e4] text-[#5b7765] text-sm font-bold mb-4 border border-[#ced48c]/40">
          <span className="text-lg">🤝</span> Партнерство
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Організації та Притулки</h1>
        <p className="text-base text-gray-medium max-w-2xl mx-auto mb-6">
          Ми об&apos;єднуємо зусилля з перевіреними притулками та фондами. Підтримайте їх або знайдіть нового друга.
        </p>
        {!hasOrg && (
          <Link href="/organizations/create" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-white font-semibold text-sm hover:bg-foreground/90 transition-colors">
            Зареєструвати свою організацію
          </Link>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-light rounded-2xl animate-pulse h-64" />
          ))}
        </div>
      ) : orgs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-semibold mb-2">Організацій поки немає</p>
          <p className="text-sm text-gray-medium">Будьте першим — зареєструйте свою організацію</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {orgs.map((org) => (
            <Link
              key={org.id}
              href={`/organizations/${org.id}`}
              className="bg-white rounded-2xl border border-gray-border overflow-hidden hover:border-[#ced48c] hover:shadow-md transition-all group"
            >
              {/* Photo */}
              <div className="relative h-40 bg-gray-light">
                {org.photo ? (
                  <ImageFallback src={org.photo} alt={org.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">🏠</div>
                )}
                {org.status === "approved" && (
                  <div className="absolute top-2.5 left-2.5 bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                    <IconShieldCheckFilled size={10} />
                    Перевірено
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1 group-hover:text-[#5b7765] transition-colors">{org.name}</h3>
                {org.location && (
                  <p className="text-xs text-gray-medium flex items-center gap-1 mb-2">
                    <IconMapPinFilled size={12} />
                    {org.location}
                  </p>
                )}
                {org.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{org.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {org.instagram && (
                      <span className="w-8 h-8 rounded-lg bg-gray-light flex items-center justify-center">
                        <IconBrandInstagram size={14} className="text-gray-medium" />
                      </span>
                    )}
                    {org.telegram && (
                      <span className="w-8 h-8 rounded-lg bg-gray-light flex items-center justify-center">
                        <IconBrandTelegram size={14} className="text-gray-medium" />
                      </span>
                    )}
                    {org.facebook && (
                      <span className="w-8 h-8 rounded-lg bg-gray-light flex items-center justify-center">
                        <IconBrandFacebook size={14} className="text-gray-medium" />
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#5b7765] font-medium group-hover:underline">Детальніше →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
