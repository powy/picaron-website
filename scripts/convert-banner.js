const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convertBanner() {
  const inputPath = path.join(__dirname, '..', '..', 'Bandeau_au_dessus_de_la_video.png');
  const outputPathWebP = path.join(__dirname, '..', 'public', 'bandeau-video.webp');
  const outputPathPng = path.join(__dirname, '..', 'public', 'bandeau-video.png');

  console.log('🖼️  Converting banner image...');
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

    // Convert to WebP with high quality (90% to preserve text clarity)
    await sharp(inputPath)
      .webp({ quality: 90 })
      .toFile(outputPathWebP);

    const webpStats = fs.statSync(outputPathWebP);
    console.log(`✅ WebP created: ${outputPathWebP}`);
    console.log(`📊 WebP size: ${(webpStats.size / 1024).toFixed(2)} KB`);

    // Also create a PNG fallback (copy optimized version)
    await sharp(inputPath)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outputPathPng);

    const pngStats = fs.statSync(outputPathPng);
    console.log(`✅ PNG fallback created: ${outputPathPng}`);
    console.log(`📊 PNG size: ${(pngStats.size / 1024).toFixed(2)} KB`);

    const originalSize = fs.statSync(inputPath).size;
    const savings = ((originalSize - webpStats.size) / originalSize * 100).toFixed(1);
    console.log(`💾 Space saved: ${savings}% (WebP vs original)`);
    console.log('🎉 Conversion complete!');

  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    process.exit(1);
  }
}

convertBanner();
