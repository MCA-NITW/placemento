// Sample data seeder for development
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Experience = require('./models/Experience');

dotenv.config();

const sampleUsers = [
	{
		name: 'John Doe',
		email: 'john@student.nitw.ac.in',
		rollNo: '21CS001',
		batch: 2024,
		role: 'student',
		isVerified: true,
		pg: { cgpa: 8.5, percentage: 85 },
		ug: { cgpa: 8.0, percentage: 80 },
		hsc: { cgpa: 9.0, percentage: 90 },
		ssc: { cgpa: 9.5, percentage: 95 },
		backlogs: 0,
		totalGapInAcademics: 0,
		placed: true,
		placedAt: {
			companyId: 'comp1',
			companyName: 'Google',
			ctc: 25,
			ctcBase: 20,
			profile: 'Software Engineer',
			profileType: 'Software',
			offer: 'FTE',
			location: 'Bangalore',
			bond: 0
		}
	},
	{
		name: 'Jane Smith',
		email: 'jane@student.nitw.ac.in',
		rollNo: '21CS002',
		batch: 2024,
		role: 'student',
		isVerified: true,
		pg: { cgpa: 8.8, percentage: 88 },
		ug: { cgpa: 8.2, percentage: 82 },
		hsc: { cgpa: 9.2, percentage: 92 },
		ssc: { cgpa: 9.7, percentage: 97 },
		backlogs: 0,
		totalGapInAcademics: 0,
		placed: true,
		placedAt: {
			companyId: 'comp2',
			companyName: 'Microsoft',
			ctc: 30,
			ctcBase: 25,
			profile: 'Software Engineer',
			profileType: 'Software',
			offer: 'FTE',
			location: 'Hyderabad',
			bond: 0
		}
	},
	{
		name: 'Admin User',
		email: 'admin@student.nitw.ac.in',
		rollNo: '21CS999',
		batch: 2024,
		role: 'admin',
		isVerified: true,
		pg: { cgpa: 9.0, percentage: 90 },
		ug: { cgpa: 8.5, percentage: 85 },
		hsc: { cgpa: 9.5, percentage: 95 },
		ssc: { cgpa: 9.8, percentage: 98 },
		backlogs: 0,
		totalGapInAcademics: 0,
		placed: false
	}
];

const sampleCompanies = [
	{
		name: 'Google',
		status: 'completed',
		interviewShortlist: 15,
		selectedStudentsRollNo: ['21CS001'],
		dateOfOffer: new Date('2024-03-15'),
		locations: ['Bangalore', 'Hyderabad'],
		cutoffs: {
			pg: { cgpa: 7.5, percentage: 0 },
			ug: { cgpa: 7.0, percentage: 0 },
			twelth: { cgpa: 0, percentage: 75 },
			tenth: { cgpa: 0, percentage: 80 }
		},
		typeOfOffer: 'FTE',
		profile: 'Software Engineer',
		profileCategory: 'Software',
		ctc: 25,
		ctcBreakup: { base: 20, other: 5 },
		bond: 0
	},
	{
		name: 'Microsoft',
		status: 'completed',
		interviewShortlist: 20,
		selectedStudentsRollNo: ['21CS002'],
		dateOfOffer: new Date('2024-03-20'),
		locations: ['Hyderabad', 'Bangalore'],
		cutoffs: {
			pg: { cgpa: 8.0, percentage: 0 },
			ug: { cgpa: 7.5, percentage: 0 },
			twelth: { cgpa: 0, percentage: 80 },
			tenth: { cgpa: 0, percentage: 85 }
		},
		typeOfOffer: 'FTE',
		profile: 'Software Engineer',
		profileCategory: 'Software',
		ctc: 30,
		ctcBreakup: { base: 25, other: 5 },
		bond: 0
	},
	{
		name: 'Amazon',
		status: 'ongoing',
		interviewShortlist: 25,
		selectedStudentsRollNo: [],
		dateOfOffer: new Date('2024-04-01'),
		locations: ['Bangalore', 'Chennai'],
		cutoffs: {
			pg: { cgpa: 7.0, percentage: 0 },
			ug: { cgpa: 6.5, percentage: 0 },
			twelth: { cgpa: 0, percentage: 70 },
			tenth: { cgpa: 0, percentage: 75 }
		},
		typeOfOffer: 'FTE',
		profile: 'Software Development Engineer',
		profileCategory: 'Software',
		ctc: 28,
		ctcBreakup: { base: 22, other: 6 },
		bond: 0
	}
];

const sampleExperiences = [
	{
		companyName: 'Google',
		studentDetails: {
			rollNo: '21CS001',
			name: 'John Doe',
			batch: 2024
		},
		content: 'Amazing experience at Google. The interview process was challenging but fair. Really enjoyed working with the team.',
		tags: ['Technical Round', 'HR Round', 'Coding Test', 'System Design'],
		rating: 5,
		interviewProcess:
			'There were 4 rounds: 1 online test, 2 technical interviews, and 1 HR round. The technical rounds focused on algorithms and system design.',
		tips: 'Practice LeetCode problems, especially medium to hard level. Be prepared for system design questions.',
		difficulty: 'Hard',
		likes: 5,
		likedBy: [],
		isVerified: true,
		helpfulCount: 3
	},
	{
		companyName: 'Microsoft',
		studentDetails: {
			rollNo: '21CS002',
			name: 'Jane Smith',
			batch: 2024
		},
		content: 'Great company culture and work-life balance. The interview was well-structured and the interviewers were very helpful.',
		tags: ['Technical Round', 'HR Round', 'Coding Test', 'Resume Discussion'],
		rating: 4,
		interviewProcess:
			'3 rounds total: online assessment, technical interview, and HR discussion. Questions were mainly on data structures and algorithms.',
		tips: 'Focus on fundamentals of DSA. Be ready to explain your projects in detail.',
		difficulty: 'Medium',
		likes: 3,
		likedBy: [],
		isVerified: true,
		helpfulCount: 2
	}
];

async function seedDatabase() {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.DB_CONNECTION_STRING);
		console.log('Connected to database');

		// Clear existing data
		await User.deleteMany({});
		await Company.deleteMany({});
		await Experience.deleteMany({});
		console.log('Cleared existing data');

		// Hash passwords for users
		const saltRounds = parseInt(process.env.JWT_SALT_ROUNDS) || 10;
		for (let user of sampleUsers) {
			user.password = await bcrypt.hash('password123', saltRounds);
		}

		// Insert sample data
		const users = await User.insertMany(sampleUsers);
		console.log(`Created ${users.length} users`);

		const companies = await Company.insertMany(sampleCompanies);
		console.log(`Created ${companies.length} companies`);

		const experiences = await Experience.insertMany(sampleExperiences);
		console.log(`Created ${experiences.length} experiences`);

		console.log('Sample data seeded successfully!');
		console.log('\nSample login credentials:');
		console.log('Student: john@student.nitw.ac.in / password123');
		console.log('Student: jane@student.nitw.ac.in / password123');
		console.log('Admin: admin@student.nitw.ac.in / password123');
	} catch (error) {
		console.error('Error seeding database:', error);
	} finally {
		await mongoose.connection.close();
		console.log('Database connection closed');
	}
}

// Run seeder if called directly
if (require.main === module) {
	seedDatabase();
}

module.exports = { seedDatabase };
