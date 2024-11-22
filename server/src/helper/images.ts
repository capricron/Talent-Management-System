const fs = require('fs').promises;
const path = require('path');

async function saveAsPdf(cv) {
  try {
    const file_path = `tes.pdf`;

    // Validasi jika file tidak ada
    if (!cv) {
      throw {
        message: `File PDF tidak diupload`,
        status: 400,
        error: 'file_not_found',
      };
    }

    // Validasi ukuran file
    const fileSizeInBytes = cv.size || 0;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    if (fileSizeInMegabytes > 10) {
      throw new Error('Maksimal upload 10MB ya, lebih aku cium~~');
    }

    // Konversi ke Buffer
    const fileBuffer = Buffer.isBuffer(cv)
      ? cv
      : Buffer.from(await cv.arrayBuffer());

    // Buat folder jika belum ada
    await fs.mkdir(`./public/pdf/${path}`, { recursive: true });

    // Tulis file PDF ke path
    await fs.writeFile(file_path, fileBuffer);

    return file_path;
  } catch (err) {
    console.error('Error creating PDF:', err);
    throw err;
  }
}

export default saveAsPdf