import createMiddleware from 'next-intl/middleware';

const middleware = createMiddleware({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'never',
});

export default middleware;

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
