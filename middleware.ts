import createMiddleware from 'next-intl/middleware';

const middleware = createMiddleware({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'never',
});

const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

export default middleware;
export { config };
