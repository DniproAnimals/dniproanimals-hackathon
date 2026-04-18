"use client";
import { useDebouncedCallback } from "@/shared/hooks";
import { IconSearch } from "@dniproanimals/icons";
import { Input, InputWithIcon } from "@dniproanimals/ui";
import { useState } from "react";

interface SearchFieldProps {
  value: string;
  onChange: (next: string | null) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  inputClassName?: string;
  size?: "sm" | "md";
}

export function SearchField({
  value,
  onChange,
  placeholder = "Пошук...",
  debounceMs = 300,
  inputClassName,
  size,
}: SearchFieldProps) {
  const [draft, setDraft] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(value);
  }

  const commit = useDebouncedCallback((next: string) => {
    onChange(next || null);
  }, debounceMs);

  return (
    <InputWithIcon icon={<IconSearch />}>
      <Input
        type="text"
        placeholder={placeholder}
        value={draft}
        size={size}
        onChange={(e) => {
          setDraft(e.target.value);
          commit(e.target.value);
        }}
        className={inputClassName ?? "bg-white"}
      />
    </InputWithIcon>
  );
}
