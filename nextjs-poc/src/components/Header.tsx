'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/mission', label: 'Platform Mission' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/parent', label: 'Parent Controls' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4 flex items-center justify-between h-20">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex flex-col">
            <span className="font-bold text-2xl text-gray-900">
              🛡️ Flimmer
            </span>
            <span className="text-sm text-gray-600 -mt-1">
              Content Safety & Digital Education Platform
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                  pathname === href 
                    ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg shadow-orange-600/20' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
} 