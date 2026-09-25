import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@base-ui/react', 'recharts'],
  },
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
      // Reclassified Services to Solutions (308 Permanent)
      {
        source: '/services/digital-transformation',
        destination: '/solutions/digital-transformation',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/digital-transformation',
        destination: '/:locale/solutions/digital-transformation',
        permanent: true,
      },
      {
        source: '/services/business-automation',
        destination: '/solutions/business-process-automation',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/business-automation',
        destination: '/:locale/solutions/business-process-automation',
        permanent: true,
      },
      {
        source: '/services/enterprise-automation',
        destination: '/solutions/ai-business-automation',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/enterprise-automation',
        destination: '/:locale/solutions/ai-business-automation',
        permanent: true,
      },
      // Canonical Service Aliases (308 Permanent)
      {
        source: '/services/web-applications',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/web-applications',
        destination: '/:locale/services/web-development',
        permanent: true,
      },
      {
        source: '/services/website-development',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/website-development',
        destination: '/:locale/services/web-development',
        permanent: true,
      },
      {
        source: '/services/custom-software-development',
        destination: '/services/custom-software',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/custom-software-development',
        destination: '/:locale/services/custom-software',
        permanent: true,
      },
      {
        source: '/services/cloud-infrastructure',
        destination: '/services/cloud-engineering',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/cloud-infrastructure',
        destination: '/:locale/services/cloud-engineering',
        permanent: true,
      },
      {
        source: '/services/cloud-solutions',
        destination: '/services/cloud-engineering',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/cloud-solutions',
        destination: '/:locale/services/cloud-engineering',
        permanent: true,
      },
      {
        source: '/services/mobile-apps',
        destination: '/services/mobile-development',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/mobile-apps',
        destination: '/:locale/services/mobile-development',
        permanent: true,
      },
      {
        source: '/services/devops-cicd',
        destination: '/services/devops',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/devops-cicd',
        destination: '/:locale/services/devops',
        permanent: true,
      },
      {
        source: '/services/uiux-design',
        destination: '/services/ui-ux-design',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/uiux-design',
        destination: '/:locale/services/ui-ux-design',
        permanent: true,
      },
      {
        source: '/services/it-consulting',
        destination: '/services/technology-consulting',
        permanent: true,
      },
      {
        source: '/:locale(en|es|bn|hi|ar)/services/it-consulting',
        destination: '/:locale/services/technology-consulting',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
