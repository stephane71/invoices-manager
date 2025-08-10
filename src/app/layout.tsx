import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InvoEase",
  description: "Mobile-first invoicing app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
