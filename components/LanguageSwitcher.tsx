'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Get the current path without the locale prefix
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            locale === loc
              ? 'bg-webifyd-blue text-white'
              : 'text-webifyd-gray-medium hover:bg-webifyd-gray-light'
          }`}
        >
          {loc === 'en' ? 'English' : 'العربية'}
        </button>
      ))}
    </div>
  );
}
