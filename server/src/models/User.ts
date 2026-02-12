import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: { type: String, required: true },
		rollNo: {
			type: String,
			required: true,
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

const User = mongoose.model<IUser>('User', userSchema);

export default User;
