import type { Metadata } from "next";
import { Inter } from 'next/font/google'

import { AccessibilityProvider } from "@/contexts/AccessibilityProvider";
import QueryProvider from "@/contexts/QueryProvider";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
import { AuthProvider } from "@/contexts/AuthContext"; // <-- Novo Import
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
        <QueryProvider>
          {/* Adicionando o Provider de Autenticação */}
          <AuthProvider>
            <AccessibilityProvider>
              <FeedbackProvider>
                <HeaderContainer />
                <main>{children}</main>
              </FeedbackProvider>
            </AccessibilityProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}