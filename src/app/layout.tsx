import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "GreenCart | Fresh groceries, delivered",
  description: "Shop fresh groceries from local sellers with GreenCart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)} data-scroll-behavior="smooth">
      <ClerkProvider>
        <body className="min-h-full flex flex-col">{children}</body>
      </ClerkProvider>
    </html>
  );
}
