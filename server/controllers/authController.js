const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

// Helper to format user response consistently
const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  location: user.location,
  bio: user.bio,
  languages: user.languages,
  experience: user.experience,
  price: user.price,
  isAvailable: user.isAvailable,
  isApproved: user.isApproved,
  isProfileComplete: user.isProfileComplete,
  rating: user.rating,
  numReviews: user.numReviews,
  savedDestinations: user.savedDestinations,
});

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'travelguide_super_secret_jwt_key_2026_modern_travel_platform', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Traveler or Guide)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, location, bio, languages, experience, price } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Assign appropriate avatar
    const defaultAvatar = role === 'guide'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role === 'guide' ? 'guide' : 'traveler',
      isProfileComplete: true,
      location: location ? location.trim() : 'India',
      bio: bio ? bio.trim() : (role === 'guide' ? 'Experienced local guide ready to show you the best spots!' : 'Travel enthusiast.'),
      languages: languages && Array.isArray(languages) ? languages : (languages ? languages.split(',').map(s => s.trim()) : ['English', 'Hindi']),
      experience: experience ? experience.trim() : (role === 'guide' ? '2+ years experience' : ''),
      price: price ? Number(price) : (role === 'guide' ? 1500 : 0),
      profileImage: req.body.profileImage && req.body.profileImage.trim() !== '' ? req.body.profileImage.trim() : defaultAvatar,
      isAvailable: true,
      isApproved: true,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found. Please register first.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate with Google OAuth Token (ID token / Access token / Auth code)
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res, next) => {
  try {
    const { credential, access_token, code, role } = req.body;

    if (!credential && !access_token && !code) {
      return res.status(400).json({
        success: false,
        message: 'Google credential or token is required.',
      });
    }

    let payload = null;

    // 1. Verify Google ID token (credential)
    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID || undefined,
        });
        payload = ticket.getPayload();
      } catch (verifyErr) {
        console.error('Google ID token verification failed:', verifyErr.message);
      }
    }

    // 2. Exchange Auth Code if provided
    if (!payload && code) {
      try {
        const { tokens } = await googleClient.getToken(code);
        if (tokens.id_token) {
          const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID || undefined,
          });
          payload = ticket.getPayload();
        } else if (tokens.access_token) {
          const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          });
          if (userinfoRes.ok) {
            payload = await userinfoRes.json();
          }
        }
      } catch (codeErr) {
        console.error('Google Auth Code exchange failed:', codeErr.message);
      }
    }

    // 3. Verify Google Access Token if provided
    if (!payload && access_token) {
      try {
        const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (userinfoRes.ok) {
          payload = await userinfoRes.json();
        }
      } catch (accessErr) {
        console.error('Google Access Token verification failed:', accessErr.message);
      }
    }

    if (!payload || !payload.email) {
      return res.status(401).json({
        success: false,
        message: 'Unable to verify Google credentials. Please try again.',
      });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase().trim();
    const name = payload.name || payload.given_name || 'Traveler';
    const picture = payload.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

    // Find user by googleId or email (Avoid duplicate accounts)
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    let isNewGuide = false;

    if (user) {
      // Link googleId and profile image if missing
      let modified = false;
      if (!user.googleId) {
        user.googleId = googleId;
        modified = true;
      }
      if (!user.profileImage || user.profileImage.includes('unsplash.com')) {
        user.profileImage = picture;
        modified = true;
      }
      if (modified) {
        await user.save();
      }

      isNewGuide = user.role === 'guide' && !user.isProfileComplete;
    } else {
      // New user registering with Google
      const selectedRole = role === 'guide' ? 'guide' : 'traveler';

      if (selectedRole === 'guide') {
        user = await User.create({
          name,
          email,
          googleId,
          profileImage: picture,
          role: 'guide',
          isProfileComplete: false, // Must complete guide info before appearing on /guides
          location: '',
          bio: '',
          languages: ['English', 'Hindi'],
          experience: '',
          price: 1500,
          isAvailable: true,
          isApproved: true,
        });
        isNewGuide = true;
      } else {
        user = await User.create({
          name,
          email,
          googleId,
          profileImage: picture,
          role: 'traveler',
          isProfileComplete: true,
          location: 'India',
          bio: 'Passionate traveler exploring the world.',
        });
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: formatUser(user),
      isNewGuide,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedDestinations');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
};
