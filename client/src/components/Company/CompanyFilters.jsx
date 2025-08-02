import PropTypes from 'prop-types';
import { OPTIONS } from '../../constants/options';
import Filter from '../Filter/Filter';

const CompanyFilters = ({ optionClickHandler }) => {
	// Use centralized options from constants
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

CompanyFilters.propTypes = {
	optionClickHandler: PropTypes.func.isRequired
};

export default CompanyFilters;
