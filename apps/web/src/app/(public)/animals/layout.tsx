import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Тварини для усиновлення у Дніпрі | DniproAnimals",
  description:
    "Каталог тварин для усиновлення у Дніпрі. Собаки, коти та інші хвостики шукають дім.",
};

export default function AnimalsLayout({ children }: LayoutProps<"/">) {
  return children;
}
