import { apiClient } from "@/shared/api-client";
import { ReactQueryProvider } from "@/shared/providers/ReactQueryProvider";
import { getServerQueryClient } from "@/shared/providers/getServerQueryClient";
import { endpoints } from "@dniproanimals/endpoints";
import { cn } from "@dniproanimals/ui";
import { dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DniproAnimals — Притулок для тварин у Дніпрі",
  description:
    "Благодійний фонд DniproAnimals. Допомога безхатнім тваринам, усиновлення, волонтерство.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getServerQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [endpoints.foundation.get()],
    queryFn: () => apiClient.foundation.get(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <html
      lang="uk"
      className={cn(
        geistSans.variable,
        geistMono.variable,
        "h-full antialiased",
      )}
    >
      <head>
        <Script
          defer
          data-id="3158505"
          src="https://usd.org/js/count.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <ReactQueryProvider dehydratedState={dehydratedState}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
