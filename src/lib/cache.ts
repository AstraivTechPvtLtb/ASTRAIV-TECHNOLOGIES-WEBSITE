import { unstable_cache } from 'next/cache';

/**
 * Universal safe wrapper around Next.js unstable_cache.
 * Bypasses incremental cache during unit testing (Vitest / Jest) to prevent
 * "Invariant: incrementalCache missing in unstable_cache" errors.
 */
export function safeCache<Args extends unknown[], Return>(
  cb: (...args: Args) => Promise<Return>,
  keyParts?: string[],
  options?: { revalidate?: number | false; tags?: string[] }
): (...args: Args) => Promise<Return> {
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return cb;
  }
  return unstable_cache(cb, keyParts, options) as (...args: Args) => Promise<Return>;
}
