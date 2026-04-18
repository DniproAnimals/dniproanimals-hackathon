"use client";
import { Badge, Button } from "@dniproanimals/ui";
import { motion } from "motion/react";
import Link from "next/link";
import { HeroSocialLinks } from "../HeroSocialLinks";

export function HeroIntro() {
  return (
    <motion.div
      className="flex-1 text-center lg:text-left"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Badge
        variant="soft"
        size="lg"
        className="mb-6 border border-primary/40 shadow-sm font-bold"
      >
        <span className="text-lg">🐾</span> Благодійний фонд · м. Дніпро
      </Badge>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
        Ми — <span className="text-green-secondary">DniproAnimals</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
        Рятуємо тих, хто не може попросити про допомогу. Понад 300 тварин у
        нашому притулку щодня отримують шанс на нове життя завдяки небайдужим
        людям.
      </p>
      <HeroSocialLinks />
      <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
        <Button
          asChild
          variant="secondary"
          size="xl"
          className="rounded-2xl shadow-lg hover:-translate-y-1"
        >
          <Link href="/donate">Допомогти притулку</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="xl"
          className="border-2 border-gray-200 hover:border-primary hover:bg-gray-50 rounded-2xl"
        >
          <Link href="/animals">Знайти друга</Link>
        </Button>
      </div>
    </motion.div>
  );
}
