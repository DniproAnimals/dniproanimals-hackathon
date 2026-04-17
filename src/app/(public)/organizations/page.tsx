"use client";
import ImageFallback from "@/components/ImageFallback";
import { Badge, Button, EmptyState, Skeleton } from "@/components/ui";
import { useUser } from "@/shared/lib/UserContext";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconMapPinFilled,
  IconShieldCheckFilled,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Org = {
  id: number;
  name: string;
  description: string | null;
  photo: string | null;
  location: string | null;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  status: string;
  created_at: string;
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
        if (Array.isArray(data))
          setOrgs(data.filter((o: Org) => o.status === "approved"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <Badge
          variant="soft"
          size="lg"
          className="mb-4 border border-primary/40 font-bold"
        >
          <span className="text-lg">🤝</span> Партнерство
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Організації та Притулки
        </h1>
        <p className="text-base text-gray-medium max-w-2xl mx-auto mb-6">
          Ми об&apos;єднуємо зусилля з перевіреними притулками та фондами.
          Підтримайте їх або знайдіть нового друга.
        </p>
        {!hasOrg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Button asChild variant="secondary" size="lg">
              <Link href="/organizations/create">
                Зареєструвати свою організацію
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* List */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="rounded-2xl h-64" />
          ))}
        </div>
      ) : orgs.length === 0 ? (
        <EmptyState
          title="Організацій поки немає"
          description="Будьте першим — зареєструйте свою організацію"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {orgs.map((org, i) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={`/organizations/${org.id}`}
                className="block bg-white rounded-2xl border border-gray-border overflow-hidden hover:border-primary hover:shadow-md transition-all group"
              >
                {/* Photo */}
                <div className="relative h-40 bg-gray-light">
                  {org.photo ? (
                    <ImageFallback
                      src={org.photo}
                      alt={org.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">
                      🏠
                    </div>
                  )}
                  {org.status === "approved" && (
                    <Badge
                      variant="success"
                      size="sm"
                      className="absolute top-2.5 left-2.5 bg-green-500 text-white font-semibold"
                    >
                      <IconShieldCheckFilled size={10} />
                      Перевірено
                    </Badge>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-green-secondary transition-colors">
                    {org.name}
                  </h3>
                  {org.location && (
                    <p className="text-xs text-gray-medium flex items-center gap-1 mb-2">
                      <IconMapPinFilled size={12} />
                      {org.location}
                    </p>
                  )}
                  {org.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {org.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {org.instagram && (
                        <span className="size-8 rounded-lg bg-gray-light flex items-center justify-center">
                          <IconBrandInstagram
                            size={14}
                            className="text-gray-medium"
                          />
                        </span>
                      )}
                      {org.telegram && (
                        <span className="size-8 rounded-lg bg-gray-light flex items-center justify-center">
                          <IconBrandTelegram
                            size={14}
                            className="text-gray-medium"
                          />
                        </span>
                      )}
                      {org.facebook && (
                        <span className="size-8 rounded-lg bg-gray-light flex items-center justify-center">
                          <IconBrandFacebook
                            size={14}
                            className="text-gray-medium"
                          />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-green-secondary font-medium group-hover:underline">
                      Детальніше →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
