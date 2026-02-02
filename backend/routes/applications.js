const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const protect = require('../middleware/auth');

// @route   POST /api/applications
// @desc    Create new job application
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { resumeId, company, role, status, applicationDate, notes } = req.body;

    // Validate required fields
    if (!resumeId || !company || !role) {
      return res.status(400).json({ message: 'Please provide resume, company, and role' });
    }

    // Check if resume exists and belongs to user
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to use this resume' });
    }

    // Create application
    const application = await Application.create({
      userId: req.user._id,
      resumeId,
      company,
      role,
      status: status || 'Applied',
      applicationDate: applicationDate || Date.now(),
      notes: notes || ''
    });

    // Populate resume details in response
    await application.populate('resumeId', 'originalName fileName');

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications
// @desc    Get all applications for logged in user (with optional filter)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query; // Get status from query params (?status=Applied)

    // Build query
    let query = { userId: req.user._id };
    
    // Add status filter if provided
    if (status && status !== 'All') {
      query.status = status;
    }

    // Find applications and populate resume details
    const applications = await Application.find(query)
      .populate('resumeId', 'originalName fileName')
      .sort({ applicationDate: -1 }); // Newest first

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/:id
// @desc    Get single application by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('resumeId', 'originalName fileName');

    // Check if application exists
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application belongs to logged in user
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    // Check if application exists
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application belongs to logged in user
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields (only update what's provided)
    application.company = req.body.company || application.company;
    application.role = req.body.role || application.role;
    application.status = req.body.status || application.status;
    application.notes = req.body.notes !== undefined ? req.body.notes : application.notes;
    
    // Update applicationDate if provided
    if (req.body.applicationDate) {
      application.applicationDate = req.body.applicationDate;
    }

    const updatedApplication = await application.save();
    
    // Populate resume details
    await updatedApplication.populate('resumeId', 'originalName fileName');

    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    // Check if application exists
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application belongs to logged in user
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete from database
    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;