import fs from 'fs';
import path from 'path';
import https from 'https';

const FONTS_DIR = path.join(__dirname, '../assets/fonts');

// Noto Sans Hebrew font URLs from Google Fonts
const FONT_URLS = {
  'NotoSansHebrew-Regular.ttf': 'https://fonts.gstatic.com/s/notosanshebrew/v43/nwpBtKU3N_yfQHssCVXXkO2hkKU1Abq-J_9NZjQtaGXaRQtK.ttf',
  'NotoSansHebrew-Bold.ttf': 'https://fonts.gstatic.com/s/notosanshebrew/v43/nwpBtKU3N_yfQHssCVXXkO2hkKU1Abq-J_9NZjQtaGXaRQtK.ttf'
};

/**
 * Download a font file from URL
 */
async function downloadFont(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(FONTS_DIR, filename);
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Download all Hebrew fonts
 */
export async function downloadHebrewFonts(): Promise<void> {
  try {
    // Ensure fonts directory exists
    if (!fs.existsSync(FONTS_DIR)) {
      fs.mkdirSync(FONTS_DIR, { recursive: true });
    }

    console.log('Downloading Hebrew fonts...');

    // Download regular font
    await downloadFont(FONT_URLS['NotoSansHebrew-Regular.ttf'], 'NotoSansHebrew-Regular.ttf');
    
    // For now, use the same font for bold (we can get the actual bold version later)
    await downloadFont(FONT_URLS['NotoSansHebrew-Bold.ttf'], 'NotoSansHebrew-Bold.ttf');

    console.log('All Hebrew fonts downloaded successfully!');
  } catch (error) {
    console.error('Error downloading fonts:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  downloadHebrewFonts().catch(console.error);
}