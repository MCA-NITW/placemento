import { OPTIONS } from '../../constants/options';
import type { CompanyFiltersProps } from '../../types';
import Filter from '../Filter/Filter';

const CompanyFilters = ({ optionClickHandler }: CompanyFiltersProps) => {
	const allOptions = {
		Status: OPTIONS.STATUS,
		Offer: OPTIONS.OFFERS,
		'Profile Category': OPTIONS.PROFILE_CATEGORIES,
		Shortlists: OPTIONS.NUMERIC_RANGES.BASIC,
		Selects: OPTIONS.NUMERIC_RANGES.BASIC,
		CTC: OPTIONS.CTC,
		Base: OPTIONS.BASE,
		Locations: OPTIONS.LOCATIONS
	};

	return <Filter allOptions={allOptions} optionClickHandler={optionClickHandler} />;
};

export default CompanyFilters;
