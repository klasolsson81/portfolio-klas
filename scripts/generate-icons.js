import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const sourcePath = join(projectRoot, 'src', 'assets', 'aiklas.png');
const publicDir = join(projectRoot, 'public');

async function generateIcons() {
  try {
    console.log('Generating PWA icons from aiklas.png...');

    // Generate 192x192 icon
    await sharp(sourcePath)
      .resize(192, 192, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(join(publicDir, 'pwa-192x192.png'));
    console.log('✓ Created pwa-192x192.png');

    // Generate 512x512 icon
    await sharp(sourcePath)
      .resize(512, 512, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(join(publicDir, 'pwa-512x512.png'));
    console.log('✓ Created pwa-512x512.png');

    // Generate apple-touch-icon (180x180)
    await sharp(sourcePath)
      .resize(180, 180, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'));
    console.log('✓ Created apple-touch-icon.png');

    console.log('\n✅ All PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
