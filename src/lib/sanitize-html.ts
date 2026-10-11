/**
 * @file client/src/lib/sanitize-html.ts
 * @description Robust, zero-dependency allowlist HTML sanitizer for rich-text article and insight content.
 * Protects against stored XSS, script injection, iframe phishing, event handlers, and malicious URIs
 * while preserving valid typography, blog styling, and semantic document structure.
 */

// Safe tags permitted in article content
const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'blockquote', 'pre', 'code',
  'ul', 'ol', 'li',
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'sub', 'sup', 'mark', 'small', 'abbr',
  'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
  'span', 'div', 'br', 'hr',
]);

// Tags whose inner content must be completely purged
const DISALLOWED_BLOCK_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'applet', 'noscript', 'noembed',
]);

// Allowed attributes per tag or globally
const GLOBAL_ALLOWED_ATTRS = new Set(['class', 'className', 'id', 'title', 'aria-label', 'aria-hidden']);

const TAG_SPECIFIC_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
  th: new Set(['scope', 'colspan', 'rowspan']),
  td: new Set(['colspan', 'rowspan']),
  ol: new Set(['start', 'type', 'reversed']),
};

/**
 * Checks whether an attribute URL is safe.
 * Permits http, https, mailto, tel, relative paths, and safe image data URIs.
 * Disallows javascript:, vbscript:, and data:text/html.
 */
function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();

  // Strip unprintable control characters and decode HTML entities before checking
  const normalized = trimmed
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B\uFEFF]/g, '')
    .replace(/&#x?[0-9a-f]+;?/gi, (match) => {
      try {
        if (match.startsWith('&#x') || match.startsWith('&#X')) {
          return String.fromCharCode(parseInt(match.slice(3).replace(';', ''), 16));
        }
        return String.fromCharCode(parseInt(match.slice(2).replace(';', ''), 10));
      } catch {
        return match;
      }
    });

  // Reject dangerous protocols
  if (/^\s*(javascript|vbscript|data\s*:\s*text\/html)/i.test(normalized)) {
    return false;
  }

  // Allow relative URLs, fragment anchors, and standard safe web schemes
  if (/^(\/|#|\.\/|\.\.\/|https?:\/\/|mailto:|tel:)/i.test(normalized)) {
    return true;
  }

  // Allow safe inline raster images
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(normalized)) {
    return true;
  }

  return false;
}

/**
 * Sanitizes HTML string using a strict allowlist.
 *
 * @param dirty The untrusted or database-stored raw HTML string.
 * @returns Clean, safe HTML string suitable for browser rendering.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // 1. Purge dangerous blocks including their content (<script>...</script>, <style>...</style>, etc.)
  let cleaned = dirty;
  for (const blockTag of DISALLOWED_BLOCK_TAGS) {
    const blockRegex = new RegExp(`<${blockTag}\\b[^<]*(?:(?!<\\/${blockTag}>)<[^<]*)*<\\/${blockTag}>`, 'gi');
    cleaned = cleaned.replace(blockRegex, '');
    // Catch unclosed block tags
    const unclosedRegex = new RegExp(`<${blockTag}\\b[^>]*>`, 'gi');
    cleaned = cleaned.replace(unclosedRegex, '');
  }

  // 2. Strip HTML comments (which can be used for IE conditional comment exploits)
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // 3. Process remaining tags against the allowlist
  const tagRegex = /<\/?([a-zA-Z0-9]+)(\s+[^>]*)?\/?>/g;

  return cleaned.replace(tagRegex, (fullMatch, rawTagName: string, rawAttrs: string | undefined) => {
    const tagName = rawTagName.toLowerCase();

    // If tag is not in allowlist, completely strip the tag
    if (!ALLOWED_TAGS.has(tagName)) {
      return '';
    }

    // Closing tag
    if (fullMatch.startsWith('</')) {
      return `</${tagName}>`;
    }

    // Self-closing or opening tag - parse and filter attributes
    const isSelfClosing = fullMatch.endsWith('/>') || tagName === 'br' || tagName === 'hr' || tagName === 'img';
    const cleanAttrs: string[] = [];

    if (rawAttrs) {
      // Attribute parser matching name="value", name='value', or name=value
      const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+)))?/g;
      let attrMatch: RegExpExecArray | null;

      while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

        // Immediately drop any on* event handlers (onclick, onerror, onload, etc.)
        if (attrName.startsWith('on')) {
          continue;
        }

        // Check if attribute is allowed for this tag
        const tagAllowedAttrs = TAG_SPECIFIC_ATTRS[tagName];
        const isAllowedAttr = GLOBAL_ALLOWED_ATTRS.has(attrName) || (tagAllowedAttrs && tagAllowedAttrs.has(attrName));

        if (!isAllowedAttr) {
          continue;
        }

        // Validate URLs for href and src attributes
        if (attrName === 'href' || attrName === 'src') {
          if (!isSafeUrl(attrValue)) {
            continue; // Drop unsafe URL
          }
        }

        // For links with target="_blank", ensure secure rel attributes
        if (tagName === 'a' && attrName === 'target' && attrValue === '_blank') {
          cleanAttrs.push(`target="_blank"`);
          cleanAttrs.push(`rel="noopener noreferrer"`);
          continue;
        }

        // Sanitize attribute value against quotes
        const sanitizedVal = attrValue.replace(/"/g, '&quot;');
        cleanAttrs.push(`${attrName}="${sanitizedVal}"`);
      }
    }

    // Auto-add noopener noreferrer to external links if not already present
    if (tagName === 'a' && cleanAttrs.some((a) => a.includes('target="_blank"')) && !cleanAttrs.some((a) => a.startsWith('rel='))) {
      cleanAttrs.push(`rel="noopener noreferrer"`);
    }

    const attrsString = cleanAttrs.length > 0 ? ` ${cleanAttrs.join(' ')}` : '';
    return isSelfClosing ? `<${tagName}${attrsString} />` : `<${tagName}${attrsString}>`;
  });
}
