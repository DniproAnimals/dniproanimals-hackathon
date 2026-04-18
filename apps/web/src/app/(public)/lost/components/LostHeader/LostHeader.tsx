"use client";
import { CreateLostButton } from "../CreateLostButton";

interface LostHeaderProps {
  onCreate: () => void;
}

export function LostHeader({ onCreate }: LostHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Загублені тварини</h1>
        <p className="text-sm text-gray-medium mt-1">
          Допоможіть знайти господарів
        </p>
      </div>
      <CreateLostButton onClick={onCreate} />
    </div>
  );
}
