const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const protect = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save to uploads folder
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp + original name
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// File filter - only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
});

// @route   POST /api/resumes/upload
// @desc    Upload a new resume
// @access  Private
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    const { originalName, notes } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Check if resume name is provided
    if (!originalName) {
      return res.status(400).json({ message: 'Please provide a name for this resume' });
    }

    // Create resume entry in database
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.filename, // File saved on disk
      originalName: originalName, // User-friendly name
      notes: notes || ''
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/resumes
// @desc    Get all resumes for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Find all resumes belonging to this user
    const resumes = await Resume.find({ userId: req.user._id }).sort({ uploadDate: -1 });
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/resumes/:id
// @desc    Get single resume by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if resume belongs to logged in user
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/resumes/:id
// @desc    Update resume (name and notes only)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if resume belongs to logged in user
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    resume.originalName = req.body.originalName || resume.originalName;
    resume.notes = req.body.notes || resume.notes;

    const updatedResume = await resume.save();
    res.json(updatedResume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if resume belongs to logged in user
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../uploads', resume.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;