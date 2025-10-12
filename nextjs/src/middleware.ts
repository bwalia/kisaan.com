import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't use locale prefix for default locale
  localePrefix: 'as-needed',
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/(en|fr|nl|hi|th|es)/:path*',
    '/((?!_next|_vercel|api|favicon.ico|.*\\..*).*)'
  ],
};
