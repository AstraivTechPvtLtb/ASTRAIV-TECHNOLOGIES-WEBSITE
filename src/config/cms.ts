/**
 * Payload CMS configuration.
 * Prepares the CMS architecture for blog and portfolio entries.
 */

export const cmsConfig = {
  secret: process.env.PAYLOAD_SECRET || '',
  adminRoute: '/admin/cms',
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  collections: {
    posts: 'posts',
    categories: 'categories',
    projects: 'projects',
    users: 'users',
  },
  editor: {
    imageQuality: 85,
    maxUploadSize: 5000000, // 5MB
  },
};
