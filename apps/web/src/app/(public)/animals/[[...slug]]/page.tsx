import { apiClient } from "@/shared/api-client";
import type {
  Animal,
  AnimalSex,
  AnimalSize,
  AnimalType,
} from "@dniproanimals/contracts";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnimalDetail from "./AnimalDetail";
import CatalogContent from "./CatalogContent";

const typeSlugToValue: Record<string, AnimalType> = {
  dogs: "dog",
  cats: "cat",
  other: "other",
};
const typeValueToSlug: Record<string, string> = {
  dog: "dogs",
  cat: "cats",
  other: "other",
};
const sexSlugs = new Set<string>(["male", "female"]);
const sizeSlugs = new Set<string>(["small", "medium", "large"]);

const typeLabels: Record<string, string> = {
  dog: "Собаки",
  cat: "Коти",
  other: "Інші тварини",
};
const typeGenitive: Record<string, string> = {
  dog: "собак",
  cat: "котів",
  other: "тварин",
};
const sexLabels: Record<string, string> = {
  male: "хлопчики",
  female: "дівчинки",
};
const sexAdjective: Record<string, Record<string, string>> = {
  dog: { male: "собаки-хлопчики", female: "собаки-дівчинки" },
  cat: { male: "коти-хлопчики", female: "коти-дівчинки" },
  other: { male: "тварини-хлопчики", female: "тварини-дівчинки" },
};
const sizeLabels: Record<string, string> = {
  small: "маленькі",
  medium: "середні",
  large: "великі",
};
const sizeLabelsCap: Record<string, string> = {
  small: "Маленькі",
  medium: "Середні",
  large: "Великі",
};

type Filters = { type: AnimalType; sex?: AnimalSex; size?: AnimalSize };

function parseSlug(slug: string[]): Filters | null {
  if (slug.length === 0 || slug.length > 3) return null;
  const type = typeSlugToValue[slug[0]!];
  if (!type) return null;
  const filters: Filters = { type };
  for (let i = 1; i < slug.length; i++) {
    const part = slug[i]!;
    if (sexSlugs.has(part) && !filters.sex) filters.sex = part as AnimalSex;
    else if (sizeSlugs.has(part) && !filters.size)
      filters.size = part as AnimalSize;
    else return null;
  }
  return filters;
}

function buildTitle(filters: Filters): string {
  const parts: string[] = [];
  if (filters.size) parts.push(sizeLabelsCap[filters.size]!);
  if (filters.sex) parts.push(sexAdjective[filters.type]![filters.sex]!);
  else parts.push(typeLabels[filters.type]!.toLowerCase());
  const t = parts.join(" ");
  return `${t.charAt(0).toUpperCase() + t.slice(1)} для усиновлення у Дніпрі | DniproAnimals`;
}

function buildDescription(filters: Filters): string {
  const extras: string[] = [];
  if (filters.size) extras.push(sizeLabels[filters.size]!);
  if (filters.sex) extras.push(sexLabels[filters.sex]!);
  const suffix = extras.length ? ` (${extras.join(", ")})` : "";
  return `Каталог ${typeGenitive[filters.type]}${suffix} для усиновлення у Дніпрі. Знайдіть свого нового хвостатого друга у притулку DniproAnimals.`;
}

function buildH1(filters: Filters): string {
  const parts: string[] = [];
  if (filters.size) parts.push(sizeLabelsCap[filters.size]!);
  if (filters.sex) parts.push(sexAdjective[filters.type]![filters.sex]!);
  else parts.push(typeLabels[filters.type]!.toLowerCase());
  const h1 = parts.join(" ");
  return `${h1.charAt(0).toUpperCase() + h1.slice(1)} для усиновлення`;
}

