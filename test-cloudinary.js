require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.api.ping()
  .then(res => {
    console.log('✅ Successfully connected to Cloudinary!');
    console.log(res);
  })
  .catch(err => {
    console.error('❌ Failed to connect to Cloudinary!');
    console.error(err);
  });
