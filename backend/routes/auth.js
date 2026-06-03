const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, JWT_SECRET, USE_FIREBASE_ADMIN } = require('../middleware/auth');

// @route   POST /api/auth/signup
// @desc    Register a new user mapped to a Firebase UID (either real or mock)
// @access  Public
router.post('/signup', async (req, res) => {
  const { firebaseUid, email, role, password } = req.body;

  if (!firebaseUid || !email) {
    return res.status(400).json({ message: 'Please provide firebaseUid and email' });
  }

  // Validate email format
  const emailRegex = /.+\@.+\..+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address format' });
  }

  try {
    let user = await User.findOne({ firebaseUid });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = await User.create({
      firebaseUid,
      email,
      role: role || 'Member',
      mockPassword: password
    });

    res.status(201).json({
      _id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Retrieve profile data of currently logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    firebaseUid: req.user.firebaseUid,
    email: req.user.email,
    role: req.user.role
  });
});

// @route   POST /api/auth/mock-login
// @desc    Generate a valid mock JWT for offline testing
// @access  Public
router.post('/mock-login', async (req, res) => {
  if (USE_FIREBASE_ADMIN) {
    return res.status(400).json({ message: 'Mock login unavailable when Firebase Admin is enabled.' });
  }

  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Generate a consistent mock UID based on email
    // Try finding user in database
    let user = await User.findOne({ email });
    
    // Auto-seed demo accounts on a fresh database
    if (!user && (email === 'admin@crewflow.com' || email === 'member@crewflow.com')) {
      user = await User.create({
        firebaseUid: `mock_uid_${email.replace(/[@.]/g, '_')}`,
        email,
        role: email === 'admin@crewflow.com' ? 'Admin' : 'Member',
        mockPassword: 'password123'
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'User does not exist. Please create an account.' });
    }

    // Auto-correct legacy demo accounts if they got saved with the wrong role
    if (email === 'admin@crewflow.com' && user.role !== 'Admin') {
      user.role = 'Admin';
      await user.save();
    } else if (email === 'member@crewflow.com' && user.role !== 'Member') {
      user.role = 'Member';
      await user.save();
    }

    const storedPassword = user.mockPassword || 'password123';
    if (password !== storedPassword) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    if (user.role !== role) {
      if (role === 'Admin') {
        return res.status(403).json({ message: 'You are not an admin. Please select Member Mode and use your member credentials.' });
      } else {
        return res.status(403).json({ message: 'You are an admin. Please select Admin Mode and use your admin credentials.' });
      }
    }

    const safeUid = user.firebaseUid;

    // Generate JWT signed with local mock secret
    const token = jwt.sign({ uid: safeUid, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        _id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Mock login error:', error.message);
    res.status(500).json({ message: 'Server error during mock login' });
  }
});

module.exports = router;