function getRelatedLinks(filters: Filters): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = [];
  const ts = typeValueToSlug[filters.type]!;
  for (const [v, s] of Object.entries(typeValueToSlug)) {
    if (v !== filters.type)
      links.push({ href: `/animals/${s}`, label: typeLabels[v]! });
  }
  if (!filters.sex) {
    links.push({
      href: `/animals/${ts}/male`,
      label: `${typeLabels[filters.type]}-хлопчики`,
    });
    links.push({
      href: `/animals/${ts}/female`,
      label: `${typeLabels[filters.type]}-дівчинки`,
    });
  }
  if (!filters.size) {
    for (const sz of ["small", "medium", "large"] as const) {
      const p = filters.sex
        ? `/animals/${ts}/${filters.sex}/${sz}`
        : `/animals/${ts}/${sz}`;
      links.push({
        href: p,
        label: `${sizeLabelsCap[sz]} ${typeLabels[filters.type]!.toLowerCase()}`,
      });
    }
  }
  if (filters.sex || filters.size)
    links.push({
      href: `/animals/${ts}`,
      label: `Усі ${typeLabels[filters.type]!.toLowerCase()}`,
    });
  links.push({ href: "/animals", label: "Усі тварини" });
  return links;
}

export function generateStaticParams() {
  const types = ["dogs", "cats", "other"];
  const sexes = ["male", "female"];
  const sizes = ["small", "medium", "large"];
  const params: { slug?: string[] }[] = [{ slug: undefined }];
  for (const t of types) {
    params.push({ slug: [t] });
    for (const s of sexes) {
      params.push({ slug: [t, s] });
      for (const sz of sizes) params.push({ slug: [t, s, sz] });
    }
    for (const sz of sizes) params.push({ slug: [t, sz] });
  }
  return params;
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return {
      title: "Тварини для усиновлення у Дніпрі | DniproAnimals",
      description:
        "Каталог тварин для усиновлення у Дніпрі. Собаки, коти та інші хвостики шукають дім.",
    };
  }

  if (slug.length === 1 && /^\d+$/.test(slug[0]!)) {
    try {
      const animal = await apiClient.animals.get(Number(slug[0]));
      const tw =
        animal.type === "dog"
          ? "собака"
          : animal.type === "cat"
            ? "кіт"
            : "тварина";
      return {
        title: `${animal.name} — ${tw} для усиновлення | DniproAnimals`,
        description: `${animal.name} — ${animal.breed || "мікс порід"} шукає дім у Дніпрі.`,
      };
    } catch {
      return { title: "Тварину не знайдено | DniproAnimals" };
    }
  }

  const filters = parseSlug(slug);
  if (!filters) return {};
  return {
    title: buildTitle(filters),
    description: buildDescription(filters),
    alternates: { canonical: `/animals/${slug.join("/")}` },
  };
}

async function fetchAnimals(filters: Filters | null): Promise<Animal[]> {
  try {
    return await apiClient.animals.list({
      type: filters?.type,
      sex: filters?.sex,
      size: filters?.size,
    });
  } catch {
    return [];
  }
}

export default async function AnimalSlugPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    const animals = await fetchAnimals(null);
    return (
      <CatalogContent
        initialAnimals={animals}
        slugType={null}
        slugSex={null}
        slugSize={null}
      />
    );
  }

  if (slug.length === 1 && /^\d+$/.test(slug[0]!)) {
    return <AnimalDetail id={slug[0]!} />;
  }

  const filters = parseSlug(slug);
  if (!filters) return notFound();

  const animals = await fetchAnimals(filters);
  const relatedLinks = getRelatedLinks(filters);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: buildH1(filters),
    description: buildDescription(filters),
    numberOfItems: animals.length,
    provider: { "@type": "Organization", name: "DniproAnimals" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-gray-medium mb-4"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Головна
          </Link>
          <span>/</span>
          <Link href="/animals" className="hover:text-foreground transition-colors">
            Тварини
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            {typeLabels[filters.type]}
          </span>
        </nav>
      </div>

      <CatalogContent
        initialAnimals={animals}
        slugType={filters.type}
        slugSex={filters.sex || null}
        slugSize={filters.size || null}
        seoH1={buildH1(filters)}
        seoDescription={buildDescription(filters)}
      />

      <div className="max-w-6xl mx-auto px-6 pb-6">
        <div className="border-t border-gray-border pt-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Дивіться також
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 bg-gray-light rounded-lg text-xs font-medium text-gray-medium hover:text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
