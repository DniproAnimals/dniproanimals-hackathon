"use client";
import { SearchField } from "@/shared/components/SearchField";
import { useVolunteersFilterState } from "../../../../hooks/useVolunteersFilterState";

export function VolunteersSearchField() {
  const [params, setParams] = useVolunteersFilterState();

  return (
    <SearchField value={params.vq ?? ""} onChange={(vq) => setParams({ vq })} />
  );
}
