"use client";
import { IconHeartFilled } from "@dniproanimals/icons";
import { Button, cn } from "@dniproanimals/ui";
import { motion } from "motion/react";
import Link from "next/link";

// TODO: daily needs should come from the server (admin-editable).
// See AGENTS.md §7.2.
const NEEDS = [
  {
    value: "50 кг",
    label: "Сухого корму",
    sub: "щодня",
    color: "bg-amber-50 border-amber-200",
  },
  {
    value: "2.5 кг",
    label: "Вологого корму",
    sub: "щодня",
    color: "bg-green-50 border-green-200",
  },
  {
    value: "∞",
    label: "Ліків та вакцин",
    sub: "постійно",
    color: "bg-red-50 border-red-200",
  },
  {
    value: "∞",
    label: "Любові",
    sub: "завжди",
    color: "bg-primary/20 border-primary/40",
  },
];

export function DailyNeedsSection() {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
      <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3 text-center">
        Щоденні потреби
      </p>
      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
        300+ тварин потребують
        <br />
        вашої допомоги
      </h2>
      <p className="text-sm text-gray-medium text-center mb-10 max-w-lg mx-auto">
        Важливо купувати тільки зі списку — це перевірені корми, ліки та засоби
        догляду, які не зашкодять хвостикам
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {NEEDS.map((n, i) => (
          <motion.div
            key={n.label}
            className={cn(n.color, "border rounded-2xl p-6 text-center")}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
              {n.value}
            </p>
            <p className="text-sm font-medium text-foreground">{n.label}</p>
            <p className="text-xs text-gray-medium mt-0.5">{n.sub}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Button asChild variant="primary" size="lg">
          <Link href="/donate">
            <IconHeartFilled size={18} />
            Переглянути список потреб
          </Link>
        </Button>
      </div>
    </div>
  );
}
