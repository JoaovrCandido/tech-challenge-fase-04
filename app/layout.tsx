import type { Metadata } from "next";
import { Inter } from 'next/font/google'

import { AccessibilityProvider } from "@/contexts/AccessibilityProvider";
import { HeaderContainer } from "@/components/HeaderContainer/HeaderContainer";

import "../styles/globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Home",
  description: "Home - Projeto Financeiro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AccessibilityProvider>
          <HeaderContainer />

          <main>{children}</main>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
