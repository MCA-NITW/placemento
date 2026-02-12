interface ValidationRule {
	field: string;
	message: string;
	regex?: RegExp;
	min?: number;
	max?: number;
}

const validateFields = (user: Record<string, unknown>): string[] => {
	const errorMessages: string[] = [];

	const validationRules: ValidationRule[] = [
		{ field: 'name', message: 'Name is required.' },
		{ field: 'email', message: 'Enter a valid NITW email.', regex: /@student\.nitw\.ac\.in$/ },
		{
			field: 'password',
			message:
				'Password must be at least 6 characters long and contain at least one uppercase, one lowercase, and one numeric character.',
			regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
		},
		{ field: 'rollNo', message: 'Enter a valid roll number. (Eg: 21MCF1R01)', regex: /^\d{2}MCF1R\d{2,}$/ },
		{ field: 'pg.cgpa', message: 'PG CGPA field must be between 0 and 10.', min: 0, max: 10 },
		{ field: 'ug.cgpa', message: 'UG CGPA field must be between 0 and 10.', min: 0, max: 10 },
		{ field: 'hsc.cgpa', message: '10th CGPA field must be between 0 and 10.', min: 0, max: 10 },
		{ field: 'ssc.cgpa', message: '12th CGPA field must be between 0 and 10.', min: 0, max: 10 },
		{ field: 'pg.percentage', message: 'PG percentage field must be between 0 and 100.', min: 0, max: 100 },
		{ field: 'ug.percentage', message: 'UG percentage field must be between 0 and 100.', min: 0, max: 100 },
		{ field: 'hsc.percentage', message: '10th percentage field must be between 0 and 100.', min: 0, max: 100 },
		{ field: 'ssc.percentage', message: '12th percentage field must be between 0 and 100.', min: 0, max: 100 },
		{ field: 'totalGapInAcademics', message: 'Total gap in academics must be greater than or equal to 0.', min: 0, max: 10 },
		{ field: 'backlogs', message: 'Backlogs must be greater than or equal to 0.', min: 0, max: 10 }
	];

	validationRules.forEach((rule) => {
		const fieldPath = rule.field.split('.');
		let value: unknown = user;
		for (const field of fieldPath) {
			value = (value as Record<string, unknown>)?.[field];
		}

		if (
			value === undefined ||
			(rule.regex && !rule.regex.test(String(value))) ||
			(rule.min !== undefined && (value as number) < rule.min) ||
			(rule.max !== undefined && (value as number) > rule.max)
		) {
			errorMessages.push(rule.message);
		}
	});

	return errorMessages;
};

export default validateFields;
