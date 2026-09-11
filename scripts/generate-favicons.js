/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

function buildIco(pngBuffers, sizes) {
  const count = sizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // count

  const entries = [];
  let offset = 6 + count * 16;

  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(buf.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  const rootDir = path.resolve(__dirname, '..', '..');
  const clientDir = path.resolve(rootDir, 'client');
  const adminDir = path.resolve(rootDir, 'admin');

  const inputPath = path.join(clientDir, 'public', 'logo-icon.jpg');

  // 1. Center the emblem nicely inside 800x800
  const emblem = await sharp(inputPath)
    .extract({ left: 75, top: 20, width: 710, height: 765 })
    .resize(680, 680, { fit: 'contain', background: { r: 1, g: 10, b: 25, alpha: 1 } })
    .toBuffer();

  const canvas = await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 1, g: 10, b: 25, alpha: 1 }
    }
  })
  .composite([{ input: emblem, top: 60, left: 60 }])
  .png()
  .toBuffer();

  // 2. Apply smooth circular badge mask
  const circleMask = Buffer.from(
    '<svg width="800" height="800"><circle cx="400" cy="400" r="385" fill="white"/></svg>'
  );
  const baseMaster = await sharp(canvas)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 3. Generate PNGs at various resolutions
  const [png16, png32, png48, png180, png192, png512] = await Promise.all([
    sharp(baseMaster).resize(16, 16).png().toBuffer(),
    sharp(baseMaster).resize(32, 32).png().toBuffer(),
    sharp(baseMaster).resize(48, 48).png().toBuffer(),
    sharp(baseMaster).resize(180, 180).png().toBuffer(),
    sharp(baseMaster).resize(192, 192).png().toBuffer(),
    sharp(baseMaster).resize(512, 512).png().toBuffer(),
  ]);

  // 4. Build multi-resolution ICO file
  const icoBuffer = buildIco([png16, png32, png48], [16, 32, 48]);

  // 5. Target destinations
  const clientTargets = [
    { file: path.join(clientDir, 'src', 'app', 'favicon.ico'), data: icoBuffer },
    { file: path.join(clientDir, 'src', 'app', 'icon.png'), data: png512 },
    { file: path.join(clientDir, 'src', 'app', 'apple-icon.png'), data: png180 },
    { file: path.join(clientDir, 'public', 'favicon.ico'), data: icoBuffer },
    { file: path.join(clientDir, 'public', 'icon.png'), data: png32 },
    { file: path.join(clientDir, 'public', 'apple-icon.png'), data: png180 },
    { file: path.join(clientDir, 'public', 'icon-192.png'), data: png192 },
    { file: path.join(clientDir, 'public', 'icon-512.png'), data: png512 },
  ];

  const adminTargets = [
    { file: path.join(adminDir, 'src', 'app', 'favicon.ico'), data: icoBuffer },
    { file: path.join(adminDir, 'src', 'app', 'icon.png'), data: png512 },
    { file: path.join(adminDir, 'src', 'app', 'apple-icon.png'), data: png180 },
    { file: path.join(adminDir, 'public', 'favicon.ico'), data: icoBuffer },
    { file: path.join(adminDir, 'public', 'icon.png'), data: png32 },
    { file: path.join(adminDir, 'public', 'apple-icon.png'), data: png180 },
    { file: path.join(adminDir, 'public', 'icon-192.png'), data: png192 },
    { file: path.join(adminDir, 'public', 'icon-512.png'), data: png512 },
  ];

  for (const target of [...clientTargets, ...adminTargets]) {
    fs.mkdirSync(path.dirname(target.file), { recursive: true });
    fs.writeFileSync(target.file, target.data);
    console.log('Wrote:', target.file);
  }

  // Clean up temporary test files
  const testFiles = [
    'test-circular.png',
    'test-square.png',
    'test-feathered.png',
    'test-32.png',
    'test-hex-transparent.png',
    'test-centered-circle.png',
    'test-centered-square.png',
  ];
  for (const tf of testFiles) {
    const p = path.join(clientDir, 'public', tf);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  console.log('Favicons and app icons generated successfully!');
}

main().catch(console.error);
