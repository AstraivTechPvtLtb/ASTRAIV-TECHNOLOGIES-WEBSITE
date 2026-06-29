/**
 * Cloudflare R2 Storage (S3-Compatible API) Configuration.
 * Establishes file upload constraints and storage endpoints architecture.
 */

export const r2Config = {
  accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID || '',
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'astraiv-assets',
  
  // Custom public CDN URL pointing to Cloudflare DNS routing
  publicCdnUrl: process.env.NEXT_PUBLIC_R2_CDN_URL || 'https://cdn.astraiv.com',
  
  // Allowed file parameters
  uploadLimits: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxDocumentSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    allowedDocTypes: ['application/pdf', 'application/zip', 'text/plain'],
  },
};
