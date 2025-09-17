import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "InvoEase",
  description: "Mobile-first invoicing app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
