// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.js');
const { authenticateUser, checkUserRole } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.DB_CONNECTION_STRING;

mongoose
  .connect(uri)
  .then(() => console.log('Database connected!'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(cors());

// Use the authRoutes only once
app.use('/auth', authRoutes);

// Example route for testing
app.get('/', (req, res) => {
  res.send('Hello, this is your MERN app!');
});

// Common route for all roles
app.get('/common', authenticateUser, (req, res) => {
  res.send('This is a common page for all roles.');
});

// Protected routes
app.get('/students-and-pc', authenticateUser, checkUserRole(['student', 'placementCoordinator']), (req, res) => {
  res.send('This page is accessible to students and placement coordinators.');
});

app.get('/pc-only', authenticateUser, checkUserRole(['placementCoordinator', 'admin']), (req, res) => {
  res.send('This page is accessible only to placement coordinators.');
});

app.get('/admin-only', authenticateUser, checkUserRole(['admin']), (req, res) => {
  res.send('This page is accessible only to admin.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
