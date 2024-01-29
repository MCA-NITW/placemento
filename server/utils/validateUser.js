const validateFields = (user) => {
	const errorMessages = [];
	if (!user.name) errorMessages.push('Name is required.');
	if (!user.email.endsWith('@student.nitw.ac.in')) errorMessages.push('Enter a valid NITW email.');
	if (
		user.password.length < 6 ||
		!/[a-z]/.test(user.password) ||
		!/[A-Z]/.test(user.password) ||
		!/\d/.test(user.password)
	)
		errorMessages.push(
			'Password must be atleast 6 characters long and contain atleast one uppercase, one lowercase and one numeric character.'
		);
	if (!user.rollNo.match(/^\d{2}MCF1R\d{2,}$/)) errorMessages.push('Enter a valid roll number. (Eg: 21MCF1R01)');
	if (
		user.pg.cgpa < 0 ||
		user.pg.cgpa > 10 ||
		user.ug.cgpa < 0 ||
		user.ug.cgpa > 10 ||
		user.hsc.cgpa < 0 ||
		user.hsc.cgpa > 10 ||
		user.ssc.cgpa < 0 ||
		user.ssc.cgpa > 10 ||
		user.pg.cgpa == null ||
		user.ug.cgpa == null ||
		user.hsc.cgpa == null ||
		user.ssc.cgpa == null
	)
		errorMessages.push('All CGPA fields must be between 0 and 10.');
	if (
		user.pg.percentage < 0 ||
		user.pg.percentage > 100 ||
		user.ug.percentage < 0 ||
		user.ug.percentage > 100 ||
		user.hsc.percentage < 0 ||
		user.hsc.percentage > 100 ||
		user.ssc.percentage < 0 ||
		user.ssc.percentage > 100 ||
		user.pg.percentage == null ||
		user.ug.percentage == null ||
		user.hsc.percentage == null ||
		user.ssc.percentage == null
	)
		errorMessages.push('All percentage fields must be between 0 and 100.');

	if (user.totalGapInAcademics < 0 || user.totalGapInAcademics == null || user.totalGapInAcademics > 10)
		errorMessages.push('Total gap in academics must be greater than or equal to 0.');

	if (user.backlogs < 0 || user.backlogs == null || user.backlogs > 10)
		errorMessages.push('Backlogs must be greater than or equal to 0.');

	return errorMessages;
};

module.exports = validateFields;
