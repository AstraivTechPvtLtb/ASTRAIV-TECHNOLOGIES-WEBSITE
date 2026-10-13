/**
 * @file client/src/lib/sanitize-html.ts
 * @description Vetted parser-based allowlist HTML sanitizer for rich-text article and insight content.
 * Powered by the industry-standard AST/DOM parser-based `sanitize-html` library (built on htmlparser2).
 * Protects against stored XSS, script injection, iframe phishing, malformed SVG/image event-handler payloads,
 * and malicious URI schemes while preserving valid typography, blog styling, and semantic document structure.
 */

import sanitizeHtmlLib from 'sanitize-html';

// Safe tags permitted in article content
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'blockquote', 'pre', 'code',
  'ul', 'ol', 'li',
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'sub', 'sup', 'mark', 'small', 'abbr',
  'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
  'span', 'div', 'br', 'hr',
];

// Safe global and tag-specific attributes
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  '*': ['class', 'className', 'id', 'title', 'aria-label', 'aria-hidden'],
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
  th: ['scope', 'colspan', 'rowspan'],
  td: ['colspan', 'rowspan'],
  ol: ['start', 'type', 'reversed'],
};

// Tags whose inner content must be completely purged from the document AST
const DISALLOWED_BLOCK_TAGS = [
  'script', 'style', 'iframe', 'object', 'embed', 'applet', 'noscript', 'noembed',
];

/**
 * Checks whether an image data URI is a safe raster image.
 * Explicitly rejects data:text/html, SVG data URIs with scripts, and malformed data payloads.
 */
function isSafeRasterImageDataUri(dataUri: string): boolean {
  return /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(dataUri.trim());
}

/**
 * Sanitizes HTML string using the vetted, parser-based AST sanitizer.
 *
 * @param dirty The untrusted or database-stored raw HTML string.
 * @returns Clean, safe HTML string suitable for browser rendering.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return sanitizeHtmlLib(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    disallowedTagsMode: 'discard',
    nonTextTags: DISALLOWED_BLOCK_TAGS,
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowProtocolRelative: true,
    transformTags: {
      a: (tagName, attribs) => {
        // Enforce secure attributes for external links
        if (attribs.target === '_blank') {
          attribs.rel = 'noopener noreferrer';
        }
        return {
          tagName,
          attribs,
        };
      },
      img: (tagName, attribs) => {
        // Verify data URIs for images: must only be valid raster base64
        if (attribs.src && attribs.src.startsWith('data:')) {
          if (!isSafeRasterImageDataUri(attribs.src)) {
            delete attribs.src;
          }
        }
        return {
          tagName,
          attribs,
        };
      },
    },
  });
}
