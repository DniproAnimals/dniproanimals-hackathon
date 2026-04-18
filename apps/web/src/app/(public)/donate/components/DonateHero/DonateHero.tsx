"use client";
import { Badge } from "@dniproanimals/ui";
import { motion } from "motion/react";

export function DonateHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 text-center lg:text-left pt-4 lg:pt-0"
    >
      <Badge
        variant="soft"
        size="lg"
        className="mb-6 border border-primary/40 shadow-sm font-bold"
      >
        <span className="size-2 rounded-full bg-green-secondary animate-pulse" />
        Вбудована система підтримки
      </Badge>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
        Рятуємо життя <span className="text-green-secondary">хвостатих</span>{" "}
        разом.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
        Ваш внесок — це не просто гроші. Це їжа, тепло, і найголовніше — шанс на
        нове щасливе життя для сотень тварин у притулку.
      </p>
    </motion.div>
  );
}
