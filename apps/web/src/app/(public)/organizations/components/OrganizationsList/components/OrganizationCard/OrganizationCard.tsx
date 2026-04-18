import { ImageFallback } from "@/shared/components/ImageFallback";
import type { Organization } from "@dniproanimals/contracts";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconMapPinFilled,
  IconShieldCheckFilled,
} from "@dniproanimals/icons";
import { Badge } from "@dniproanimals/ui";
import { motion } from "motion/react";
import Link from "next/link";

interface OrganizationCardProps {
  organization: Organization;
  index: number;
}

export function OrganizationCard({
  organization,
  index,
}: OrganizationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        href={`/organizations/${organization.id}`}
        className="block bg-white rounded-2xl border border-gray-border overflow-hidden hover:border-primary hover:shadow-md transition-all group"
      >
        <div className="relative h-40 bg-gray-light">
          {organization.photo ? (
            <ImageFallback
              src={organization.photo}
              alt={organization.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">
              🏠
            </div>
          )}
          {organization.status === "approved" && (
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

        <div className="p-5">
          <h3 className="font-bold text-lg mb-1 group-hover:text-green-secondary transition-colors">
            {organization.name}
          </h3>
          {organization.location && (
            <p className="text-xs text-gray-medium flex items-center gap-1 mb-2">
              <IconMapPinFilled size={12} />
              {organization.location}
            </p>
          )}
          {organization.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {organization.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {organization.instagram && (
                <span className="size-8 rounded-lg bg-gray-light flex items-center justify-center">
                  <IconBrandInstagram size={14} className="text-gray-medium" />
                </span>
              )}
              {organization.telegram && (
                <span className="size-8 rounded-lg bg-gray-light flex items-center justify-center">
                  <IconBrandTelegram size={14} className="text-gray-medium" />
                </span>
              )}
              {organization.facebook && (
                <span className="size-8 rounded-lg bg-gray-light flex items-center justify-center">
                  <IconBrandFacebook size={14} className="text-gray-medium" />
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
  );
}
