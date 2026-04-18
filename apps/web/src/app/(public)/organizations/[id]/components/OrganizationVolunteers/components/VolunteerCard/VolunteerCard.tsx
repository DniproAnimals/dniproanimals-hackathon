import type { Volunteer } from "@dniproanimals/contracts";
import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconMailFilled,
  IconPhoneFilled,
} from "@dniproanimals/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
} from "@dniproanimals/ui";
import { motion } from "motion/react";

interface VolunteerCardProps {
  volunteer: Volunteer;
  index: number;
}

export function VolunteerCard({ volunteer, index }: VolunteerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="p-4 text-center hover:border-primary transition-colors">
        <Avatar className="size-16 mx-auto mb-3 bg-primary/20">
          {volunteer.photo ? (
            <AvatarImage
              src={volunteer.photo}
              alt={volunteer.name}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="text-lg font-bold text-green-secondary bg-primary/20">
            {volunteer.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold text-sm truncate">
          {volunteer.name}
          {volunteer.surname ? ` ${volunteer.surname}` : ""}
        </p>
        {volunteer.description && (
          <p className="text-xs text-gray-medium mt-0.5 line-clamp-2">
            {volunteer.description}
          </p>
        )}
        {(volunteer.phone || volunteer.email) && (
          <div className="mt-2 space-y-0.5">
            {volunteer.phone && (
              <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
                <IconPhoneFilled size={10} />
                {volunteer.phone}
              </p>
            )}
            {volunteer.email && (
              <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
                <IconMailFilled size={10} />
                {volunteer.email}
              </p>
            )}
          </div>
        )}
        <div className="flex justify-center gap-2 mt-2">
          {volunteer.instagram && (
            <Button variant="ghost" size="icon-sm" shape="pill" asChild>
              <a
                href={`https://instagram.com/${volunteer.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-foreground"
              >
                <IconBrandInstagram size={14} />
              </a>
            </Button>
          )}
          {volunteer.telegram && (
            <Button variant="ghost" size="icon-sm" shape="pill" asChild>
              <a
                href={`https://t.me/${volunteer.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-foreground"
              >
                <IconBrandTelegram size={14} />
              </a>
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
