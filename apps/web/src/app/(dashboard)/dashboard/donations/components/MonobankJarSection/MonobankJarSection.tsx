"use client";
import { useCurrentOrg, useUpdateJarMutation } from "@/shared/query-hooks";
import { IconCoin } from "@dniproanimals/icons";
import { Card, Form } from "@dniproanimals/ui";
import { useEffect, useState } from "react";
import { parseJarId } from "../../utils/parseJarId";
import { JarDetectedBadge } from "./components/JarDetectedBadge";
import { JarLinkField } from "./components/JarLinkField";
import { JarSaveAction } from "./components/JarSaveAction";
import { useDonateForm } from "./hooks/useDonateForm";
import type { DonateFormValues } from "./schema";

const SAVED_FLASH_MS = 3000;

function toJarUrl(jarId: string | null | undefined): string {
  return jarId ? `https://send.monobank.ua/jar/${jarId}` : "";
}

export function MonobankJarSection() {
  const { org, refetch: refreshOrg } = useCurrentOrg();
  const initialUrl = toJarUrl(org?.monobankJarId);
  const form = useDonateForm({ url: initialUrl });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    form.reset({ url: initialUrl });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  const mutation = useUpdateJarMutation({
    onSuccess: () => {
      setSaved(true);
      refreshOrg();
      setTimeout(() => setSaved(false), SAVED_FLASH_MS);
    },
  });

  const handleSubmit = (values: DonateFormValues) => {
    setSaved(false);
    mutation.mutate({ monobankJarId: parseJarId(values.url) });
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-10 rounded-xl bg-secondary/5 flex items-center justify-center">
          <IconCoin size={22} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Monobank Банка</h2>
          <p className="text-xs text-gray-medium">
            Підключіть банку, щоб отримувати пожертви
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <JarLinkField />
          <JarDetectedBadge />
          <JarSaveAction submitting={mutation.isPending} saved={saved} />
        </form>
      </Form>
    </Card>
  );
}
