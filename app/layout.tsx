import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import { Providers } from "@/app/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cat Health Tracker",
  description: "Track your cat's health, weight, vet visits, and vaccinations",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
