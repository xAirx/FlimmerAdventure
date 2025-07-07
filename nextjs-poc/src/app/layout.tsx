import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flimmer",
  description: "Hacker News, but for videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto flex-1 p-4">{children}</main>
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
