'use client';

/**
 * @file client/src/views/analytics/google-analytics.tsx
 * @description [VIEW] Google Analytics 4 (gtag.js) tracking tag injector.
 * Mounts asynchronously via Next.js Script when NEXT_PUBLIC_GA_MEASUREMENT_ID is defined.
 */

import Script from 'next/script';

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Gracefully skip injecting scripts if measurement ID is not configured
  if (!measurementId || measurementId.trim() === '' || measurementId.startsWith('G-XXX')) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
