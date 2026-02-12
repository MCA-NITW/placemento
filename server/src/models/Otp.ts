import mongoose, { Schema } from 'mongoose';
import { IOtp } from '../types';

const otpSchema = new Schema<IOtp>(
	{
		email: { type: String, required: true },
		otp: { type: String, required: true },
		createdAt: { type: Date, default: Date.now, expires: 600 }
	},
	{
		timestamps: { updatedAt: 'updatedAt' }
	}
);

const Otp = mongoose.model<IOtp>('Otp', otpSchema);

export default Otp;
