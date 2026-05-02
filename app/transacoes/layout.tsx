import type { Metadata } from "next";

import "../../styles/globals.css";

export const metadata: Metadata = {
  title: "Transações",
  description: "Transações - Projeto Financeiro",
};

export default function RootLayoutTransaction({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
}
