import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/company',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/company',
        permanent: true,
      },
      {
        source: '/case-studies',
        destination: '/work/case-studies',
        permanent: true,
      },
      {
        source: '/case-studies/:slug',
        destination: '/work/case-studies/:slug',
        permanent: true,
      },
      {
        source: '/portfolio',
        destination: '/work/case-studies',
        permanent: true,
      },
      {
        source: '/portfolio/:slug',
        destination: '/work/case-studies/:slug',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/about',
        destination: '/:locale/company',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/about-us',
        destination: '/:locale/company',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/case-studies',
        destination: '/:locale/work/case-studies',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/case-studies/:slug',
        destination: '/:locale/work/case-studies/:slug',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/portfolio',
        destination: '/:locale/work/case-studies',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/portfolio/:slug',
        destination: '/:locale/work/case-studies/:slug',
        permanent: true,
      },
      {
        source: '/reviews',
        destination: '/work/testimonials',
        permanent: true,
      },
      {
        source: '/testimonials',
        destination: '/work/testimonials',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/reviews',
        destination: '/:locale/work/testimonials',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/testimonials',
        destination: '/:locale/work/testimonials',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/insights/blog',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/blog',
        destination: '/:locale/insights/blog',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/insights/:slug',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/blog/:slug',
        destination: '/:locale/insights/:slug',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
