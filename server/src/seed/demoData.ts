// Deterministic demo dataset: one fake MCA batch, the companies that visited it,
// and a few interview experiences. Every name here is invented; nothing is real
// placement data. A fixed PRNG seed makes every run produce the same records,
// so screenshots and demo logins stay stable.

export const DEMO_PASSWORD = 'Demo@1234';
export const DEMO_BATCH_PREFIX = '23'; // roll numbers 23MCF1R01..; batch = 2000 + 23 + 3 = 2026

export const DEMO_ACCOUNTS = [
	{ role: 'admin', email: 'admin.demo@student.nitw.ac.in', name: 'Demo Admin' },
	{ role: 'placementCoordinator', email: 'coordinator.demo@student.nitw.ac.in', name: 'Demo Coordinator' },
	{ role: 'student', email: 'student.demo@student.nitw.ac.in', name: 'Demo Student' }
] as const;

type Role = (typeof DEMO_ACCOUNTS)[number]['role'];

export interface DemoUser {
	name: string;
	email: string;
	rollNo: string;
	batch: number;
	role: Role;
	isVerified: boolean;
	pg: { cgpa: number; percentage: number };
	ug: { cgpa: number; percentage: number };
	hsc: { cgpa: number; percentage: number };
	ssc: { cgpa: number; percentage: number };
	backlogs: number;
	totalGapInAcademics: number;
	placed: boolean;
	placedAt: {
		companyId: string;
		companyName: string;
		ctc: number;
		ctcBase: number;
		profile: string;
		profileType: string;
		offer: string;
		location: string;
		bond: number;
	};
}

export interface DemoCompany {
	name: string;
	status: 'ongoing' | 'upcoming' | 'completed' | 'cancelled';
	interviewShortlist: number;
	selected: number;
	selectedStudentsRollNo: string[];
	dateOfOffer: Date;
	locations: string[];
	cutoffs: {
		pg: { cgpa: number; percentage: number };
		ug: { cgpa: number; percentage: number };
		twelth: { cgpa: number; percentage: number };
		tenth: { cgpa: number; percentage: number };
	};
	typeOfOffer: 'PPO' | 'FTE' | '6M+FTE' | 'Intern';
	profile: string;
	profileCategory: 'Software' | 'Analyst' | 'Others';
	ctc: number;
	ctcBreakup: { base: number; other: number };
	bond: number;
}

