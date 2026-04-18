"use client";
import { Card, cn } from "@dniproanimals/ui";
import { motion } from "motion/react";

// TODO: stats are candidates to compute server-side from the DB.
// See AGENTS.md §7.2 / §7.3.
const STATS = [
  { number: "300+", label: "Тварин у притулку", accent: "text-primary" },
  { number: "2015", label: "Рік заснування", accent: "text-blue-400" },
  { number: "23K", label: "Підписників", accent: "text-pink-400" },
  { number: "24/7", label: "Піклування", accent: "text-amber-400" },
];

export function StatsCards() {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 -mt-10 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Card className="bg-white p-5 shadow-lg shadow-black/5 text-center border-0">
              <p className={cn("text-3xl md:text-4xl font-bold", s.accent)}>
                {s.number}
              </p>
              <p className="text-xs text-gray-medium mt-1">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
