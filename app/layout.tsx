import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FOSIS | Fondo de Solidaridad e Inversión Social",
  description: "Apoyamos a personas en situación de pobreza o vulnerabilidad social, para que desarrollen sus capacidades, superen su condición y se integren a la sociedad.",
  icons: {
    icon: "https://www.fosis.gob.cl/assets/img/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  // FIX: Added React import to resolve the 'React' namespace.
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
      </body>
    </html>
  );
}