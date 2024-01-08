// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    // Create and send a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Login successful');
    res.json({ status: true, data: { user: { email: user.email, password: '********' }, token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
});



module.exports = router;
