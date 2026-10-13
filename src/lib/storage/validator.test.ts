import { describe, it, expect } from 'vitest';
import { validateDocumentBuffer, sanitizeFilename, MAX_RESUME_SIZE_BYTES } from './validator';
import zlib from 'zlib';

function createValidDocxBuffer(extraEntries: { name: string; data: Buffer }[] = []): Buffer {
  const contentTypesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  const wordDocumentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Astraiv Candidate Resume</w:t></w:r></w:p></w:body></w:document>';

  const entries = [
    { name: '[Content_Types].xml', data: Buffer.from(contentTypesXml, 'utf8') },
    { name: 'word/document.xml', data: Buffer.from(wordDocumentXml, 'utf8') },
    ...extraEntries,
  ];

  const localHeaders: Buffer[] = [];
  const centralHeaders: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const deflated = zlib.deflateRawSync(entry.data);
    const crc = 0;

    const lh = Buffer.alloc(30 + nameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(8, 8);
    lh.writeUInt16LE(0, 10);
    lh.writeUInt16LE(0, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(deflated.length, 18);
    lh.writeUInt32LE(entry.data.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);
    nameBuf.copy(lh, 30);

    const localOffset = offset;
    offset += lh.length + deflated.length;
    localHeaders.push(lh, deflated);

    const ch = Buffer.alloc(46 + nameBuf.length);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0, 8);
    ch.writeUInt16LE(8, 10);
    ch.writeUInt16LE(0, 12);
    ch.writeUInt16LE(0, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(deflated.length, 20);
    ch.writeUInt32LE(entry.data.length, 24);
    ch.writeUInt16LE(nameBuf.length, 28);
    ch.writeUInt16LE(0, 30);
    ch.writeUInt16LE(0, 32);
    ch.writeUInt16LE(0, 34);
    ch.writeUInt16LE(0, 36);
    ch.writeUInt32LE(0, 38);
    ch.writeUInt32LE(localOffset, 42);
    nameBuf.copy(ch, 46);
    centralHeaders.push(ch);
  }

  const centralDir = Buffer.concat(centralHeaders);
  const cdOffset = offset;
  const cdSize = centralDir.length;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdSize, 12);
  eocd.writeUInt32LE(cdOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localHeaders, centralDir, eocd]);
}

describe('Resume Document Binary & Structural Validator', () => {
  it('accepts a valid PDF file with standard magic bytes %PDF-', () => {
    const pdfHeader = Buffer.from('%PDF-1.4\n%âãÏÓ\n');
    const dummyPdf = Buffer.concat([pdfHeader, Buffer.alloc(1024, 0x20)]);

    const result = validateDocumentBuffer(dummyPdf, 'resume.pdf');
    expect(result.isValid).toBe(true);
    expect(result.mimeType).toBe('application/pdf');
    expect(result.detectedFormat).toBe('pdf');
  });

  it('accepts a genuine valid DOCX file with verified Office Open XML structure', () => {
    const validDocx = createValidDocxBuffer();
    const result = validateDocumentBuffer(validDocx, 'candidate-resume.docx');
    expect(result.isValid).toBe(true);
    expect(result.mimeType).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    expect(result.detectedFormat).toBe('docx');
  });

  it('rejects a fake DOCX file that only has raw Zip header without genuine Office Open XML package', () => {
    // Malformed pseudo-zip header with arbitrary text
    const zipHeader = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
    const opcPayload = Buffer.from('[Content_Types].xml ... word/document.xml');
    const fakeDocx = Buffer.concat([zipHeader, opcPayload, Buffer.alloc(1024, 0x20)]);

    const result = validateDocumentBuffer(fakeDocx, 'resume.docx');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Malformed or corrupt ZIP archive');
  });

  it('rejects a genuine ZIP archive that lacks word/document.xml', () => {
    const contentTypesXml = '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>';
    const entries = [{ name: '[Content_Types].xml', data: Buffer.from(contentTypesXml) }];
    const localHeaders: Buffer[] = [];
    const centralHeaders: Buffer[] = [];
    let offset = 0;
    for (const entry of entries) {
      const nameBuf = Buffer.from(entry.name);
      const def = zlib.deflateRawSync(entry.data);
      const lh = Buffer.alloc(30 + nameBuf.length);
      lh.writeUInt32LE(0x04034b50, 0);
      lh.writeUInt16LE(20, 4);
      lh.writeUInt16LE(8, 8);
      lh.writeUInt32LE(def.length, 18);
      lh.writeUInt32LE(entry.data.length, 22);
      lh.writeUInt16LE(nameBuf.length, 26);
      nameBuf.copy(lh, 30);
      const localOffset = offset;
      offset += lh.length + def.length;
      localHeaders.push(lh, def);

      const ch = Buffer.alloc(46 + nameBuf.length);
      ch.writeUInt32LE(0x02014b50, 0);
      ch.writeUInt16LE(8, 10);
      ch.writeUInt32LE(def.length, 20);
      ch.writeUInt32LE(entry.data.length, 24);
      ch.writeUInt16LE(nameBuf.length, 28);
      ch.writeUInt32LE(localOffset, 42);
      nameBuf.copy(ch, 46);
      centralHeaders.push(ch);
    }
    const centralDir = Buffer.concat(centralHeaders);
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(1, 8);
    eocd.writeUInt16LE(1, 10);
    eocd.writeUInt32LE(centralDir.length, 12);
    eocd.writeUInt32LE(offset, 16);
    const incompleteZip = Buffer.concat([...localHeaders, centralDir, eocd]);

    const result = validateDocumentBuffer(incompleteZip, 'incomplete.docx');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('missing word/document.xml component');
  });

  it('rejects DOCX packages containing embedded VBA macros (word/vbaProject.bin)', () => {
    const macroDocx = createValidDocxBuffer([
      { name: 'word/vbaProject.bin', data: Buffer.from('malicious_macro_bytecode') }
    ]);
    const result = validateDocumentBuffer(macroDocx, 'resume.docx');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('macro component detected');
  });

  it('rejects DOCX packages containing zip slip path traversal entries', () => {
    const traversalDocx = createValidDocxBuffer([
      { name: '../../evil.sh', data: Buffer.from('rm -rf /') }
    ]);
    const result = validateDocumentBuffer(traversalDocx, 'resume.docx');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Path traversal');
  });

  it('rejects macro-enabled .docm extensions directly', () => {
    const validDocx = createValidDocxBuffer();
    const result = validateDocumentBuffer(validDocx, 'resume.docm');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Macro-enabled');
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
    const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    const result = validateDocumentBuffer(exeBuffer, 'resume.pdf');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Unsupported document format');
  });

  it('rejects JavaScript / HTML content disguised as PDF', () => {
    const htmlBuffer = Buffer.from('%PDF-1.4\n<html><script>alert("test")</script></html>');
    const result = validateDocumentBuffer(htmlBuffer, 'resume.pdf');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('HTML or executable scripts cloaked as PDF are prohibited');
  });

  it('sanitizes unsafe filenames and removes path traversals', () => {
    expect(sanitizeFilename('../../etc/passwd.pdf')).toBe('passwd.pdf');
    expect(sanitizeFilename('my resume (final) [2026]!.pdf')).toBe('my_resume__final___2026__.pdf');
    expect(sanitizeFilename('clean-candidate_doc.docx')).toBe('clean-candidate_doc.docx');
  });
});
