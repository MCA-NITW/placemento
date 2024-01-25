const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			required: true,
			match: /.+\@student.nitw.ac.in+/,
			unique: true,
		},
		password: { type: String, required: true },
		rollNo: {
			type: String,
			match: /^[0-9]{2}MCF1R[0-9]{2,}$/,
			unique: true,
		},
		role: {
			type: String,
			enum: ['student', 'placementCoordinator', 'admin'],
			default: 'student',
		},
		isVerified: { type: Boolean, default: false },
		pg: {
			cgpa: { type: Number, default: 0 },
			percentage: { type: Number, default: 0 },
		},
		ug: {
			cgpa: { type: Number, default: 0 },
			percentage: { type: Number, default: 0 },
		},
		hsc: {
			cgpa: { type: Number, default: 0 },
			percentage: { type: Number, default: 0 },
		},
		ssc: {
			cgpa: { type: Number, default: 0 },
			percentage: { type: Number, default: 0 },
		},
		backlogs: { type: Number, default: 0 },
		totalGapInAcademics: { type: Number, default: 0 },
		placed: { type: Boolean, default: false },
		placedAt: {
			company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
			location: { type: String, default: '' },
		},
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
	},
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
