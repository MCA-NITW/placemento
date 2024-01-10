// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const saltRounds = 10;

router.post('/signup', async (req, res) => {
  try {
    const { name, rollNo, email, password, role } = req.body;

    if (!name || !email || !password || !rollNo) return res.status(400).json({ message: 'All fields are required' });
    if (email.split('@')[1] !== 'student.nitw.ac.in') return res.status(400).json({ message: 'Enter a valid College Mail Id' });
    if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return res.status(400).json({ message: 'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, and one digit' });
    if (!rollNo.match(/^[0-9]{2}MCF1R[0-9]{2,}$/)) return res.status(400).json({ message: 'Enter a valid Roll No. (Ex: 21MCF1R47)' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const existingRollNo = await User.findOne({ rollNo });
    if (existingRollNo) return res.status(400).json({ message: 'Roll No. already exists' });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      rollNo,
      role,
    });

    await newUser.save();
    console.log('User created successfully');
    res.status(201).json({ message: 'User registered successfully. Admin will verify your account soon, after which you will be able to log in.' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const isVerified = user.isVerified;
    if (!isVerified) {
      console.log('User not verified');
      return res.status(401).json({
        status: false,
        message: 'User not verified. Please Contact Admin',
      });
    }

    // Create and send a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Login successful');
    res.json({
      status: true,
      data: { user: { email: user.email, password: '********' }, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
