const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all registered users (for assignment menus)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({}, 'email role').sort({ email: 1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
