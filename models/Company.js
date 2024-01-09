const mongoose = require('mongoose');

// Define Company Schema
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    interviewShortlist: { type: Number, default: 0 },
    selected: { type: Number, default: 0 },
    locations: { type: [String] },
    cutoffs: {
      pg: {
        cgpa: { type: Number },
        percentage: { type: Number },
      },
      ug: {
        cgpa: { type: Number },
        percentage: { type: Number },
      },

      twelth: {
        cgpa: { type: Number },
        percentage: { type: Number },
      },
      tenth: {
        cgpa: { type: Number },
        percentage: { type: Number },
      },
    },
    typeOfOffer: {
      type: String,
      enum: ['PPO', 'FTE', '6M+FTE', 'Intern'],
      default: 'FTE',
    },
    profile: { type: String },
    ctc: { type: Number },
    ctcBreakup: {
      base: { type: Number },
      other: { type: Number },
    },
    bond: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

// Create Company model
const Company = mongoose.model('Company', companySchema);

// Export Company model
module.exports = Company;
