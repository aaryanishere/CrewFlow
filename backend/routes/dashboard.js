const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/metrics
// @desc    Get aggregated task metrics for the dashboard
// @access  Private
router.get('/metrics', protect, async (req, res) => {
  try {
    let matchQuery = {};

    if (req.user.role !== 'Admin') {
      // Members only see metrics of tasks assigned to them
      matchQuery.assignedTo = req.user._id;
    }

    const now = new Date();

    const stats = await Task.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $ne: ['$status', 'Done'] }, 1, 0] }
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'Done'] },
                    { $lt: ['$dueDate', now] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0
    };

    delete result._id;

    res.json(result);
  } catch (error) {
    console.error('Get metrics error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
