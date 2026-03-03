import './globals.css';

import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// This RootLayout component is the only place
// the Page component should be imported and used.
// This is because the Page component defines the
// styles and header for the entire app.
// eslint-disable-next-line no-restricted-imports
import Page from '@/components/Page';

const metadata: Metadata = { title: 'Cawgates' };

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
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
