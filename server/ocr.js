const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const fs = require('fs');

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

// Jalankan script
const extractor = new ImageTextExtractor();
extractor.processImage('./tes.png'); // Ganti dengan path gambar Anda
