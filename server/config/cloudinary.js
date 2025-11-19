import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure dotenv is loaded
dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Cloudinary Config:', {
  cloud_name: cloudName ? 'Set' : 'Missing',
  api_key: apiKey ? 'Set' : 'Missing',
  api_secret: apiSecret ? 'Set' : 'Missing'
});

if (!cloudName || !apiKey || !apiSecret) {
  console.error('WARNING: Cloudinary credentials are missing!');
  console.error('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env file');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

export default cloudinary;
