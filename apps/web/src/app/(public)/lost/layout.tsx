import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Загублені тварини у Дніпрі | DniproAnimals",
  description:
    "Допоможіть знайти господарів для загублених тварин у Дніпрі. Оголошення про зниклих собак, котів та інших хвостиків.",
};

export default function LostLayout({ children }: PropsWithChildren) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">{children}</div>
  );
}
