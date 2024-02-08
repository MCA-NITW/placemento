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
		postDate: { type: Date, default: Date.now },
		editDate: { type: Date, default: Date.now },
		tags: { type: [String], default: [] }
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
