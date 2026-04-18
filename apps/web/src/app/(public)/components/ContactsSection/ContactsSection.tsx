"use client";
import {
  IconMailFilled,
  IconMapPinFilled,
  IconPhoneFilled,
} from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { motion } from "motion/react";
import { ContactRow } from "./components/ContactRow";

// TODO: contacts should come from the server (admin-editable).
// See AGENTS.md §7.2.

export function ContactsSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
      <motion.div
        className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold mb-8 text-foreground">
            Чекаємо в гості!
          </h2>
          <div className="space-y-6">
            <ContactRow
              icon={<IconMapPinFilled size={20} />}
              label="Адреса притулку"
            >
              <p className="text-lg font-bold text-gray-800">
                м. Дніпро, вул. Героїв Дніпра
              </p>
            </ContactRow>
            <ContactRow
              icon={<IconPhoneFilled size={20} />}
              label="Телефон керівника"
            >
              <a
                href="tel:+380966601817"
                className="text-lg font-bold text-gray-800 hover:text-green-secondary"
              >
                +380 96 660 18 17
              </a>
            </ContactRow>
            <ContactRow icon={<IconMailFilled size={20} />} label="Email">
              <a
                href="mailto:dniproanimals.org@gmail.com"
                className="text-lg font-bold text-gray-800 hover:text-green-secondary"
              >
                dniproanimals.org@gmail.com
              </a>
            </ContactRow>
          </div>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="mt-8 w-full sm:w-auto self-start shadow-md"
          >
            <a
              href="https://www.google.com/maps/search/?api=1&query=вул.+Героїв+Дніпра,+Дніпро"
              target="_blank"
              rel="noopener noreferrer"
            >
              Відкрити на карті
            </a>
          </Button>
        </div>
        <div className="md:w-1/2 bg-gray-100 min-h-75 relative">
          <iframe
            title="Розташування DniproAnimals"
            width="100%"
            height="100%"
            className="absolute inset-0"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=вул.+Героїв+Дніпра,+Дніпро,+Україна&output=embed&z=14"
          />
        </div>
      </motion.div>
    </div>
  );
}
