const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', { username: req.body.username, email: req.body.email });
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username }]
      });
    } catch (dbError) {
      console.error('Database error checking existing user:', dbError);
      return res.status(500).json({ error: 'Database error. Please try again.' });
    }

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
    }

    // Create new user
    const user = new User({ 
      username, 
      email: email.toLowerCase().trim(), 
      password 
    });
    
    try {
      await user.save();
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      if (saveError.code === 11000) {
        // Duplicate key error
        const field = Object.keys(saveError.keyPattern)[0];
        return res.status(400).json({ 
          error: `An account with this ${field} already exists` 
        });
      }
      throw saveError;
    }

    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message || 'Failed to create user account' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Check authentication status
router.get('/me', (req, res) => {
  if (req.session.userId) {
    res.json({
      authenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        email: req.session.email
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;

