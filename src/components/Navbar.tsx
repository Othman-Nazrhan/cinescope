'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center" suppressHydrationWarning>
        <Link href="/" className="text-2xl font-bold text-red-600">
          🎬 CineScope
        </Link>
        <div className="flex items-center space-x-6" suppressHydrationWarning>
          <Link
            href="/"
            className={`hover:text-red-600 transition-colors ${
              pathname === '/' ? 'text-red-600' : 'text-white'
            }`}
          >
            {t('home')}
          </Link>
          <Link
            href="/top"
            className={`hover:text-red-600 transition-colors ${
              pathname === '/top' ? 'text-red-600' : 'text-white'
            }`}
          >
            {t('top10')}
          </Link>
          <Link
            href="/favorites"
            className={`hover:text-red-600 transition-colors ${
              pathname === '/favorites' ? 'text-red-600' : 'text-white'
            }`}
          >
            {t('favorites')}
          </Link>
          <Link
            href="/stats"
            className={`hover:text-red-600 transition-colors ${
              pathname === '/stats' ? 'text-red-600' : 'text-white'
            }`}
          >
            {t('stats')}
          </Link>
          <button
            onClick={toggleTheme}
            className="text-white hover:text-red-600 transition-colors"
            title={t('themeToggle')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="text-white hover:text-red-600 transition-colors"
            title={t('languageToggle')}
          >
            {language === 'en' ? '🇫🇷' : '🇺🇸'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
