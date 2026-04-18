"use client";
import { AnimalCard } from "@/shared/components/AnimalCard";
import { Animal } from "@dniproanimals/contracts";
import { motion } from "motion/react";
import { AnimalsListEmpty } from "./components/AnimalsListEmpty";
import { AnimalsListSkeleton } from "./components/AnimalsListSkeleton";

interface AnimalsListProps {
  isLoading: boolean;
  animals: Animal[];
}

export function AnimalsList({ animals, isLoading }: AnimalsListProps) {
  if (isLoading) {
    return <AnimalsListSkeleton />;
  }

  if (animals.length === 0) {
    return <AnimalsListEmpty />;
  }

  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {animals.map((animal, i) => (
        <motion.div
          key={animal.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        >
          <AnimalCard animal={animal} index={i} />
        </motion.div>
      ))}
    </motion.div>
  );
}
