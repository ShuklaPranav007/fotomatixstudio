const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Media = require('../models/Media');
const protect = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    console.log('Upload hit');
    console.log('Body:', req.body);
    console.log('File:', req.file?.originalname);

    if (!req.file) return res.status(400).json({ message: 'No file received' });

    const { title, category, type } = req.body;

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'gallery', resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    console.log('Cloudinary upload success:', uploadResult.secure_url);

    const media = await Media.create({
      title,
      category,
      type,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    res.status(201).json(media);
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Not found' });
    await cloudinary.uploader.destroy(media.publicId);
    await media.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;