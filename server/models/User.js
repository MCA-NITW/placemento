const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			unique: true
		},
		password: { type: String, required: true },
		rollNo: {
			type: String,
			unique: true
		},
		batch: { type: Number, required: true },
		role: {
			type: String,
			enum: ['student', 'placementCoordinator', 'admin'],
			default: 'student'
		},
		isVerified: { type: Boolean, default: false },
		pg: {
			cgpa: { type: Number, default: 0 },
			percentage: { type: Number, default: 0 }
		},
		ug: {
			cgpa: { type: Number, default: 0 },
			percentage: { type: Number, default: 0 }
		},
		hsc: {
			cgpa: { type: Number, default: 0 },
			percentage: { type: Number, default: 0 }
		},
		ssc: {
			cgpa: { type: Number, default: 0 },
			percentage: { type: Number, default: 0 }
		},
		backlogs: { type: Number, default: 0 },
		totalGapInAcademics: { type: Number, default: 0 },
		placed: { type: Boolean, default: false },
		placedAt: {
			companyId: { type: String, default: 'np' },
			companyName: { type: String, default: 'Not Placed' },
			ctc: { type: Number, default: 0 },
			ctcBase: { type: Number, default: 0 },
			profile: { type: String, default: 'N/A' },
			profileType: { type: String, default: 'N/A' },
			offer: { type: String, default: 'N/A' },
			location: { type: String, default: 'N/A' },
			bond: { type: Number, default: 0 }
		}
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
	}
);

// Add indexes for better query performance
userSchema.index({ email: 1, isVerified: 1 });
userSchema.index({ batch: 1, placed: 1 });
userSchema.index({ 'placedAt.companyId': 1 });

// Note: rollNo and email already have unique: true which creates indexes automatically
// No need to add explicit indexes for them (prevents duplicate index warning)

const User = mongoose.model('User', userSchema);

module.exports = User;
