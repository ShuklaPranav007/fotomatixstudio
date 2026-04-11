const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const galleryRoutes = require('./routes/gallery');
const sectionRoutes = require('./routes/sections');

app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/sections', sectionRoutes);

const Admin = require('./models/Admin');
const Section = require('./models/Section');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('db connected');

    const admin1 = await Admin.findOne({ username: 'shuklapranav739@gmail.com' });
    if (!admin1) {
      const hashed = await bcrypt.hash('sprnv007', 10);
      await Admin.create({ username: 'shuklapranav739@gmail.com', password: hashed });
      console.log('Admin 1 created');
    }

    const admin2 = await Admin.findOne({ username: 'fotomatixstudio99@gmail.com' });
    if (!admin2) {
      const hashed = await bcrypt.hash('foto8960', 10);
      await Admin.create({ username: 'fotomatixstudio99@gmail.com', password: hashed });
      console.log('Admin 2 created');
    }

    const sectionCount = await Section.countDocuments();
    if (sectionCount === 0) {
      await Section.insertMany([
        { name: 'Hero', visible: true, order: 0 },
        { name: 'About', visible: true, order: 1 },
        { name: 'Gallery', visible: true, order: 2 },
        { name: 'Contact', visible: true, order: 3 },
      ]);
      console.log('Default sections created');
    }

    app.listen(process.env.PORT || 5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error('DB connection failed:', err.message));