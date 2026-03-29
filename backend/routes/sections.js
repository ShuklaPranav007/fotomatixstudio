const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const protect = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const sections = await Section.find().sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;