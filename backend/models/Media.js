const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  category:  { type: String, enum: ['wedding', 'birthday', 'portrait', 'video'], required: true },
  url:       { type: String, required: true },  // Cloudinary URL
  publicId:  { type: String },                  // for deletion
  type:      { type: String, enum: ['image', 'video'], default: 'image' },
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);