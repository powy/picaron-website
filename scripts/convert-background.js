const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convertBackground() {
  const inputPath = path.join(__dirname, '..', '..', '20251120', 'FondLUMINEUX.jpg');
  const outputPathWebP = path.join(__dirname, '..', 'public', 'background-lumineux.webp');
  const outputPathJpg = path.join(__dirname, '..', 'public', 'background-lumineux.jpg');

  console.log('🖼️  Converting background image...');
  console.log(`📁 Input: ${inputPath}`);

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: Input file not found at ${inputPath}`);
    process.exit(1);
  }

  try {
    // Get original image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`📐 Original dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`📦 Original format: ${metadata.format}`);

    // Convert to WebP with optimization
    await sharp(inputPath)
      .resize(1920, null, { // Resize to 1920px width, maintain aspect ratio
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 }) // 80% quality for good balance
      .toFile(outputPathWebP);

    const webpStats = fs.statSync(outputPathWebP);
    console.log(`✅ WebP created: ${outputPathWebP}`);
    console.log(`📊 WebP size: ${(webpStats.size / 1024).toFixed(2)} KB`);

    // Also create an optimized JPG fallback
    await sharp(inputPath)
      .resize(1920, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(outputPathJpg);

    const jpgStats = fs.statSync(outputPathJpg);
    console.log(`✅ JPG fallback created: ${outputPathJpg}`);
    console.log(`📊 JPG size: ${(jpgStats.size / 1024).toFixed(2)} KB`);

    const originalSize = fs.statSync(inputPath).size;
    const savings = ((originalSize - webpStats.size) / originalSize * 100).toFixed(1);
    console.log(`💾 Space saved: ${savings}% (WebP vs original)`);
    console.log('🎉 Conversion complete!');

  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    process.exit(1);
  }
}

convertBackground();
