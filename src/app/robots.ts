import { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: '*',
      allow: '/',
    },
    {
      userAgent: 'GPTBot',
      disallow: '/',
    },
    {
      userAgent: 'ClaudeBot',
      disallow: '/',
    },
    {
      userAgent: 'CCBot',
      disallow: '/',
    },
    {
      userAgent: 'Google-Extended',
      disallow: '/',
    },
  ],
});

export default robots;
