"use client";
import { motion } from "motion/react";
import Image from "next/image";

// TODO: story copy is a candidate for CMS / admin-editable content.
// See AGENTS.md §7.2.

export function StorySection() {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 py-20 md:py-28">
      <div className="md:flex md:gap-16 md:items-center">
        <motion.div
          className="flex-1 mb-10 md:mb-0"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
            Наша історія
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Від волонтерки до фонду, що рятує сотні життів
          </h2>
          <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed">
            <p>
              <strong className="text-foreground">Інесса Капінус</strong>{" "}
              заснувала DniproAnimals у 2015 році. Спочатку це була ініціатива
              однієї волонтерки — сьогодні це зареєстрований фонд з командою,
              притулком та понад 300 підопічними.
            </p>
            <p>
              Притулок розташований на{" "}
              <strong className="text-foreground">вул. Героїв Дніпра</strong> і
              повністю існує за рахунок пожертвувань — жодного державного
              фінансування.
            </p>
            <p>
              З 2022 року фонд активно евакуює поранених та покинутих тварин із
              зон бойових дій по всій Україні.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="md:w-96 shrink-0"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="rounded-3xl overflow-hidden">
              <Image
                src="/logo.jpg"
                alt="DniproAnimals"
                width={384}
                height={384}
                className="w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary rounded-2xl px-5 py-3 shadow-lg">
              <p className="text-sm font-bold text-foreground">З 2015 року</p>
              <p className="text-xs text-foreground/60">рятуємо тварин</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
