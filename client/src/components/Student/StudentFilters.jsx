import PropTypes from 'prop-types';
import Filter from '../Filter/Filter';

const StudentFilters = ({ optionClickHandler, role }) => {
	const roleOptions = [
		{ value: 'student', label: 'Student' },
		{ value: 'placementCoordinator', label: 'PC' },
		{ value: 'admin', label: 'Admin' }
	];

	const verifyOptions = [
		{ value: 'verified', label: 'Verified' },
		{ value: 'unverified', label: 'Unverified' }
	];

	const batchOptions = [
		{ value: 2023, label: '2023' },
		{ value: 2024, label: '2024' },
		{ value: 2025, label: '2025' },
		{ value: 2026, label: '2026' }
	];

	const placedOptions = [
		{ value: 'placed', label: 'Placed' },
		{ value: 'notPlaced', label: 'Not Placed' }
	];

	const locationOptions = [
		{ label: 'Bangalore', value: 'Bangalore' },
		{ label: 'Chennai', value: 'Chennai' },
		{ label: 'Hyderabad', value: 'Hyderabad' },
		{ label: 'Mumbai', value: 'Mumbai' },
		{ label: 'Pune', value: 'Pune' },
		{ label: 'Delhi', value: 'Delhi' },
		{ label: 'Kolkata', value: 'Kolkata' },
		{ label: 'Ahmedabad', value: 'Ahmedabad' },
		{ label: 'Other', value: 'Other' },
		{ label: 'N/A', value: 'N/A' }
	];

	const ctcOptions = [
		{ label: 'Less than 10LPA', value: 10 },
		{ label: '10-20LPA', value: 20 },
		{ label: '20-30LPA', value: 30 },
		{ label: 'More than 30LPA', value: 31 }
	];

	const baseOptions = [
		{ label: 'Less than 5LPA', value: 5 },
		{ label: '5-10LPA', value: 10 },
		{ label: '10-15LPA', value: 15 },
		{ label: 'More than 15LPA', value: 16 }
	];

	const gapOptions = [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: 'More than 2', value: 3 }
	];

	const backlogsOptions = [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: 'More than 2', value: 3 }
	];

	const pgcgpaOptions = [
		{ label: 'Less than 6.5', value: 6.5 },
		{ label: '6.5-7', value: 7 },
		{ label: '7-7.5', value: 7.5 },
		{ label: '7.5-8', value: 8 },
		{ label: 'More than 8', value: 9 }
	];

	const overAllcgpaOptions = [
		{ label: 'Less than 6.5', value: 6.5 },
		{ label: 'More than 6.5', value: 7 },
		{ label: 'More than 7', value: 7.5 },
		{ label: 'More than 7.5', value: 8 },
		{ label: 'More than 8', value: 9 }
	];

	const allOptions = {
		Role: roleOptions,
		Batch: batchOptions,
		Placement: placedOptions,
		Location: locationOptions,
		CTC: ctcOptions,
		Base: baseOptions
	};

	const adminOptions = {
		Verification: verifyOptions,
		Gap: gapOptions,
		Backlogs: backlogsOptions,
		'PG CGPA': pgcgpaOptions,
		'Overall CGPA': overAllcgpaOptions
	};

	return (
		<Filter
			Allptions={role === 'admin' || role === 'placementCoordinator' ? { ...allOptions, ...adminOptions } : allOptions}
			optionClickHandler={optionClickHandler}
		/>
	);
};

StudentFilters.propTypes = {
	optionClickHandler: PropTypes.func.isRequired,
	role: PropTypes.string.isRequired
};

export default StudentFilters;
