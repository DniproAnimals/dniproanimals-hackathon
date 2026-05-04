# SEO

Setup for indexable pages: metadata, sitemap, robots, structured data.

> **Status: aspirational.** Today, `apps/web` ships **only the root `metadata` export** in `app/layout.tsx`. There is no `sitemap.ts`, no `robots.ts`, no JSON-LD, no `viewport` export, and per-page `generateMetadata` is not in use. The patterns below are the target — work toward them when SEO becomes a priority for a route, especially on the public side.

## What's actually in the repo today

```ts
// apps/web/src/app/layout.tsx
export const metadata: Metadata = {
  title: "DniproAnimals — Притулок для тварин у Дніпрі",
  description:
    "Благодійний фонд DniproAnimals. Допомога безхатнім тваринам, усиновлення, волонтерство.",
};
```

That's the whole SEO surface for now. Most pages are `"use client"`, so crawlers see the shell + this metadata.

## Quick audit

When the routes below are added:

```bash
curl https://your-site.com/robots.txt
curl https://your-site.com/sitemap.xml
```

In a browser: view page source and look for `<title>`, `<meta name="description">`, and `<script type="application/ld+json">`. Run Lighthouse in Chrome DevTools for Core Web Vitals (see [performance.md](performance.md)).

## Root metadata (target)

Define metadata once in `app/layout.tsx`. Most page-level metadata extends this via `template`.

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dniproanimals.example"),
  title: {
    default: "DniproAnimals — Притулок для тварин у Дніпрі",
    template: "%s | DniproAnimals",
  },
  description:
    "Благодійний фонд DniproAnimals. Допомога безхатнім тваринам, усиновлення, волонтерство.",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://dniproanimals.example",
    siteName: "DniproAnimals",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "DniproAnimals" },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};
```

Rules:

- `viewport` is a **separate export**. `themeColor`, `colorScheme`, and `viewport` cannot live inside `metadata`.
- `metadataBase` is required for relative URLs in `openGraph.images`, `twitter.images`, `alternates.canonical`.
- `title.template` (`"%s | DniproAnimals"`) lets pages override only the prefix.
- Don't combine the static `metadata` export with `generateMetadata` in the same file. Use one.

## Per-page metadata (dynamic routes)

For pages where the title/description depends on data:

```tsx
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const animal = await apiClient.animals.get(Number(id));
  return {
    title: animal.name,
    description: animal.description ?? undefined,
    alternates: { canonical: `/animals/${id}` },
  };
}
```

Today the animal detail page is `"use client"`, so `generateMetadata` doesn't run there. To make it indexable, the page would either need to:

1. Become a server component (drop `"use client"`, `await` the fetch), or
2. Stay client but add a thin server `page.tsx` wrapper that exports `generateMetadata` and renders the client component.

## Sitemap (target)

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dniproanimals.example";
  const animals = await apiClient.animals.list({});
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/animals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...animals.map((a) => ({
      url: `${baseUrl}/animals/${a.id}`,
      lastModified: new Date(a.updatedAt ?? Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
```

For a sitemap larger than 50,000 URLs, split into multiple sitemap routes via `generateSitemaps` (Next handles index files).

## Robots (target)

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://dniproanimals.example";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/superadmin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

Block only routes that shouldn't be indexed (dashboard, admin, superadmin, internal previews). **Never disallow `/_next/`** — crawlers need render-critical CSS/JS.

Don't write bot-specific rules (`Googlebot`, `Bingbot`) unless you're deliberately overriding the wildcard. Bot-specific rules ignore the wildcard for that bot.

## JSON-LD structured data

For pages with structured content (animal listings, organizations, articles), embed JSON-LD inline:

```tsx
export default async function AnimalPage({ params }: Props) {
  const { id } = await params;
  const animal = await apiClient.animals.get(Number(id));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: animal.name,
    description: animal.description,
    image: animal.photos?.[0],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* page UI */}
    </>
  );
}
```

Common types: `Article`, `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`. Validate with [Google's Rich Results Test](https://search.google.com/test/rich-results).

## Rendering strategy by SEO need

| Strategy                     | Use when                              | SEO impact                          |
| ---------------------------- | ------------------------------------- | ----------------------------------- |
| Static (default)             | Content rarely changes                | Best — pre-rendered HTML, fast TTFB |
| ISR (`revalidate`)           | Content updates periodically          | Best — cached HTML with refresh     |
| SSR (`force-dynamic`)        | Content varies per request            | Great — server-rendered             |
| CSR (`'use client'` + fetch) | Authenticated dashboards, no SEO need | Poor — empty HTML for crawlers      |

If a page needs to be indexable, render its content on the server. Don't fetch SEO-relevant data with React Query in a client component — crawlers see an empty shell.

The dashboard side (`(dashboard)/...`) is fine staying client-rendered. The public side (`(public)/...`, especially `/animals` and `/animals/[id]`) is the one to migrate when SEO becomes a priority.

## Excluding pages from search

```tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

Use for previews, internal tools, archived pages.

## What's missing in this project (recap)

- [ ] `metadataBase`, `openGraph`, `twitter`, `alternates.canonical` in root `metadata`
- [ ] `viewport` export with `themeColor`
- [ ] `app/sitemap.ts`
- [ ] `app/robots.ts`
- [ ] `generateMetadata` for dynamic routes (`/animals/[id]`, `/organizations/[id]`)
- [ ] JSON-LD on animal/organization detail pages
- [ ] Server-rendering the public catalog (`/animals`)

Tackle these per-route as SEO becomes a priority — there's no single big-bang refactor needed.

## Cross-references

- [performance.md](performance.md) — Core Web Vitals targets and how to hit them.
- [server-components.md](server-components.md) — Why server-rendering matters for SEO and how the layout/page split works.
- [structure.md](structure.md) — Where `sitemap.ts`, `robots.ts`, and root `layout.tsx` live in the tree.
