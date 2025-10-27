'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center" suppressHydrationWarning>
        <Link href="/" className="text-2xl font-bold text-red-600">
          CineScope
        </Link>
        <div className="flex space-x-6" suppressHydrationWarning>
          <Link
            href="/"
            className={`hover:text-red-600 transition-colors ${
              pathname === '/' ? 'text-red-600' : 'text-white'
            }`}
          >
            Accueil
          </Link>
          <Link
            href="/top"
            className={`hover:text-red-600 transition-colors ${
              pathname === '/top' ? 'text-red-600' : 'text-white'
            }`}
          >
            Top 10
          </Link>
          <Link
            href="/favorites"
            className={`hover:text-red-600 transition-colors ${
              pathname === '/favorites' ? 'text-red-600' : 'text-white'
            }`}
          >
            Favoris
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
