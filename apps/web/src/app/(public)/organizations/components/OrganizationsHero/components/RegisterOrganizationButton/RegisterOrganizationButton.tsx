"use client";
import { useMeQuery } from "@/shared/query-hooks";
import { Button } from "@dniproanimals/ui";
import { motion } from "motion/react";
import Link from "next/link";

export function RegisterOrganizationButton() {
  const { data: user } = useMeQuery();
  const hasOrg = !!user?.orgId;

  if (hasOrg) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Button asChild variant="secondary" size="lg">
        <Link href="/organizations/create">Зареєструвати свою організацію</Link>
      </Button>
    </motion.div>
  );
}
