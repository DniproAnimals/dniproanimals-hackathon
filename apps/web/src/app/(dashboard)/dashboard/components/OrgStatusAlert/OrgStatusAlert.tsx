"use client";
import { useCurrentOrg } from "@/shared/query-hooks";
import { IconAlertTriangleFilled, IconClockFilled } from "@dniproanimals/icons";

export function OrgStatusAlert() {
  const { org } = useCurrentOrg();

  if (org?.status === "pending") {
    return (
      <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <IconClockFilled size={20} className="text-yellow-500 shrink-0" />
        <p className="text-sm font-medium text-yellow-800">
          Організація на модерації
        </p>
      </div>
    );
  }

  if (org?.status === "rejected") {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
        <IconAlertTriangleFilled
          size={20}
          className="text-destructive shrink-0"
        />
        <p className="text-sm font-medium text-red-800">
          Організацію відхилено
        </p>
      </div>
    );
  }

  return null;
}
