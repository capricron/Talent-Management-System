const poppler = require('pdf-poppler');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');

class PDFToBufferProcessor {
  async convertPdfToBuffers(pdfPath) {
    const outputDir = './temp-images'; // Direktori sementara untuk konversi
    await fs.mkdir(outputDir, { recursive: true }); // Buat folder jika belum ada

    const options = {
      format: 'jpeg',
      out_dir: outputDir,
      out_prefix: path.basename(pdfPath, path.extname(pdfPath)), // Nama prefix file berdasarkan nama PDF
      page: null, // Konversi semua halaman
    };

    try {
      await poppler.convert(pdfPath, options);
      console.log('PDF converted to images successfully.');

      const files = await fs.readdir(outputDir);
      console.log(`Gambar yang dikonversi:`, files);

      if (files.length === 0) {
        throw new Error('Tidak ada gambar yang dihasilkan dari PDF.');
      }

      const buffers = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(outputDir, file);
          const buffer = await fs.readFile(filePath);
          await fs.unlink(filePath); // Hapus file setelah membaca buffer
          return buffer;
        })
      );

      // Bersihkan folder setelah selesai
      await fs.rmdir(outputDir);
      return buffers;
    } catch (error) {
      console.error('Error converting PDF to image buffers:', error);
      throw error;
    }
  }
}

class ImageTextExtractor {
  async preprocessImage(imageBuffer) {
    return sharp(imageBuffer)
      .grayscale() // Ubah gambar ke grayscale
      .threshold(128) // Terapkan threshold untuk binary image
      .toBuffer();
  }

  async extractText(imageBuffer) {
    const { data: { text } } = await Tesseract.recognize(imageBuffer); // Jalankan OCR
    return text.trim(); // Kembalikan teks yang sudah dibersihkan
  }

  async processBuffer(imageBuffer) {
    try {
      const preprocessedImage = await this.preprocessImage(imageBuffer);
      const text = await this.extractText(preprocessedImage);
      return text; // Kembalikan hasil OCR untuk buffer ini
    } catch (error) {
      console.error('Error processing image buffer:', error);
      return ''; // Kembalikan teks kosong jika terjadi error
    }
  }
}

async function processPdf(pdfPath) {
  const pdfProcessor = new PDFToBufferProcessor();
  const imageExtractor = new ImageTextExtractor();

  try {
    const imageBuffers = await pdfProcessor.convertPdfToBuffers(pdfPath);
    console.log(`Total image buffers: ${imageBuffers.length}`);

    let fullText = ''; // String untuk menyimpan teks gabungan dari semua halaman

    for (const imageBuffer of imageBuffers) {
      const text = await imageExtractor.processBuffer(imageBuffer);
      fullText += text + '\n\n'; // Gabungkan teks dengan pemisah antar halaman
    }

    console.log('Full Extracted Text:\n', fullText); // Cetak hasil akhir semua halaman
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

// Jalankan proses untuk file PDF
processPdf('./tes.pdf'); // Ganti dengan path PDF Anda
