import './globals.css';

import type { Metadata, Viewport } from 'next';
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

// Shrink the page when the on-screen keyboard opens, so bottom-pinned bars
// like the form footer sit above the keyboard instead of behind it. Android
// browsers honour this. iOS Safari ignores it.
const viewport: Viewport = { interactiveWidget: 'resizes-content' };

// Self-hosted by next/font at build time, exposed as CSS variables that
// --font-family and --font-family-mono in globals.css pick up
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
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

export { metadata, viewport };
export default RootLayout;
