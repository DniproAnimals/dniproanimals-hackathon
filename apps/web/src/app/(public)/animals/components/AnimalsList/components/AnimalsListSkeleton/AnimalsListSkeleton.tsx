import { repeat } from "@/shared/utils";
import { Skeleton } from "@dniproanimals/ui";
import { motion } from "motion/react";

export function AnimalsListSkeleton() {
  return (
    <motion.div
      key="skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {repeat(6).map((_, i) => (
        <div key={i}>
          <Skeleton className="rounded-2xl aspect-square" />
          <Skeleton className="mt-2.5 h-4 rounded-lg w-2/3" />
          <Skeleton className="mt-1.5 h-3 rounded-lg w-1/2" />
        </div>
      ))}
    </motion.div>
  );
}
