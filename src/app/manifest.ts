import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Astraiv Technologies',
    short_name: 'Astraiv',
    description: 'Enterprise-grade website development, cloud infrastructure, AI solutions, and business automation built with clean architecture.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#080C14',
    theme_color: '#2563EB',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
