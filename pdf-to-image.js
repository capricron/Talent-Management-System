const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const poppler = require('pdf-poppler');


class ImageTextExtractor {
    async preprocessImage(imagePath) {
        // Konversi gambar ke grayscale dan threshold menggunakan Sharp
        return sharp(imagePath)
            .grayscale()
            .threshold(128) // Threshold untuk binary image
            .toBuffer();
    }

    async extractText(imageBuffer) {
        // Gunakan Tesseract untuk mengekstrak teks dari buffer gambar
        const { data: { text } } = await Tesseract.recognize(imageBuffer);
        return text;
    }

    async processImage(imagePath) {
        try {
            const preprocessedImage = await this.preprocessImage(imagePath);
            const text = await this.extractText(preprocessedImage);
            console.log('Extracted Text:', text);
        } catch (error) {
            console.error(`Error processing image: ${error}`);
        }
    }
}

async function convertPdfToImages(pdfPath, outputDir) {
    // Buat direktori output jika belum ada
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const options = {
        format: 'jpeg',                 // Format gambar hasil konversi
        out_dir: outputDir,             // Direktori penyimpanan gambar
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)), // Nama prefix file
        page: null                      // Null untuk konversi semua halaman
    };

    try {
        console.log(await poppler.convert(pdfPath, options));
        console.log('PDF converted to images successfully.');
    } catch (error) {
        console.error('Error converting PDF to images:', error);
    }
}

// Jalankan konversi dengan menentukan path PDF dan direktori output
const pdfPath = './tes.pdf'; // Ganti dengan path PDF Anda
const outputDir = './pdf-images';

convertPdfToImages(pdfPath, outputDir);

// Jalankan script
const extractor = new ImageTextExtractor();
extractor.processImage('./pdf-images/tes-2.jpg');