import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'never', // URLs don't include locale prefix
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
