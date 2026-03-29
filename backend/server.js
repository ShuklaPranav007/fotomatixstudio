const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const galleryRoutes = require('./routes/gallery');

app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('Server running on port 5000')))
  .catch(err => console.error(err));