#!/usr/bin/env node

/**
 * Image Optimization Script for Korean Church Website
 *
 * Features:
 * - Backs up original images before optimization
 * - Converts PNG to WebP (smaller file size)
 * - Optimizes JPEG with quality 80
 * - Resizes large images to max 2048px
 * - Generates detailed report
 *
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  sourceDir: path.join(__dirname, '../public/images'),
  backupDir: path.join(__dirname, '../public/images/_backup_originals'),
  maxWidth: 2048,
  maxHeight: 2048,
  jpegQuality: 80,
  webpQuality: 80,
  pngCompressionLevel: 9,
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'],
  skipDirs: ['_backup_originals'],
  convertPngToWebp: false, // Set to true to convert PNG to WebP
};

// Statistics tracking
const stats = {
  totalFiles: 0,
  processedFiles: 0,
  skippedFiles: 0,
  errorFiles: 0,
  originalSize: 0,
  optimizedSize: 0,
  fileDetails: [],
};

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Get all image files recursively
 */
function getImageFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip backup directory
      if (CONFIG.skipDirs.includes(item)) continue;
      getImageFiles(fullPath, files);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (CONFIG.supportedExtensions.map(e => e.toLowerCase()).includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Backup original file
 */
function backupFile(sourcePath) {
  const relativePath = path.relative(CONFIG.sourceDir, sourcePath);
  const backupPath = path.join(CONFIG.backupDir, relativePath);

  ensureDir(path.dirname(backupPath));

  // Only backup if not already backed up
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(sourcePath, backupPath);
    return true;
  }
  return false;
}

/**
 * Optimize single image
 */
async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const originalStats = fs.statSync(filePath);
  const originalSize = originalStats.size;

  stats.originalSize += originalSize;

  try {
    // Read image and get metadata
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;

    // Resize if too large (maintaining aspect ratio)
    if (metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight) {
      pipeline = pipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Determine output format and options
    let outputPath = filePath;
    let outputBuffer;

    if (ext === '.png') {
      if (CONFIG.convertPngToWebp) {
        // Convert PNG to WebP
        outputPath = filePath.replace(/\.png$/i, '.webp');
        outputBuffer = await pipeline
          .webp({ quality: CONFIG.webpQuality })
          .toBuffer();
      } else {
        // Keep as PNG but optimize
        outputBuffer = await pipeline
          .png({ compressionLevel: CONFIG.pngCompressionLevel })
          .toBuffer();
      }
    } else if (ext === '.jpg' || ext === '.jpeg') {
      outputBuffer = await pipeline
        .jpeg({ quality: CONFIG.jpegQuality, mozjpeg: true })
        .toBuffer();
    } else if (ext === '.webp') {
      outputBuffer = await pipeline
        .webp({ quality: CONFIG.webpQuality })
        .toBuffer();
    } else {
      // For other formats, just resize if needed
      outputBuffer = await pipeline.toBuffer();
    }

    // Write optimized image
    fs.writeFileSync(outputPath, outputBuffer);

    // If converted to webp, delete original PNG
    if (CONFIG.convertPngToWebp && ext === '.png' && outputPath !== filePath) {
      fs.unlinkSync(filePath);
    }

    const optimizedSize = outputBuffer.length;
    stats.optimizedSize += optimizedSize;
    stats.processedFiles++;

    const savings = originalSize - optimizedSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

    const relativePath = path.relative(CONFIG.sourceDir, filePath);

    stats.fileDetails.push({
      file: relativePath,
      originalSize,
      optimizedSize,
      savings,
      savingsPercent: parseFloat(savingsPercent),
      dimensions: `${metadata.width}x${metadata.height}`,
    });

    console.log(`  ✓ ${relativePath}`);
    console.log(`    ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)} (${savingsPercent}% saved)`);

  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}: ${error.message}`);
    stats.errorFiles++;
    stats.optimizedSize += originalSize; // Count original size for failed files
  }
}

/**
 * Generate optimization report
 */
function generateReport() {
  const totalSavings = stats.originalSize - stats.optimizedSize;
  const totalSavingsPercent = ((totalSavings / stats.originalSize) * 100).toFixed(1);

  const report = {
    summary: {
      totalFiles: stats.totalFiles,
      processedFiles: stats.processedFiles,
      skippedFiles: stats.skippedFiles,
      errorFiles: stats.errorFiles,
      originalSize: formatBytes(stats.originalSize),
      optimizedSize: formatBytes(stats.optimizedSize),
      totalSavings: formatBytes(totalSavings),
      savingsPercent: totalSavingsPercent + '%',
    },
    topSavings: stats.fileDetails
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 10)
      .map(f => ({
        file: f.file,
        savings: formatBytes(f.savings),
        percent: f.savingsPercent + '%',
      })),
    timestamp: new Date().toISOString(),
  };

  // Write report to file
  const reportPath = path.join(__dirname, '../optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('                  OPTIMIZATION REPORT');
  console.log('='.repeat(60));
  console.log(`\n  Total Files Processed: ${stats.processedFiles}/${stats.totalFiles}`);
  console.log(`  Errors: ${stats.errorFiles}`);
  console.log(`\n  Original Size:  ${formatBytes(stats.originalSize)}`);
  console.log(`  Optimized Size: ${formatBytes(stats.optimizedSize)}`);
  console.log(`  Total Savings:  ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
  console.log('\n  Top 10 Files with Most Savings:');

  report.topSavings.forEach((f, i) => {
    console.log(`    ${i + 1}. ${f.file}`);
    console.log(`       Saved: ${f.savings} (${f.percent})`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(`  Report saved to: optimization-report.json`);
  console.log(`  Backups saved to: public/images/_backup_originals/`);
  console.log('='.repeat(60) + '\n');

  return report;
}

/**
 * Main function
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('       Korean Church Website - Image Optimizer');
  console.log('='.repeat(60));
  console.log('\n  Configuration:');
  console.log(`    Max dimensions: ${CONFIG.maxWidth}x${CONFIG.maxHeight}px`);
  console.log(`    JPEG quality: ${CONFIG.jpegQuality}%`);
  console.log(`    WebP quality: ${CONFIG.webpQuality}%`);
  console.log(`    Convert PNG to WebP: ${CONFIG.convertPngToWebp}`);

  // Ensure backup directory exists
  ensureDir(CONFIG.backupDir);

  // Get all image files
  console.log('\n  Scanning for images...');
  const imageFiles = getImageFiles(CONFIG.sourceDir);
  stats.totalFiles = imageFiles.length;

  console.log(`  Found ${stats.totalFiles} images to process\n`);

  if (stats.totalFiles === 0) {
    console.log('  No images found to optimize.');
    return;
  }

  // Backup and optimize each image
  console.log('  Processing images:\n');

  for (const filePath of imageFiles) {
    // Backup original
    backupFile(filePath);

    // Optimize
    await optimizeImage(filePath);
  }

  // Generate report
  generateReport();
}

// Run the optimizer
main().catch(console.error);
