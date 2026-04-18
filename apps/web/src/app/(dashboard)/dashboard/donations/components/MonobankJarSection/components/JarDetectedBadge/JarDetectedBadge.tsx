"use client";
import { IconCheck } from "@dniproanimals/icons";
import { useWatch } from "react-hook-form";
import { parseJarId } from "../../../../utils/parseJarId";
import { useDonateFormContext } from "../../hooks/useDonateForm";

export function JarDetectedBadge() {
  const { control } = useDonateFormContext();
  const url = useWatch({ control, name: "url" });
  const jarId = parseJarId(url ?? "");
  if (!jarId) return null;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
      <IconCheck size={16} className="text-green-600 shrink-0" />
      <p className="text-xs text-green-700">Банку розпізнано: {jarId}</p>
    </div>
  );
}