export interface DemoExperience {
	companyName: string;
	studentDetails: { rollNo: string; name: string; batch: number };
	content: string;
	Comments: string[];
	tags: string[];
	rating: number;
	interviewProcess: string;
	tips: string;
	difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface DemoData {
	users: DemoUser[];
	companies: DemoCompany[];
	experiences: DemoExperience[];
}

// mulberry32: tiny seeded PRNG, good enough for fixture data
const createRng = (seed: number) => {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

const FIRST_NAMES = [
	'Aarav',
	'Aditi',
	'Akash',
	'Ananya',
	'Arjun',
	'Bhavna',
	'Chetan',
	'Deepika',
	'Divya',
	'Gaurav',
	'Harini',
	'Ishaan',
	'Kavya',
	'Karthik',
	'Lakshmi',
	'Manish',
	'Meera',
	'Naveen',
	'Neha',
	'Nikhil',
	'Pooja',
	'Pranav',
	'Priya',
	'Rahul',
	'Ritika',
	'Rohan',
	'Sahana',
	'Sai',
	'Shreya',
	'Siddharth',
	'Sneha',
	'Tanvi',
	'Tarun',
	'Varun',
	'Vidya',
	'Vikram',
	'Yash',
	'Zoya'
];
const LAST_NAMES = [
	'Agarwal',
	'Bhat',
	'Chowdary',
	'Das',
	'Gupta',
	'Iyer',
	'Jain',
	'Kumar',
	'Mehta',
	'Menon',
	'Nair',
	'Patel',
	'Rao',
	'Reddy',
	'Sharma',
	'Singh',
	'Srinivasan',
	'Verma',
	'Yadav'
];

// [name, status, offer, profile, category, ctc LPA, base LPA, bond years, locations, pg cgpa cutoff, selections]
type CompanyRow = [
	string,
	DemoCompany['status'],
	DemoCompany['typeOfOffer'],
	string,
	DemoCompany['profileCategory'],
	number,
	number,
	number,
	string[],
	number,
	number
];

const COMPANY_ROWS: CompanyRow[] = [
	['Nimbus Cloud Systems', 'completed', 'FTE', 'Software Development Engineer', 'Software', 32, 24, 0, ['Bangalore', 'Hyderabad'], 8, 3],
	['Quantleaf Analytics', 'completed', 'FTE', 'Data Analyst', 'Analyst', 14, 11, 0, ['Bangalore'], 7, 4],
	['Bluepeak Fintech', 'completed', '6M+FTE', 'Backend Engineer', 'Software', 22, 18, 1, ['Pune', 'Mumbai'], 7.5, 4],
	['Orbitron Labs', 'completed', 'FTE', 'Full Stack Developer', 'Software', 18, 15, 0, ['Hyderabad'], 7, 4],
	['Saffron Retail Tech', 'completed', 'FTE', 'Business Analyst', 'Analyst', 9.5, 8, 1, ['Chennai'], 6.5, 4],
	['Cobalt Security', 'completed', 'FTE', 'Security Engineer', 'Software', 26, 20, 0, ['Bangalore', 'Delhi'], 8, 2],
	['Riverstone Consulting', 'completed', 'FTE', 'Technology Consultant', 'Others', 11, 9, 2, ['Mumbai', 'Pune', 'Kolkata'], 6, 3],
	['Helix Health AI', 'completed', 'PPO', 'ML Engineer', 'Software', 28, 22, 0, ['Bangalore'], 8.5, 2],
	['Tidewater Logistics', 'completed', 'FTE', 'Associate Software Engineer', 'Software', 8, 7, 1, ['Chennai', 'Hyderabad'], 6, 3],
	['Lumen Edtech', 'completed', 'FTE', 'Product Analyst', 'Analyst', 12, 10, 0, ['Bangalore', 'Delhi'], 7, 3],
	['Granite Bank Technology', 'completed', '6M+FTE', 'Graduate Engineer Trainee', 'Software', 16, 13, 0, ['Hyderabad', 'Mumbai'], 7, 4],
	['Kestrel Games', 'completed', 'Intern', 'Game Developer Intern', 'Software', 6, 6, 0, ['Pune'], 6.5, 2],
	['Monsoon Media', 'completed', 'FTE', 'Digital Analyst', 'Others', 7, 6, 0, ['Mumbai'], 6, 2],
	['Vertex Semiconductors', 'completed', 'FTE', 'Embedded Software Engineer', 'Software', 20, 16, 1, ['Bangalore', 'Ahmedabad'], 7.5, 2],
	['Peregrine Payments', 'ongoing', 'FTE', 'Site Reliability Engineer', 'Software', 24, 19, 0, ['Bangalore'], 7.5, 0],
	['Aster Insurance Tech', 'ongoing', 'FTE', 'Data Engineer', 'Analyst', 15, 12, 0, ['Pune', 'Hyderabad'], 7, 0],
	['Juniper Mobility', 'upcoming', 'FTE', 'Android Developer', 'Software', 17, 14, 0, ['Hyderabad'], 7, 0],
	['Indigo Cloudworks', 'upcoming', '6M+FTE', 'DevOps Engineer', 'Software', 19, 15, 0, ['Bangalore', 'Chennai'], 7, 0],
	['Fernwood Agritech', 'upcoming', 'FTE', 'Operations Analyst', 'Others', 8.5, 7.5, 1, ['Hyderabad'], 6, 0],
	['Copperline Telecom', 'cancelled', 'FTE', 'Network Engineer', 'Others', 10, 8, 2, ['Kolkata'], 6.5, 0]
];

const STUDENT_COUNT = 60;

const round = (n: number, digits: number) => Number(n.toFixed(digits));

export const buildDemoData = (seed = 2026): DemoData => {
	const rand = createRng(seed);
	const pick = <T>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
	const between = (min: number, max: number) => min + rand() * (max - min);
	const batch = 2000 + Number(DEMO_BATCH_PREFIX) + 3;

	const academic = (min: number, max: number) => {
		const cgpa = round(between(min, max), 2);
		return { cgpa, percentage: round(cgpa * 9.5, 1) };
	};

	const notPlaced: DemoUser['placedAt'] = {
		companyId: 'np',
		companyName: 'Not Placed',
		ctc: 0,
		ctcBase: 0,
		profile: 'N/A',
		profileType: 'N/A',
		offer: 'N/A',
		location: 'N/A',
		bond: 0
	};

	const usedNames = new Set<string>();
	const users: DemoUser[] = [];
	for (let i = 1; i <= STUDENT_COUNT; i++) {
		const rollNo = `${DEMO_BATCH_PREFIX}MCF1R${String(i).padStart(2, '0')}`;
		const account = DEMO_ACCOUNTS[i - 1];
		let name: string = account?.name ?? '';
		while (!name || usedNames.has(name)) name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
		usedNames.add(name);
		const email = account?.email ?? `${name.toLowerCase().replace(/\s+/g, '.')}.${rollNo.toLowerCase()}@student.nitw.ac.in`;
		users.push({
			name,
			email,
			rollNo,
			batch,
			role: account?.role ?? 'student',
			isVerified: true,
			pg: academic(6.2, 9.6),
			ug: academic(6.5, 9.4),
			hsc: academic(6.8, 9.8),
			ssc: academic(7, 9.9),
			backlogs: rand() < 0.1 ? 1 : 0,
			totalGapInAcademics: rand() < 0.15 ? 1 : 0,
			placed: false,
			placedAt: { ...notPlaced }
		});
	}
	// Two pending signups so the admin's verify queue is not empty
	users[STUDENT_COUNT - 1].isVerified = false;
	users[STUDENT_COUNT - 2].isVerified = false;

	const companies: DemoCompany[] = COMPANY_ROWS.map(
		([name, status, typeOfOffer, profile, profileCategory, ctc, base, bond, locations, pgCutoff], idx) => ({
			name,
			status,
			interviewShortlist: 0,
			selected: 0,
			selectedStudentsRollNo: [],
			// Spread offer dates from August 2025 to February 2026
			dateOfOffer: new Date(Date.UTC(2025, 7, 4) + idx * 9 * 24 * 60 * 60 * 1000),
			locations,
			cutoffs: {
				pg: { cgpa: pgCutoff, percentage: round(pgCutoff * 9.5, 1) },
				ug: { cgpa: 6, percentage: 60 },
				twelth: { cgpa: 6, percentage: 60 },
				tenth: { cgpa: 6, percentage: 60 }
			},
			typeOfOffer,
			profile,
			profileCategory,
			ctc,
			ctcBreakup: { base, other: round(ctc - base, 2) },
			bond
		})
	);

	// Assign offers highest CTC first, each to unplaced, verified, eligible students.
	// companyId is filled in by the seeder once Mongo assigns _ids.
	const order = COMPANY_ROWS.map((row, idx) => ({ idx, ctc: row[5], selections: row[10] })).sort((a, b) => b.ctc - a.ctc);
	for (const { idx, selections } of order) {
		const company = companies[idx];
		const eligible = users.filter(
			(u) => u.role === 'student' && u.isVerified && !u.placed && u.backlogs === 0 && u.pg.cgpa >= company.cutoffs.pg.cgpa
		);
		company.interviewShortlist = selections === 0 ? 0 : Math.min(eligible.length, selections * 3);
		for (const student of eligible.slice(0, selections)) {
			student.placed = true;
			student.placedAt = {
				companyId: '',
				companyName: company.name,
				ctc: company.ctc,
				ctcBase: company.ctcBreakup.base,
				profile: company.profile,
				profileType: company.profileCategory,
				offer: company.typeOfOffer,
				location: pick(company.locations),
				bond: company.bond
			};
			company.selectedStudentsRollNo.push(student.rollNo);
		}
		company.selected = company.selectedStudentsRollNo.length;
	}

	const author = (companyName: string) => {
		const u = users.find((x) => x.placedAt.companyName === companyName) ?? users[2];
		return { rollNo: u.rollNo, name: u.name, batch: u.batch };
	};

	const experiences: DemoExperience[] = [
		{
			companyName: 'Nimbus Cloud Systems',
			studentDetails: author('Nimbus Cloud Systems'),
			content: 'Online assessment with two DSA problems (graphs and sliding window), then two technical rounds and a hiring manager round.',
			Comments: ['Which graph problem was it?', 'Shortest path on a grid with obstacles, BFS was enough.'],
			tags: ['DSA', 'System Design'],
			rating: 5,
			interviewProcess: 'OA (90 min) -> Technical 1 -> Technical 2 -> Hiring manager',
			tips: 'Practice explaining your approach out loud before writing code.',
			difficulty: 'Hard'
		},
		{
			companyName: 'Quantleaf Analytics',
			studentDetails: author('Quantleaf Analytics'),
			content: 'SQL-heavy test followed by a case study on churn. The panel cared more about the reasoning than the final number.',
			Comments: ['Was Excel asked?'],
			tags: ['SQL', 'Case Study'],
			rating: 4,
			interviewProcess: 'Aptitude + SQL test -> Case study -> HR',
			tips: 'Window functions and GROUP BY edge cases came up twice.',
			difficulty: 'Medium'
		},
		{
			companyName: 'Bluepeak Fintech',
			studentDetails: author('Bluepeak Fintech'),
			content: 'They asked about REST API design, idempotency for payments, and one LLD question on a rate limiter.',
			Comments: [],
			tags: ['Backend', 'LLD'],
			rating: 4,
			interviewProcess: 'OA -> Technical (LLD) -> Technical (projects) -> HR',
			tips: 'Know your final-year project end to end; they went deep on it.',
			difficulty: 'Medium'
		},
		{
			companyName: 'Orbitron Labs',
			studentDetails: author('Orbitron Labs'),
			content: 'Take-home React task (a filterable table), then a review call where they asked me to extend it live.',
			Comments: ['How long was the take-home?', 'Two days, but it needed about four hours.'],
			tags: ['React', 'Take-home'],
			rating: 5,
			interviewProcess: 'Take-home -> Live extension -> Culture fit',
			tips: 'Write a short README with your take-home; they read it.',
			difficulty: 'Easy'
		},
		{
			companyName: 'Riverstone Consulting',
			studentDetails: author('Riverstone Consulting'),
			content: 'Group discussion on remote work, then a guesstimate and a short technical round on DBMS and OS basics.',
			Comments: [],
			tags: ['GD', 'Guesstimate'],
			rating: 3,
			interviewProcess: 'GD -> Guesstimate -> Technical -> HR',
			tips: 'Structure the guesstimate before you start multiplying numbers.',
			difficulty: 'Easy'
		},
		{
			companyName: 'Helix Health AI',
			studentDetails: author('Helix Health AI'),
			content: 'PPO after the summer internship. The conversion review covered the internship project and one ML fundamentals round.',
			Comments: ['Which ML topics?'],
			tags: ['ML', 'PPO'],
			rating: 5,
			interviewProcess: 'Internship review -> ML fundamentals -> Offer',
			tips: 'Bias-variance and evaluation metrics for imbalanced data are worth revising.',
			difficulty: 'Hard'
		}
	];

	return { users, companies, experiences };
};
