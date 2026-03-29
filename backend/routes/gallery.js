const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Media = require('../models/Media');
const protect = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'gallery', resource_type: 'auto' },
});
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
    const { title, category, type } = req.body;
    const media = await Media.create({
      title, category, type,
      url: req.file.path,
      publicId: req.file.filename,
    });
    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    await cloudinary.uploader.destroy(media.publicId);
    await media.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;