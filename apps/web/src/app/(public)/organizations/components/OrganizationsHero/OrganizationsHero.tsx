"use client";
import { Badge } from "@dniproanimals/ui";
import { motion } from "motion/react";
import { RegisterOrganizationButton } from "./components/RegisterOrganizationButton";

export function OrganizationsHero() {
  return (
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
      <RegisterOrganizationButton />
    </motion.div>
  );
}
