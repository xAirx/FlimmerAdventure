'use client';

import Providers from '@/lib/providers';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <main className="max-w-full mx-auto p-8 bg-white">{children}</main>
    </Providers>
  );
} 