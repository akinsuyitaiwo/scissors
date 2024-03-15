import  qr from 'qrcode';
import  fs from 'fs';

// Function to generate QR code
export async function generateQRCode(data: string, filePath: string): Promise<void> {
    try {
        const qrCodeDataUrl = await qr.toDataURL(data);
        // Convert Data URL to base64
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

        // Write QR code to file
        fs.writeFileSync(filePath, base64Data, 'base64');
        console.log('QR code generated successfully!');
    } catch (err) {
        console.error('Error generating QR code:', err);
    }
}

// Example usage
const data = 'https://example.com'; // Data you want to encode in QR code
const filePath = 'example.png'; // File path to save the generated QR code

generateQRCode(data, filePath);

