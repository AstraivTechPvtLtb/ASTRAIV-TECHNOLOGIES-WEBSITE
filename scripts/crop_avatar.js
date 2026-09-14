const sharp = require('sharp');
const fs = require('fs');

async function processAvatar() {
  const mask = Buffer.from(
    '<svg width="256" height="256"><circle cx="128" cy="128" r="126" fill="white" /></svg>'
  );

  await sharp('C:/Users/abdev/.gemini/antigravity-ide/brain/6d8f9f16-85a8-4602-b6cf-1bae09a1e3db/.user_uploaded/media_1789374950433.png')
    .extract({ left: 556, top: 148, width: 60, height: 60 })
    .resize(256, 256, { kernel: 'lanczos3' })
    .composite([{
      input: mask,
      blend: 'dest-in'
    }])
    .png()
    .toFile('public/images/testimonials/alex-avatar.png');

  // Also copy to admin public so admin preview has it too
  if (!fs.existsSync('../admin/public/images/testimonials')) {
    fs.mkdirSync('../admin/public/images/testimonials', { recursive: true });
  }
  fs.copyFileSync('public/images/testimonials/alex-avatar.png', '../admin/public/images/testimonials/alex-avatar.png');
  console.log('Saved alex-avatar.png to client and admin public directories!');
}

processAvatar().catch(console.error);
