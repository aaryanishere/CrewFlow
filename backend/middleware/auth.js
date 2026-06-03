const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'crewflow_mock_secret_key_12345';
const USE_FIREBASE_ADMIN = process.env.USE_FIREBASE_ADMIN === 'true';

// Initialize Firebase Admin if active
if (USE_FIREBASE_ADMIN) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } else {
      admin.initializeApp();
      console.log('Firebase Admin SDK initialized with default credentials.');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error.message);
  }
} else {
  console.log('Running backend in LOCAL MOCK AUTH mode. No Firebase service credentials required.');
}

// Authentication Middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    let firebaseUid;
    let email;

    if (USE_FIREBASE_ADMIN) {
      // Firebase Verification Flow
      const decodedToken = await admin.auth().verifyIdToken(token);
      firebaseUid = decodedToken.uid;
      email = decodedToken.email;
    } else {
      // Local Mock JWT Verification Flow
      const decoded = jwt.verify(token, JWT_SECRET);
      firebaseUid = decoded.uid;
      email = decoded.email;
    }

    // Find the user in our MongoDB database using the firebaseUid
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Auto-register in DB if user is verified via provider but missing in Mongoose
      user = await User.create({
        firebaseUid,
        email,
        role: 'Member'
      });
    }

    // Attach user information to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token verification failed' });
  }
};

// Role Authorization Middleware
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user details missing' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access restricted to roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}` 
      });
    }

    next();
  };
};

module.exports = { protect, checkRole, JWT_SECRET, USE_FIREBASE_ADMIN };
