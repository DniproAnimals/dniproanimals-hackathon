"use client";
import AnimalCard from "@/shared/components/AnimalCard";
import { useOrganizationAnimalsQuery } from "@/shared/query-hooks";
import { IconPawFilled } from "@dniproanimals/icons";
import { motion } from "motion/react";

interface OrganizationAnimalsProps {
  orgId: number;
}

export function OrganizationAnimals({ orgId }: OrganizationAnimalsProps) {
  const { data: animals = [] } = useOrganizationAnimalsQuery(orgId);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <IconPawFilled size={20} className="text-primary" />
        <h2 className="text-xl font-bold">Тварини</h2>
        <span className="text-sm text-gray-medium">({animals.length})</span>
      </div>
      {animals.length === 0 ? (
        <div className="bg-gray-light rounded-2xl p-10 text-center">
          <p className="text-sm text-gray-medium">
            Організація ще не додала тварин
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {animals.map((animal, index) => (
            <motion.div
              key={animal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <AnimalCard animal={animal} index={index} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
