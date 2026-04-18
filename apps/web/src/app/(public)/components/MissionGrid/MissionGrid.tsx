"use client";
import { motion } from "motion/react";

// TODO: mission items are a candidate for CMS / admin-editable content.
// See AGENTS.md §7.2.
const MISSIONS = [
  {
    icon: "🏠",
    title: "Усиновлення",
    desc: "Знаходимо люблячі родини для наших підопічних. Кожна тварина проходить огляд та вакцинацію.",
  },
  {
    icon: "🚑",
    title: "Евакуація",
    desc: "Рятуємо тварин із зон бойових дій та обстрілів по всій Україні з 2022 року.",
  },
  {
    icon: "💉",
    title: "Ветеринарія",
    desc: "Лікування, реабілітація, вакцинація та стерилізація — повний цикл ветеринарної допомоги.",
  },
  {
    icon: "🔍",
    title: "Пошук загублених",
    desc: "Платформа для розміщення оголошень про загублених тварин та возз'єднання з господарями.",
  },
  {
    icon: "📚",
    title: "Освіта",
    desc: "Просвіта щодо гуманного та відповідального ставлення до домашніх тварин.",
  },
  {
    icon: "🤝",
    title: "Волонтерство",
    desc: "Координація волонтерів для кормління, вигулу, прибирання та соціалізації тварин.",
  },
];

export function MissionGrid() {
  return (
    <div className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
        <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3 text-center">
          Що ми робимо
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Кожен день — це боротьба за життя
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {MISSIONS.map((item, i) => (
            <motion.div
              key={item.title}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className="font-bold text-base mb-2">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
