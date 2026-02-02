const mongoose = require('mongoose');

// Resume schema - stores uploaded resume details
const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true // actual file name saved on disk
  },
  originalName: {
    type: String,
    required: true // name user gave to this resume version
  },
  notes: {
    type: String,
    default: '' // optional notes about this resume
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);