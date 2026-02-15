import './globals.css';

import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { Header } from '@/components';

const metadata: Metadata = { title: 'Cawgates' };

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const locale = await getLocale();
  const messages = await getMessages();
  const user = await getUser();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {user && <Header username={user.username} />}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export { metadata };
export default RootLayout;
