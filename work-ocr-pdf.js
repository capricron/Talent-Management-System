const poppler = require('pdf-poppler'); // Library untuk mengonversi PDF menjadi gambar
const sharp = require('sharp'); // Library untuk memproses gambar (resize, gabung, dll.)
const Tesseract = require('tesseract.js'); // Library untuk Optical Character Recognition (OCR)
const fs = require('fs').promises; // Modul untuk operasi file dengan Promise
const path = require('path'); // Modul untuk bekerja dengan path file dan direktori

// Kelas untuk mengonversi PDF menjadi buffer gambar
class PDFToBufferProcessor {
  async convertPdfToBuffers(pdfPath) {
    const outputDir = './temp-images'; // Direktori sementara untuk menyimpan gambar hasil konversi
    await fs.mkdir(outputDir, { recursive: true }); // Buat direktori jika belum ada

    const options = {
      format: 'jpeg', // Format gambar yang dihasilkan
      out_dir: outputDir, // Direktori penyimpanan sementara
      out_prefix: path.basename(pdfPath, path.extname(pdfPath)), // Prefix nama file berdasarkan nama PDF
      page: null, // Konversi semua halaman
    };

    try {
      // Konversi PDF menjadi gambar dengan Poppler
      await poppler.convert(pdfPath, options);
      console.log('PDF converted to images successfully.');

      // Baca semua file gambar yang dihasilkan di direktori sementara
      const files = await fs.readdir(outputDir);
      console.log(`Gambar yang dikonversi:`, files);

      if (files.length === 0) {
        throw new Error('Tidak ada gambar yang dihasilkan dari PDF.');
      }

      // Baca setiap file gambar ke dalam buffer
      const buffers = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(outputDir, file); // Path lengkap file gambar
          const buffer = await fs.readFile(filePath); // Baca file sebagai buffer
          await fs.unlink(filePath); // Hapus file setelah selesai dibaca
          return buffer; // Kembalikan buffer gambar
        })
      );

      await fs.rmdir(outputDir); // Hapus direktori sementara setelah selesai
      return buffers; // Kembalikan semua buffer gambar
    } catch (error) {
      console.error('Error converting PDF to image buffers:', error);
      throw error;
    }
  }
}

// Kelas untuk memproses gambar dan mengekstrak teks dengan OCR
class ImageTextExtractor {
  async mergeImages(imageBuffers) {
    // Gabungkan semua gambar halaman menjadi satu gambar besar
    const images = await Promise.all(
      imageBuffers.map(buffer => sharp(buffer).raw().toBuffer({ resolveWithObject: true }))
    );

    // Hitung total tinggi gambar gabungan
    const totalHeight = images.reduce((sum, img) => sum + img.info.height, 0);
    const width = images[0].info.width; // Asumsi semua gambar memiliki lebar yang sama

    // Buat gambar gabungan dengan ukuran yang ditentukan
    const mergedImage = sharp({
      create: {
        width: width, // Lebar gambar gabungan
        height: totalHeight, // Tinggi total gambar gabungan
        channels: 3, // Saluran warna (RGB)
        background: { r: 255, g: 255, b: 255 }, // Latar belakang putih
      },
    });

    // Gabungkan setiap gambar pada posisi vertikal
    let top = 0;
    for (const img of images) {
      mergedImage.composite([{ input: img.data, raw: img.info, top: top, left: 0 }]);
      top += img.info.height; // Geser posisi untuk gambar berikutnya
    }

    return mergedImage.png().toBuffer(); // Kembalikan buffer gambar gabungan dalam format PNG
  }

  async extractText(imageBuffer) {
    // Gunakan Tesseract untuk melakukan OCR pada gambar
    const { data: { text } } = await Tesseract.recognize(imageBuffer);
    return text.trim(); // Kembalikan teks yang telah diekstrak dan bersih
  }

  async processAllImages(imageBuffers) {
    try {
      // Gabungkan semua gambar dan lakukan OCR pada gambar gabungan
      const mergedImage = await this.mergeImages(imageBuffers);
      const text = await this.extractText(mergedImage);
      console.log('Extracted Text:', text); // Cetak teks hasil OCR
    } catch (error) {
      console.error('Error processing merged image:', error);
    }
  }
}

// Fungsi utama untuk memproses PDF
async function processPdf(pdfPath) {
  const pdfProcessor = new PDFToBufferProcessor(); // Instansiasi kelas PDFToBufferProcessor
  const imageExtractor = new ImageTextExtractor(); // Instansiasi kelas ImageTextExtractor

  try {
    // Konversi PDF menjadi buffer gambar
    const imageBuffers = await pdfProcessor.convertPdfToBuffers(pdfPath);
    console.log(`Total image buffers: ${imageBuffers.length}`); // Tampilkan jumlah buffer gambar

    // Proses semua buffer gambar sekaligus
    await imageExtractor.processAllImages(imageBuffers);
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

// Jalankan proses untuk file PDF
processPdf('./tes.pdf'); // Ganti dengan path PDF Anda
