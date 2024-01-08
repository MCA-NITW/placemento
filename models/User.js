const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'placementCoordinator', 'admin'], default: 'student' },
});

// Create an index on the email field
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
