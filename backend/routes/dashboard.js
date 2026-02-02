const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const protect = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total applications count
    const totalApplications = await Application.countDocuments({ userId });

    // Get count by status
    const statusCounts = await Application.aggregate([
      { $match: { userId: userId } }, // Filter by user
      { $group: { _id: '$status', count: { $sum: 1 } } } // Group by status and count
    ]);

    // Format status counts into object
    const stats = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    // Fill in actual counts
    statusCounts.forEach(item => {
      stats[item._id] = item.count;
    });

    // Get recent applications (last 5)
    const recentApplications = await Application.find({ userId })
      .populate('resumeId', 'originalName')
      .sort({ applicationDate: -1 })
      .limit(5);

    // Get total resumes count
    const totalResumes = await Resume.countDocuments({ userId });

    // Send response
    res.json({
      totalApplications,
      totalResumes,
      stats, // Status breakdown
      recentApplications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;