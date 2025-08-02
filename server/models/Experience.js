const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
	{
		companyName: { type: String, required: true },
		studentDetails: {
			rollNo: { type: String, required: true },
			name: { type: String, required: true },
			batch: { type: Number, required: true }
		},
		content: { type: String, required: true },
		Comments: { type: [String], default: [] },
		tags: { type: [String], default: ['General'] },
		rating: { type: Number, min: 1, max: 5, default: 5 },
		interviewProcess: { type: String, default: '' },
		tips: { type: String, default: '' },
		difficulty: { 
			type: String, 
			enum: ['Easy', 'Medium', 'Hard'], 
			default: 'Medium' 
		},
		likes: { type: Number, default: 0 },
		likedBy: { type: [String], default: [] }, // Array of user IDs who liked
		isVerified: { type: Boolean, default: false }, // Admin verification
		helpfulCount: { type: Number, default: 0 }
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

// Index for better search performance
experienceSchema.index({ companyName: 'text', content: 'text', tags: 1 });
experienceSchema.index({ 'studentDetails.batch': 1 });
experienceSchema.index({ rating: -1 });
experienceSchema.index({ createdAt: -1 });

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
