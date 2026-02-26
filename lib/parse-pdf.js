// ============================================
// PDF PARSING — Extract text and images from uploaded files
// ============================================

/**
 * Extract text from a PDF buffer.
 * Falls back to returning empty string on failure.
 */
async function extractTextFromPDF(buffer) {
  try {
    const { default: pdfParse } = await import('pdf-parse');
    const result = await pdfParse(buffer);
    return result.text || '';
  } catch (err) {
    console.error('PDF parse error:', err.message);
    return '';
  }
}

/**
 * Extract the first/largest image from a PDF buffer.
 * Returns a base64 data URL string or null if no image found.
 * Uses pdfjs-dist to iterate through page operators and find embedded images.
 * 
 * NOTE: Disabled on Lambda/serverless due to missing canvas/DOMMatrix dependencies.
 */
async function extractImageFromPDF(buffer) {
  // Skip image extraction in serverless environments (Lambda doesn't have canvas)
  if (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.AMPLIFY_DEPLOYMENT) {
    console.log('PDF image extraction skipped in serverless environment');
    return null;
  }
  
  try {
    // Use the legacy build of pdfjs-dist for Node.js compatibility
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const uint8 = new Uint8Array(buffer);
    const doc = await pdfjsLib.getDocument({ data: uint8, useSystemFonts: true }).promise;

    let bestImage = null;
    let bestSize = 0;

    // Scan first 3 pages max (profile pictures are usually on page 1)
    const pagesToScan = Math.min(doc.numPages, 3);

    for (let pageNum = 1; pageNum <= pagesToScan; pageNum++) {
      const page = await doc.getPage(pageNum);
      const ops = await page.getOperatorList();

      for (let i = 0; i < ops.fnArray.length; i++) {
        // OPS.paintImageXObject = 85, OPS.paintJpegXObject = 82
        if (ops.fnArray[i] === 85 || ops.fnArray[i] === 82) {
          const imgName = ops.argsArray[i][0];
          try {
            const img = await page.objs.get(imgName);
            if (img && img.data && img.width && img.height) {
              const pixelCount = img.width * img.height;
              // Look for images that could be a profile photo (reasonable size, roughly square-ish)
              const aspectRatio = img.width / img.height;
              const isReasonableSize = pixelCount > 2500 && pixelCount < 25000000; // between 50x50 and ~5000x5000
              const isNotTooWide = aspectRatio < 4 && aspectRatio > 0.25; // not a banner/line

              if (isReasonableSize && isNotTooWide && pixelCount > bestSize) {
                bestSize = pixelCount;
                bestImage = img;
              }
            }
          } catch (e) {
            // Skip images we can't decode
          }
        }
      }
    }

    if (!bestImage) return null;

    // Convert raw RGBA/RGB pixel data to a PNG using canvas-like approach
    // Since we're in Node.js without canvas, we'll create a raw PNG
    return rawImageToDataURL(bestImage);
  } catch (err) {
    console.error('PDF image extraction error:', err.message);
    return null;
  }
}

/**
 * Convert a pdfjs image object (with .data, .width, .height) to a base64 PNG data URL.
 * The data is raw pixel data (RGBA or RGB).
 */
function rawImageToDataURL(img) {
  try {
    const { width, height, data } = img;
    const channels = data.length / (width * height);

    // Create raw RGBA pixel buffer
    const rgba = new Uint8Array(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      if (channels >= 4) {
        rgba[i * 4] = data[i * 4];
        rgba[i * 4 + 1] = data[i * 4 + 1];
        rgba[i * 4 + 2] = data[i * 4 + 2];
        rgba[i * 4 + 3] = data[i * 4 + 3];
      } else if (channels >= 3) {
        rgba[i * 4] = data[i * 3];
        rgba[i * 4 + 1] = data[i * 3 + 1];
        rgba[i * 4 + 2] = data[i * 3 + 2];
        rgba[i * 4 + 3] = 255;
      } else {
        // Grayscale
        rgba[i * 4] = data[i];
        rgba[i * 4 + 1] = data[i];
        rgba[i * 4 + 2] = data[i];
        rgba[i * 4 + 3] = 255;
      }
    }

    // Encode as a simple BMP and convert to base64
    // Using BMP because PNG encoding without a library is complex
    // BMP format: header (54 bytes) + pixel data
    const bmpSize = 54 + rgba.length;
    const bmp = Buffer.alloc(bmpSize);

    // BMP Header
    bmp.write('BM', 0);
    bmp.writeUInt32LE(bmpSize, 2);
    bmp.writeUInt32LE(0, 6);
    bmp.writeUInt32LE(54, 10);

    // DIB Header (BITMAPINFOHEADER)
    bmp.writeUInt32LE(40, 14);
    bmp.writeInt32LE(width, 18);
    bmp.writeInt32LE(-height, 22); // negative = top-down
    bmp.writeUInt16LE(1, 26); // planes
    bmp.writeUInt16LE(32, 28); // bits per pixel (BGRA)
    bmp.writeUInt32LE(0, 30); // compression
    bmp.writeUInt32LE(rgba.length, 34);
    bmp.writeInt32LE(2835, 38); // x pixels per meter
    bmp.writeInt32LE(2835, 42); // y pixels per meter

    // Write pixel data (convert RGBA to BGRA for BMP)
    for (let i = 0; i < width * height; i++) {
      const offset = 54 + i * 4;
      bmp[offset] = rgba[i * 4 + 2];     // B
      bmp[offset + 1] = rgba[i * 4 + 1]; // G
      bmp[offset + 2] = rgba[i * 4];     // R
      bmp[offset + 3] = rgba[i * 4 + 3]; // A
    }

    const base64 = bmp.toString('base64');
    return `data:image/bmp;base64,${base64}`;
  } catch (err) {
    console.error('Image conversion error:', err.message);
    return null;
  }
}

/**
 * Extract text from uploaded file based on type.
 * Supports PDF and plain text files.
 */
async function extractText(buffer, filename) {
  const ext = (filename || '').toLowerCase().split('.').pop();

  if (ext === 'pdf') {
    return extractTextFromPDF(buffer);
  }

  if (['txt', 'md', 'csv', 'json'].includes(ext)) {
    return buffer.toString('utf-8');
  }

  // Try as text, fall back to empty
  try {
    return buffer.toString('utf-8');
  } catch {
    return '';
  }
}

export { extractText, extractTextFromPDF, extractImageFromPDF };
