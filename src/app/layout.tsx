import './globals.css';

import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cn } from '@/lib/utils';

// This RootLayout component is the only place
// the Page component should be imported and used.
// This is because the Page component defines the
// styles and header for the entire app.
// eslint-disable-next-line no-restricted-imports
import Page from '@/components/Page';

const metadata: Metadata = { title: 'Cawgates' };

// Self-hosted by next/font at build time, exposed as CSS variables that
// --font-family and --font-family-mono in globals.css pick up
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
});

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={cn(plexSans.variable, plexMono.variable)}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Page>{children}</Page>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export { metadata };
export default RootLayout;
