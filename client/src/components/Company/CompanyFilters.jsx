import PropTypes from 'prop-types';
import Filter from '../Filter/Filter';

const CompanyFilters = ({ optionClickHandler }) => {
	const statusOptions = [
		{ label: 'Completed', value: 'completed' },
		{ label: 'Ongoing', value: 'ongoing' },
		{ label: 'Cancelled', value: 'cancelled' }
	];

	const offerOptions = [
		{ label: 'PPO', value: 'PPO' },
		{ label: 'FTE', value: 'FTE' },
		{ label: '6M+FTE', value: '6M+FTE' },
		{ label: 'Intern', value: 'Intern' }
	];

	const profileCategoryOptions = [
		{ label: 'Software', value: 'Software' },
		{ label: 'Analyst', value: 'Analyst' },
		{ label: 'Others', value: 'Others' }
	];

	const shortlistOptions = [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: '3', value: 3 },
		{ label: '>3', value: 4 }
	];

	const selectOptions = [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: '3', value: 3 },
		{ label: '>3', value: 4 }
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

	const locationOptions = [
		{ label: 'Bangalore', value: 'Bangalore' },
		{ label: 'Chennai', value: 'Chennai' },
		{ label: 'Hyderabad', value: 'Hyderabad' },
		{ label: 'Mumbai', value: 'Mumbai' },
		{ label: 'Pune', value: 'Pune' },
		{ label: 'Delhi', value: 'Delhi' },
		{ label: 'Kolkata', value: 'Kolkata' },
		{ label: 'Ahmedabad', value: 'Ahmedabad' },
		{ label: 'Other', value: 'Other' }
	];

	const allOptions = {
		Status: statusOptions,
		Offer: offerOptions,
		'Profile Category': profileCategoryOptions,
		Shortlists: shortlistOptions,
		Selects: selectOptions,
		CTC: ctcOptions,
		Base: baseOptions,
		Locations: locationOptions
	};

	return <Filter Allptions={allOptions} optionClickHandler={optionClickHandler} />;
};

CompanyFilters.propTypes = {
	optionClickHandler: PropTypes.func.isRequired
};

export default CompanyFilters;
