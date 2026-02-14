import './globals.css';

import type { Metadata } from 'next';

const metadata: Metadata = { title: 'Cawgates' };

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export { metadata };
export default RootLayout;
