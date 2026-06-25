const cloudinary = require('cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wonderlust_DEV',
    allowedFormats: ["png", "jpg", "jpeg"],
    transformation: [{ width: 1600, height: 1200, crop: "limit", quality: "auto" }]
  },
});

module.exports = {
  cloudinary: cloudinary.v2,
  storage,
};