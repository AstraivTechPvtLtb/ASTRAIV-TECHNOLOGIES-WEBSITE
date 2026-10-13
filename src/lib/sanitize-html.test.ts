import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './sanitize-html';

describe('HTML Sanitizer Security & Formatting Suite (client/src/lib/sanitize-html.ts)', () => {
  describe('1. XSS & Malicious Payload Neutralization', () => {
    it('completely strips script tags and their inner executable payloads', () => {
      const input = '<p>Normal text</p><script>alert("pwned")</script><p>More text</p>';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('<script');
      expect(output).not.toContain('alert("pwned")');
      expect(output).toBe('<p>Normal text</p><p>More text</p>');
    });

    it('strips inline event handlers from all elements', () => {
      const input = '<img src="/test.png" onerror="alert(1)" onload="fetch(\'/steal\')" alt="Test" />';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('onerror');
      expect(output).not.toContain('onload');
      expect(output).toContain('src="/test.png"');
      expect(output).toContain('alt="Test"');
    });

    it('strips javascript: URIs from hyperlinks', () => {
      const input = '<a href="javascript:alert(document.cookie)">Click me</a>';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('javascript:');
      expect(output).not.toContain('href=');
      expect(output).toContain('<a>Click me</a>');
    });

    it('strips obfuscated and entity-encoded javascript: URIs', () => {
      const input = '<a href="java&#x0A;script:alert(1)">Click me</a>';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('javascript:');
      expect(output).not.toContain('href=');
    });

    it('strips dangerous embedded elements: iframe, object, embed, style', () => {
      const input = `
        <div>
          <iframe src="https://evil.com/phishing"></iframe>
          <object data="malicious.swf"></object>
          <embed src="exploit.pdf" />
          <style>body { display: none; }</style>
        </div>
      `;
      const output = sanitizeHtml(input);
      expect(output).not.toContain('<iframe');
      expect(output).not.toContain('<object');
      expect(output).not.toContain('<embed');
      expect(output).not.toContain('<style');
      expect(output).not.toContain('display: none');
    });

    it('strips HTML comments to prevent parser evasion and conditional comments', () => {
      const input = '<p>Hello <!-- [if IE]> evil code <![endif] --> World</p>';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('<!--');
      expect(output).toBe('<p>Hello  World</p>');
    });
  });

  describe('2. Preservation of Supported Blog & Insight Formatting', () => {
    it('preserves semantic headings, paragraphs, and typographic accents', () => {
      const input = '<h2>Architecture Overview</h2><p>Our <strong>distributed</strong> consensus system uses <em>Raft</em>.</p>';
      const output = sanitizeHtml(input);
      expect(output).toBe('<h2>Architecture Overview</h2><p>Our <strong>distributed</strong> consensus system uses <em>Raft</em>.</p>');
    });

    it('preserves code blocks, inline code, and pre tags', () => {
      const input = '<pre><code class="language-typescript">const x: number = 42;</code></pre>';
      const output = sanitizeHtml(input);
      expect(output).toContain('<pre>');
      expect(output).toContain('<code class="language-typescript">');
      expect(output).toContain('const x: number = 42;');
    });

    it('preserves ordered and unordered lists', () => {
      const input = '<ul><li>Zero Trust Networking</li><li>Edge CDN Caching</li></ul>';
      const output = sanitizeHtml(input);
      expect(output).toBe('<ul><li>Zero Trust Networking</li><li>Edge CDN Caching</li></ul>');
    });

    it('preserves tables and structural cells', () => {
      const input = '<table><thead><tr><th>Metric</th><th>P99</th></tr></thead><tbody><tr><td>Latency</td><td>12ms</td></tr></tbody></table>';
      const output = sanitizeHtml(input);
      expect(output).toContain('<table>');
      expect(output).toContain('<th>Metric</th>');
      expect(output).toContain('<td>12ms</td>');
    });

    it('preserves valid safe external links and ensures secure rel attributes', () => {
      const input = '<a href="https://astraivtechnologies.com/solutions" target="_blank">Enterprise Solutions</a>';
      const output = sanitizeHtml(input);
      expect(output).toContain('href="https://astraivtechnologies.com/solutions"');
      expect(output).toContain('target="_blank"');
      expect(output).toContain('rel="noopener noreferrer"');
    });

    it('preserves safe images with alt text, width, and height', () => {
      const input = '<img src="/images/case-studies/architecture.webp" alt="Architecture" width="1200" height="675" />';
      const output = sanitizeHtml(input);
      expect(output).toContain('src="/images/case-studies/architecture.webp"');
      expect(output).toContain('alt="Architecture"');
      expect(output).toContain('width="1200"');
    });

    it('handles empty, null, or undefined gracefully', () => {
      expect(sanitizeHtml(null)).toBe('');
      expect(sanitizeHtml(undefined)).toBe('');
      expect(sanitizeHtml('')).toBe('');
    });
  });

  describe('3. Malformed SVG & Image Event-Handler XSS Regression Suite', () => {
    it('rejects malformed SVG tags containing embedded script tags or handlers', () => {
      const payloads = [
        '<svg><script>alert("xss")</script></svg>',
        '<svg onload="alert(1)"><circle cx="50" cy="50" r="40"/></svg>',
        '<svg/onload=alert(1)>',
        '<svg><image href="x" onerror="alert(1)" /></svg>',
        '<svg><set attributeName="onmouseover" to="alert(1)"/></svg>',
        '<svg><animate onbegin="alert(1)" attributeName="x"/></svg>',
        '<svg><a xlink:href="javascript:alert(1)"><text>Click</text></a></svg>',
      ];

      for (const payload of payloads) {
        const output = sanitizeHtml(payload);
        expect(output).not.toContain('<script');
        expect(output).not.toContain('alert(');
        expect(output).not.toContain('onload=');
        expect(output).not.toContain('onerror=');
        expect(output).not.toContain('onmouseover=');
        expect(output).not.toContain('onbegin=');
        expect(output).not.toContain('javascript:');
      }
    });

    it('neutralizes malformed image event handlers and tricky attribute injections', () => {
      const payloads = [
        '<img src="x" onerror="alert(1)">',
        '<img/src="x"/onerror=alert(1)>',
        '<img src=x onerror=alert(1)>',
        '<img src="" onerror="alert(String.fromCharCode(88,83,83))">',
        '<img src="javascript:alert(1)">',
        '<img """><script>alert(1)</script>">',
        '<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">',
      ];

      for (const payload of payloads) {
        const output = sanitizeHtml(payload);
        expect(output).not.toContain('onerror');
        expect(output).not.toContain('alert(');
        expect(output).not.toContain('<script');
        expect(output).not.toContain('javascript:');
        expect(output).not.toContain('data:text/html');
      }
    });

    it('neutralizes entity-encoded and whitespace-obfuscated script protocols', () => {
      const payloads = [
        '<a href="&Tab;javascript:alert(1)">Click</a>',
        '<a href="jav&#x09;ascript:alert(1)">Click</a>',
        '<a href=" &#14; javascript:alert(1)">Click</a>',
      ];

      for (const payload of payloads) {
        const output = sanitizeHtml(payload);
        expect(output).not.toContain('href="javascript:');
        expect(output).not.toContain('alert(1)');
      }
    });

    it('handles nested and malformed unclosed tags designed to evade regex parsers', () => {
      const input = '<<SCRIPT>alert("XSS");//<</SCRIPT><p>Safe text</p><img src="test.jpg" onerror="evil()"';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('<SCRIPT');
      expect(output).not.toContain('alert("XSS")');
      expect(output).not.toContain('onerror');
      expect(output).toContain('Safe text');
    });
  });
});

