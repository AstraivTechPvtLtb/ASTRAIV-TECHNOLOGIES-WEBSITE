import { describe, it, expect } from 'vitest';
import { validateDocumentBuffer, sanitizeFilename, MAX_RESUME_SIZE_BYTES } from './validator';

describe('Resume Document Binary & Structural Validator', () => {
  it('accepts a valid PDF file with standard magic bytes %PDF-', () => {
    // Valid PDF buffer starting with %PDF-1.4
    const pdfHeader = Buffer.from('%PDF-1.4\n%âãÏÓ\n');
    const dummyPdf = Buffer.concat([pdfHeader, Buffer.alloc(1024, 0x20)]);

    const result = validateDocumentBuffer(dummyPdf, 'resume.pdf');
    expect(result.isValid).toBe(true);
    expect(result.mimeType).toBe('application/pdf');
    expect(result.detectedFormat).toBe('pdf');
  });

  it('accepts a valid DOCX file with standard Zip magic bytes PK\\x03\\x04', () => {
    // Valid DOCX / Zip header starting with PK\x03\x04
    const zipHeader = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
    const dummyDocx = Buffer.concat([zipHeader, Buffer.alloc(2048, 0x00)]);

    const result = validateDocumentBuffer(dummyDocx, 'resume.docx');
    expect(result.isValid).toBe(true);
    expect(result.mimeType).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    expect(result.detectedFormat).toBe('docx');
  });

  it('rejects an empty buffer', () => {
    const emptyBuffer = Buffer.alloc(0);
    const result = validateDocumentBuffer(emptyBuffer, 'resume.pdf');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('rejects an oversized buffer exceeding 10MB', () => {
    const oversizedBuffer = Buffer.alloc(MAX_RESUME_SIZE_BYTES + 1024);
    oversizedBuffer.write('%PDF-1.5', 0);

    const result = validateDocumentBuffer(oversizedBuffer, 'resume.pdf');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('exceeds the 10MB limit');
  });

  it('rejects executable / script files disguised with PDF extension', () => {
    // Windows PE Executable magic bytes 'MZ'
    const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    const result = validateDocumentBuffer(exeBuffer, 'resume.pdf');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Unsupported document format');
  });

  it('rejects JavaScript / HTML content disguised as PDF', () => {
    const htmlBuffer = Buffer.from('<html><script>alert("test")</script></html>');
    const result = validateDocumentBuffer(htmlBuffer, 'resume.pdf');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Unsupported document format');
  });

  it('sanitizes unsafe filenames and removes path traversals', () => {
    expect(sanitizeFilename('../../etc/passwd.pdf')).toBe('passwd.pdf');
    expect(sanitizeFilename('my resume (final) [2026]!.pdf')).toBe('my_resume__final___2026__.pdf');
    expect(sanitizeFilename('clean-candidate_doc.docx')).toBe('clean-candidate_doc.docx');
  });
});
