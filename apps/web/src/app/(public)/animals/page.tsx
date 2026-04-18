import type { Metadata } from "next";
import { CatalogContent } from "./components/CatalogContent";

export const metadata: Metadata = {
  title: "Тварини для усиновлення у Дніпрі | DniproAnimals",
  description:
    "Каталог тварин для усиновлення у Дніпрі. Собаки, коти та інші хвостики шукають дім.",
};

export default async function AnimalsPage() {
  return <CatalogContent />;
}
