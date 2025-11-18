import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  // Static imports for Edge runtime compatibility
  let messages;
  if (locale === 'ar') {
    messages = (await import('./messages/ar.json')).default;
  } else {
    messages = (await import('./messages/en.json')).default;
  }

  return {
    locale,
    messages,
  };
});
