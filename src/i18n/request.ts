import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') ?? 'en';
  const locale = acceptLanguage.split(',')[0].split(';')[0].trim() || 'en';

  return {
    locale,
    messages: (await import('../../messages/en.json')).default,
    timeZone: 'UTC',
  };
});
