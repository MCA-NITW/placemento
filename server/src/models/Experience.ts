import mongoose, { Schema } from 'mongoose';
import { IExperience } from '../types';

const experienceSchema = new Schema<IExperience>(
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
		likedBy: { type: [String], default: [] },
		isVerified: { type: Boolean, default: false },
		helpfulCount: { type: Number, default: 0 }
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

experienceSchema.index({ companyName: 'text', content: 'text' });
experienceSchema.index({ tags: 1 });
experienceSchema.index({ 'studentDetails.batch': 1 });
experienceSchema.index({ rating: -1 });
experienceSchema.index({ createdAt: -1 });

const Experience = mongoose.model<IExperience>('Experience', experienceSchema);

export default Experience;
