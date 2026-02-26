const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const inputDir = path.join(__dirname, '../public/cards')
const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'))

async function convertToWebP() {
  console.log('🚀 Début de la conversion PNG → WebP\n')

  for (const file of files) {
    const inputPath = path.join(inputDir, file)
    const outputPath = path.join(inputDir, file.replace('.png', '.webp'))

    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath)

    const inputSize = fs.statSync(inputPath).size / 1024 / 1024
    const outputSize = fs.statSync(outputPath).size / 1024 / 1024
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1)

    console.log(`✓ ${file}`)
    console.log(`  ${inputSize.toFixed(2)} MB → ${outputSize.toFixed(2)} MB (${reduction}% réduit)\n`)
  }

  console.log(`✅ ${files.length} images converties en WebP`)
}

convertToWebP().catch(console.error)
