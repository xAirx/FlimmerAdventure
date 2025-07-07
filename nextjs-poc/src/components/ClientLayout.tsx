'use client';

import Providers from '@/lib/providers';
import { Header } from '@/components/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="max-w-6xl mx-auto p-8">{children}</main>
    </Providers>
  );
} 