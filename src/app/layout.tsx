import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { UserProvider } from "@/lib/UserContext";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script defer data-id="3158505" src="https://usd.org/js/count.js" strategy="afterInteractive" />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <NuqsAdapter>
          <UserProvider>
            {children}
          </UserProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
