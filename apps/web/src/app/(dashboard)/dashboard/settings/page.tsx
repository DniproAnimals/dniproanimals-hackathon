"use client";
import {
  OrganizationForm,
  organizationToFormValues,
  type OrganizationFormValues,
} from "@/shared/components/OrganizationForm";
import {
  useCurrentOrg,
  useUpdateOwnOrganizationMutation,
} from "@/shared/query-hooks";
import { IconCheck } from "@dniproanimals/icons";
import { useState } from "react";

export default function SettingsPage() {
  const { org, isOwner, refetch: refreshOrg } = useCurrentOrg();
  const [saved, setSaved] = useState(false);

  const updateMutation = useUpdateOwnOrganizationMutation({
    onSuccess: () => {
      setSaved(true);
      refreshOrg();
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (!isOwner) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Налаштування
        </h1>
        <p className="text-gray-medium">
          Тільки власник організації може змінювати налаштування.
        </p>
      </div>
    );
  }

  if (!org) return null;

  const handleSubmit = (values: OrganizationFormValues) => {
    setSaved(false);
    updateMutation.mutate(values);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Налаштування організації
        </h1>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <IconCheck size={16} />
            Збережено!
          </span>
        )}
      </div>

      <OrganizationForm
        key={org.id}
        defaultValues={organizationToFormValues(org)}
        onSubmit={handleSubmit}
        submitting={updateMutation.isPending}
        submitLabel="Зберегти зміни"
      />
    </div>
  );
}
