"use client";
import { SocialLinksIcons } from "@/shared/components/Contacts/SocialLinks";
import { motion } from "motion/react";

// TODO: founder info should come from the server.
// See AGENTS.md §7.2.

export function FounderQuote() {
  return (
    <div className="bg-primary/10">
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="size-20 rounded-full bg-primary mx-auto flex items-center justify-center text-4xl mb-6">
            🐾
          </div>
          <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6 italic">
            &laquo;Ми — невелика команда волонтерів, яка робить все можливе для
            порятунку тварин. Наш притулок завжди відкритий для тих, хто хоче
            навістити наших мешканців.&raquo;
          </blockquote>
          <p className="text-base font-bold text-foreground">Інесса Капінус</p>
          <p className="text-sm text-gray-medium">
            Засновниця БО &laquo;Дніпро Енімалс&raquo;
          </p>
          <SocialLinksIcons />
        </motion.div>
      </div>
    </div>
  );
}
