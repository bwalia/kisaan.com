export const locales = ['en', 'fr', 'nl', 'hi', 'th', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  nl: 'Nederlands',
  hi: 'हिन्दी',
  th: 'ไทย',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  nl: '🇳🇱',
  hi: '🇮🇳',
  th: '🇹🇭',
  es: '🇪🇸',
};
