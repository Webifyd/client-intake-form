# next-intl Setup Guide

## Overview

The application now supports **Arabic and English** bilingual functionality using next-intl for internationalization.

## What Was Configured

### 1. Package Installation
- Installed `next-intl` package for internationalization support

### 2. Core Configuration Files

#### `i18n.ts` (Root)
- Defines supported locales: `['en', 'ar']`
- Sets default locale: `'en'`
- Configures message loading from JSON files

#### `proxy.ts` (Root)
- Handles locale detection and routing
- Redirects users to appropriate locale prefix (e.g., `/en/`, `/ar/`)
- Uses `localePrefix: 'always'` strategy

#### `next.config.js`
- Updated to use next-intl plugin
- Wraps Next.js config with `withNextIntl()`

### 3. Translation Files

#### `messages/en.json`
- Complete English translations for:
  - App navigation and UI
  - All form sections
  - Field labels and placeholders
  - Validation messages
  - Success/error messages
  - Tooltips and help text

#### `messages/ar.json`
- Complete Arabic translations (RTL supported)
- Mirrors English structure
- Includes proper Arabic numerals and formatting

### 4. App Structure Reorganization

**Before:**
```
app/
├── layout.tsx
├── page.tsx
├── globals.css
└── api/
```

**After:**
```
app/
├── [locale]/               # Dynamic locale segment
│   ├── layout.tsx          # Locale-aware layout with NextIntlClientProvider
│   ├── page.tsx            # Home page
│   └── not-found.tsx       # Locale-aware 404 page
├── globals.css             # Global styles (unchanged)
├── api/                    # API routes (no locale needed)
└── not-found.tsx           # Root 404 page
```

### 5. Language Switcher Component

**File:** `components/LanguageSwitcher.tsx`

A client-side component that:
- Displays "English" / "العربية" toggle buttons
- Switches between locales without page reload
- Maintains current page path when switching languages
- Highlights active language

## How to Use

### Accessing the Application

- **English:** `http://localhost:3000/en`
- **Arabic:** `http://localhost:3000/ar`
- **Root:** `http://localhost:3000/` → Redirects to `/en` (default)

### Using Translations in Components

#### Server Components
```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('sections');

  return <h1>{t('companyInfo')}</h1>; // "Company Information" or "معلومات الشركة"
}
```

#### Client Components
```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyClientComponent() {
  const t = useTranslations('app');

  return <button>{t('submit')}</button>; // "Submit Form" or "إرسال النموذج"
}
```

### Adding the Language Switcher

Add to any component (typically header/navigation):

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  return (
    <header>
      {/* Your header content */}
      <LanguageSwitcher />
    </header>
  );
}
```

## RTL (Right-to-Left) Support

Arabic pages automatically use RTL layout:
- Set via `dir={locale === 'ar' ? 'rtl' : 'ltr'}` in `app/[locale]/layout.tsx`
- Tailwind CSS automatically handles RTL transformations
- No additional CSS changes needed

## Next Steps

### To Fully Implement Translations in the Form:

1. **Update IntakeForm.tsx** to use `useTranslations()` instead of hardcoded text
2. **Add LanguageSwitcher** to the form header
3. **Test both languages** thoroughly
4. **Expand translations** if needed (add more keys to JSON files)

### Example: Converting a Field to Use Translations

**Before:**
```tsx
<label>Company Name</label>
<input placeholder="Enter your company name" />
```

**After:**
```tsx
const t = useTranslations('companyInfo');

<label>{t('companyName')}</label>
<input placeholder={t('companyNamePlaceholder')} />
```

## Translation File Structure

```json
{
  "app": { /* App-level strings */ },
  "progress": { /* Progress indicators */ },
  "sections": { /* Section headings */ },
  "companyInfo": { /* Company info fields */ },
  "campaignObjective": { /* Campaign objective fields */ },
  "targetAudience": { /* Target audience fields */ },
  // ... etc
  "validation": { /* Validation messages */ },
  "messages": { /* Success/error messages */ }
}
```

## Adding New Translations

1. Add key to `messages/en.json`:
```json
{
  "mySection": {
    "newField": "New Field Label"
  }
}
```

2. Add corresponding Arabic to `messages/ar.json`:
```json
{
  "mySection": {
    "newField": "تسمية الحقل الجديد"
  }
}
```

3. Use in component:
```tsx
const t = useTranslations('mySection');
<label>{t('newField')}</label>
```

## Important Notes

- **Proxy File:** Uses Next.js 16's new `proxy.ts` convention (previously `middleware.ts`)
- **API Routes:** API routes (`/api/*`) are excluded from locale routing
- **Static Generation:** Locales are pre-generated at build time using `generateStaticParams()`
- **Default Locale:** Users visiting `/` are redirected to `/en` automatically

## File Locations

```
Project Root/
├── i18n.ts                             # Configuration
├── proxy.ts                            # Routing (Next.js 16+)
├── messages/
│   ├── en.json                        # English translations
│   └── ar.json                        # Arabic translations
├── app/[locale]/
│   ├── layout.tsx                     # Locale layout
│   └── page.tsx                       # Locale pages
├── components/
│   └── LanguageSwitcher.tsx          # Language toggle
└── next.config.js                     # Next.js config with next-intl
```

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [RTL Styling with Tailwind](https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support)

---

**Setup Date:** 2025-11-18
**Status:** ✅ Complete - Ready for Form Integration
