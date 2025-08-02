import PropTypes from 'prop-types';
import { OPTIONS } from '../../constants/options';
import Filter from '../Filter/Filter';

const StudentFilters = ({ optionClickHandler, role }) => {
	// Use centralized options from constants
	const allOptions = {
		Role: OPTIONS.ROLES,
		Batch: OPTIONS.BATCHES,
		Placement: OPTIONS.PLACEMENT_STATUS,
		Location: [...OPTIONS.LOCATIONS, { label: 'N/A', value: 'N/A' }], // Add N/A for students
		CTC: OPTIONS.CTC,
		Base: OPTIONS.BASE
	};

	// Admin-only filters
	const adminOptions = {
		Verification: OPTIONS.VERIFICATION,
		Gap: OPTIONS.GAP,
		Backlogs: OPTIONS.BACKLOGS,
		'PG CGPA': OPTIONS.CGPA_RANGES.PG,
		'Overall CGPA': OPTIONS.CGPA_RANGES.OVERALL
	};

	// Combine options based on user role
	const filterOptions = role === 'admin' || role === 'placementCoordinator' ? { ...allOptions, ...adminOptions } : allOptions;

	return <Filter allOptions={filterOptions} optionClickHandler={optionClickHandler} />;
};

StudentFilters.propTypes = {
	optionClickHandler: PropTypes.func.isRequired,
	role: PropTypes.string.isRequired
};

export default StudentFilters;
