"use client";
import {
  OrganizationForm,
  type OrganizationFormValues,
} from "@/shared/components/OrganizationForm";
import { useCreateOrganizationMutation } from "@/shared/query-hooks";
import { endpoints } from "@dniproanimals/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function OnboardingOrganizationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createOrgMutation = useCreateOrganizationMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.auth.me()] });
      queryClient.invalidateQueries({
        queryKey: [endpoints.organizations.list()],
      });
      router.push("/dashboard");
    },
  });

  const handleSubmit = (values: OrganizationFormValues) => {
    createOrgMutation.mutate(values);
  };

  return (
    <OrganizationForm
      onSubmit={handleSubmit}
      submitting={createOrgMutation.isPending}
      submitLabel="Створити організацію"
    />
  );
}
