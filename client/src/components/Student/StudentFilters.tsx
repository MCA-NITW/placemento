import { OPTIONS } from '../../constants/options';
import type { StudentFiltersProps } from '../../types';
import Filter from '../Filter/Filter';

const StudentFilters = ({ optionClickHandler, role }: StudentFiltersProps) => {
	const allOptions = {
		Role: OPTIONS.ROLES,
		Batch: OPTIONS.BATCHES,
		Placement: OPTIONS.PLACEMENT_STATUS,
		Location: [...OPTIONS.LOCATIONS, { label: 'N/A', value: 'N/A' }],
		CTC: OPTIONS.CTC,
		Base: OPTIONS.BASE
	};

	const adminOptions = {
		Verification: OPTIONS.VERIFICATION,
		Gap: OPTIONS.GAP,
		Backlogs: OPTIONS.BACKLOGS,
		'PG CGPA': OPTIONS.CGPA_RANGES.PG,
		'Overall CGPA': OPTIONS.CGPA_RANGES.OVERALL
	};

	const filterOptions = role === 'admin' || role === 'placementCoordinator' ? { ...allOptions, ...adminOptions } : allOptions;

	return <Filter allOptions={filterOptions} optionClickHandler={optionClickHandler} />;
};

export default StudentFilters;
