// Common options and constants used across the application
export const OPTIONS = {
	// Location options used in both Student and Company filters
	LOCATIONS: [
		{ label: 'Bangalore', value: 'Bangalore' },
		{ label: 'Chennai', value: 'Chennai' },
		{ label: 'Hyderabad', value: 'Hyderabad' },
		{ label: 'Mumbai', value: 'Mumbai' },
		{ label: 'Pune', value: 'Pune' },
		{ label: 'Delhi', value: 'Delhi' },
		{ label: 'Kolkata', value: 'Kolkata' },
		{ label: 'Ahmedabad', value: 'Ahmedabad' },
		{ label: 'Other', value: 'Other' }
	],

	// CTC options used in both Student and Company filters
	CTC: [
		{ label: 'Less than 10LPA', value: 10 },
		{ label: '10-20LPA', value: 20 },
		{ label: '20-30LPA', value: 30 },
		{ label: 'More than 30LPA', value: 31 }
	],

	// Base salary options
	BASE: [
		{ label: 'Less than 5LPA', value: 5 },
		{ label: '5-10LPA', value: 10 },
		{ label: '10-15LPA', value: 15 },
		{ label: 'More than 15LPA', value: 16 }
	],

	// Status options for companies
	STATUS: [
		{ label: 'Completed', value: 'completed' },
		{ label: 'Ongoing', value: 'ongoing' },
		{ label: 'Cancelled', value: 'cancelled' }
	],

	// Offer types
	OFFERS: [
		{ label: 'PPO', value: 'PPO' },
		{ label: 'FTE', value: 'FTE' },
		{ label: '6M+FTE', value: '6M+FTE' },
		{ label: 'Intern', value: 'Intern' }
	],

	// Profile categories
	PROFILE_CATEGORIES: [
		{ label: 'Software', value: 'Software' },
		{ label: 'Analyst', value: 'Analyst' },
		{ label: 'Others', value: 'Others' }
	],

	// Numeric range options (shortlists, selects, etc.)
	NUMERIC_RANGES: {
		BASIC: [
			{ label: '0', value: 0 },
			{ label: '1', value: 1 },
			{ label: '2', value: 2 },
			{ label: '3', value: 3 },
			{ label: '>3', value: 4 }
		]
	},

	// Role options
	ROLES: [
		{ value: 'student', label: 'Student' },
		{ value: 'placementCoordinator', label: 'PC' },
		{ value: 'admin', label: 'Admin' }
	],

	// Verification status
	VERIFICATION: [
		{ value: 'verified', label: 'Verified' },
		{ value: 'unverified', label: 'Unverified' }
	],

	// Batch years
	BATCHES: [
		{ value: 2023, label: '2023' },
		{ value: 2024, label: '2024' },
		{ value: 2025, label: '2025' },
		{ value: 2026, label: '2026' }
	],

	// Placement status
	PLACEMENT_STATUS: [
		{ value: 'placed', label: 'Placed' },
		{ value: 'notPlaced', label: 'Not Placed' }
	],

	// Gap in academics options
	GAP: [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: 'More than 2', value: 3 }
	],

	// Backlogs options
	BACKLOGS: [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: 'More than 2', value: 3 }
	],

	// CGPA ranges
	CGPA_RANGES: {
		PG: [
			{ label: 'Less than 6.5', value: 6.5 },
			{ label: '6.5-7', value: 7 },
			{ label: '7-7.5', value: 7.5 },
			{ label: '7.5-8', value: 8 },
			{ label: 'More than 8', value: 9 }
		],
		OVERALL: [
			{ label: 'Less than 6.5', value: 6.5 },
			{ label: 'More than 6.5', value: 7 },
			{ label: 'More than 7', value: 7.5 },
			{ label: 'More than 7.5', value: 8 },
			{ label: 'More than 8', value: 9 }
		]
	}
};

// Common validation patterns
export const VALIDATION = {
	EMAIL_DOMAIN: '@student.nitw.ac.in',
	ROLL_NO_REGEX: /^\d{2}MCF1R\d{2,}$/,
	PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
	EMAIL_REGEX: /@student\.nitw\.ac\.in$/
};

// Common utility functions
export const UTILS = {
	formatDate: (date) => {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	},

	formatEmail: (enteredEmail) => {
		const domain = VALIDATION.EMAIL_DOMAIN;
		let formattedEmail = enteredEmail.trim().toLowerCase();
		if (!formattedEmail.startsWith(domain)) {
			formattedEmail = domain ? `${formattedEmail}${domain}` : formattedEmail;
		}
		return formattedEmail;
	},

	checkCTCRange: (ctc, selectedRanges) => {
		if (selectedRanges.length === 0) return true;
		if (selectedRanges.includes(10)) return ctc < 10;
		if (selectedRanges.includes(20)) return ctc >= 10 && ctc < 20;
		if (selectedRanges.includes(30)) return ctc >= 20 && ctc < 30;
		if (selectedRanges.includes(31)) return ctc >= 30;
		return false;
	},

	checkBaseRange: (base, selectedRanges) => {
		if (selectedRanges.length === 0) return true;
		if (selectedRanges.includes(5)) return base < 5;
		if (selectedRanges.includes(10)) return base >= 5 && base < 10;
		if (selectedRanges.includes(15)) return base >= 10 && base < 15;
		if (selectedRanges.includes(16)) return base >= 15;
		return false;
	}
};
