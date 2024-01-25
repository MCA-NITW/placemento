const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		status: {
			type: String,
			enum: ['ongoing', 'upcoming', 'completed', 'cancelled'],
			default: 'upcoming',
		},
		interviewShortlist: { type: Number, default: 0 },
		selected: { type: Number, default: 0 },
		selectedStudentsRollNo: { type: [String], default: [] },
		dateOfOffer: { type: Date, default: Date.now },
		locations: { type: [String], default: [] },
		cutoffs: {
			pg: {
				cgpa: { type: Number, default: 0 },
				percentage: { type: Number, default: 0 },
			},
			ug: {
				cgpa: { type: Number, default: 0 },
				percentage: { type: Number, default: 0 },
			},
			twelth: {
				cgpa: { type: Number, default: 0 },
				percentage: { type: Number, default: 0 },
			},
			tenth: {
				cgpa: { type: Number, default: 0 },
				percentage: { type: Number, default: 0 },
			},
		},
		typeOfOffer: {
			type: String,
			enum: ['PPO', 'FTE', '6M+FTE', 'Intern'],
			default: 'FTE',
		},
		profile: { type: String, default: '' },
		profileCategory: {
			type: String,
			enum: ['Software', 'Analyst', 'Others'],
			default: 'Others',
		},
		ctc: { type: Number, default: 0 },
		ctcBreakup: {
			base: { type: Number, default: 0 },
			other: { type: Number, default: 0 },
		},
		bond: { type: Number, default: 0 },
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
