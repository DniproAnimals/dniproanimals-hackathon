"use client";
import { useOrganizationQuery } from "@/shared/query-hooks";
import { motion } from "motion/react";
import { use } from "react";
import { OrganizationAnimals } from "./components/OrganizationAnimals";
import { OrganizationBackButton } from "./components/OrganizationBackButton";
import { OrganizationDonation } from "./components/OrganizationDonation";
import { OrganizationHeader } from "./components/OrganizationHeader";
import { OrganizationLoading } from "./components/OrganizationLoading";
import { OrganizationNotFound } from "./components/OrganizationNotFound";
import { OrganizationVolunteers } from "./components/OrganizationVolunteers";

export default function OrganizationPage(
  props: PageProps<"/organizations/[id]">,
) {
  const params = use(props.params);
  const id = Number(params.id);
  const { data: organization, isLoading } = useOrganizationQuery(id);

  if (isLoading) {
    return <OrganizationLoading />;
  }

  if (!organization) {
    return <OrganizationNotFound />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6"
    >
      <OrganizationBackButton />
      <OrganizationHeader organization={organization} />
      <OrganizationDonation organization={organization} />
      <OrganizationVolunteers orgId={id} />
      <OrganizationAnimals orgId={id} />
    </motion.div>
  );
}
