"use client";
import { useAnimalQuery } from "@/shared/query-hooks";
import { motion } from "motion/react";
import { use } from "react";
import { AnimalAttributes } from "./components/AnimalAttributes";
import { AnimalBackButton } from "./components/AnimalBackButton";
import { AnimalContacts } from "./components/AnimalContacts";
import { AnimalDescription } from "./components/AnimalDescription";
import { AnimalDetailHeader } from "./components/AnimalDetailHeader";
import { AnimalDetailSkeleton } from "./components/AnimalDetailSkeleton";
import { AnimalDonationButton } from "./components/AnimalDonationButton";
import { AnimalGallery } from "./components/AnimalGallery";
import { AnimalNotFound } from "./components/AnimalNotFound";

const TYPE_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  other: "🐾",
};

export default function AnimalDetailPageRoute(
  props: PageProps<"/animals/[id]">,
) {
  const params = use(props.params);
  const id = Number(params.id);
  const { data: animal, isLoading } = useAnimalQuery(id);

  if (isLoading) {
    return <AnimalDetailSkeleton />;
  }

  if (!animal) {
    return <AnimalNotFound />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-10">
      <AnimalBackButton />

      <div className="md:grid md:grid-cols-2 md:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AnimalGallery
            photos={animal.photos ?? []}
            alt={animal.name}
            fallbackEmoji={TYPE_EMOJI[animal.type] ?? "🐾"}
          />
          {animal.description && (
            <AnimalDescription text={animal.description} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mt-6 md:mt-0"
        >
          <AnimalDetailHeader animal={animal} />
          <p className="text-sm text-gray-medium mb-5">
            {animal.breed || "Мікс порід"}
          </p>
          <AnimalAttributes animal={animal} />
          <AnimalDonationButton animalId={animal.id} animalName={animal.name} />
          <AnimalContacts animal={animal} />
        </motion.div>
      </div>
    </div>
  );
}
