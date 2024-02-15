import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ToastContent from '../ToastContent/ToastContent';
import './CompanyForm.css';

const formatDate = (date) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const getDefaultFormData = (initialData) => {
	return {
		name: initialData?.name || '',
		status: initialData?.status || '',
		interviewShortlist: initialData?.interviewShortlist || 0,
		selectedStudentsRollNo: initialData?.selectedStudentsRollNo || [],
		dateOfOffer: formatDate(new Date(initialData?.dateOfOffer || new Date())),
		locations: initialData?.locations || [],
		cutoff_pg: initialData?.cutoffs?.pg?.cgpa || initialData?.cutoffs?.pg?.percentage || 0,
		cutoff_ug: initialData?.cutoffs?.ug?.cgpa || initialData?.cutoffs?.ug?.percentage || 0,
		cutoff_12: initialData?.cutoffs?.twelth?.cgpa || initialData?.cutoffs?.twelth?.percentage || 0,
		cutoff_10: initialData?.cutoffs?.tenth?.cgpa || initialData?.cutoffs?.tenth?.percentage || 0,
		typeOfOffer: initialData?.typeOfOffer || '',
		profile: initialData?.profile || '',
		profileCategory: initialData?.profileCategory || '',
		ctc: initialData?.ctc || 0,
		ctcBase: initialData?.ctcBreakup?.base || 0,
		bond: initialData?.bond || 0
	};
};

const CompanyForm = ({ actionFunc, handleFormClose, initialData, isAdd }) => {
	const [formData, setFormData] = useState(getDefaultFormData(initialData));

	const handleChange = (field, value) => {
		setFormData((prevData) => ({ ...prevData, [field]: value }));
	};

	const handleDropdownChange = (field, value) => {
		handleChange(field, value === '' ? [] : value.split(',').map((i) => i.trim()));
	};

	const processCutoff = (value) => ({
		cgpa: value <= 10 ? value : 0,
		percentage: value > 10 ? value : 0
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newCompany = {
			...formData,
			selected: formData.selectedStudentsRollNo.length,
			dateOfOffer: formatDate(new Date(formData.dateOfOffer)),
			cutoffs: {
				pg: processCutoff(formData.cutoff_pg),
				ug: processCutoff(formData.cutoff_ug),
				twelth: processCutoff(formData.cutoff_12),
				tenth: processCutoff(formData.cutoff_10)
			},
			ctcBreakup: {
				base: formData.ctcBase,
				other: (formData.ctc - formData.ctcBase).toFixed(2)
			}
		};
		try {
			const res = isAdd ? await actionFunc(newCompany) : await actionFunc(initialData._id, newCompany);
			if (res.status === 200) toast.success(<ToastContent res="Success" messages={[`Company ${isAdd ? 'added' : 'updated'} successfully`]} />);
			else toast.error(<ToastContent res="Error" messages={res.data.errors} />);
			handleFormClose(true);
		} catch (error) {
			console.error('Error:', error);
			toast.error(<ToastContent res="Error" messages={error.response.data.errors} />);
		}
	};

	const formInputGroupRenderer = (label, id, type, value) => (
		<div className="form-group">
			<label htmlFor={id}>{label}</label>
			<input type={type} id={id} className="form-control" placeholder={label} value={value} onChange={(e) => handleChange(id, e.target.value)} />
		</div>
	);

	const formTextAreaGroupRenderer = (label, id, value) => (
		<div className="form-group">
			<label htmlFor={id}>{label}</label>
			<textarea
				id={id}
				className="form-control"
				placeholder={`(Comma separated ${label})`}
				value={value.join(',')}
				onChange={(e) => handleDropdownChange(id, e.target.value)}
			/>
		</div>
	);

	const formDropdownGroupRenderer = (label, id, options, value) => (
		<div className="form-group">
			<label htmlFor={id}>{label}</label>
			<select id={id} className="form-select" value={value} onChange={(e) => handleChange(id, e.target.value)}>
				<option value="" disabled>
					Select {label}
				</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);

	const statusOptions = [
		{ label: 'Ongoing', value: 'ongoing' },
		{ label: 'Completed', value: 'completed' },
		{ label: 'Cancelled', value: 'cancelled' }
	];

	const profileCategoryOptions = [
		{ label: 'Software', value: 'Software' },
		{ label: 'Analyst', value: 'Analyst' },
		{ label: 'Others', value: 'Others' }
	];

	const offerOptions = [
		{ label: 'PPO', value: 'PPO' },
		{ label: 'FTE', value: 'FTE' },
		{ label: '6M+FTE', value: '6M+FTE' },
		{ label: 'Intern', value: 'Intern' }
	];

	return (
		<div className="modal" id="companyFormModal">
			<div className="modal-dialog">
				<form className="company-form" onSubmit={handleSubmit}>
					{formInputGroupRenderer('Company Name', 'name', 'text', formData.name)}
					{formDropdownGroupRenderer('Status', 'status', statusOptions, formData.status)}

					<div className="input-group">
						{formInputGroupRenderer('Interview/Intern Shortlists', 'interviewShortlist', 'number', formData.interviewShortlist)}
						{formInputGroupRenderer('Date of Offer', 'dateOfOffer', 'date', formData.dateOfOffer)}
					</div>

					{formTextAreaGroupRenderer('Selected Students Roll No', 'selectedStudentsRollNo', formData.selectedStudentsRollNo)}
					{formTextAreaGroupRenderer('Locations', 'locations', formData.locations)}

					<div className="input-group-out">
						<div className="input-group">
							{formInputGroupRenderer('Cutoff PG', 'cutoff_pg', 'number', formData.cutoff_pg)}
							{formInputGroupRenderer('Cutoff UG', 'cutoff_ug', 'number', formData.cutoff_ug)}
						</div>
						<div className="input-group">
							{formInputGroupRenderer('Cutoff 12', 'cutoff_12', 'number', formData.cutoff_12)}
							{formInputGroupRenderer('Cutoff 10', 'cutoff_10', 'number', formData.cutoff_10)}
						</div>
					</div>

					{formDropdownGroupRenderer('Offer', 'typeOfOffer', offerOptions, formData.typeOfOffer)}
					<div className="input-group">
						{formInputGroupRenderer('Profile', 'profile', 'text', formData.profile)}
						{formDropdownGroupRenderer('Profile Category', 'profileCategory', profileCategoryOptions, formData.profileCategory)}
					</div>

					<div className="input-group">
						{formInputGroupRenderer('CTC', 'ctc', 'number', formData.ctc)}
						{formInputGroupRenderer('CTC Base', 'ctcBase', 'number', formData.ctcBase)}
						{formInputGroupRenderer('Bond', 'bond', 'number', formData.bond)}
					</div>

					<div className="company-form__buttons">
						<button type="submit" className="btn btn-primary">
							{isAdd ? 'Add' : 'Update'}
						</button>
						<button type="button" className="btn btn-primary" onClick={() => handleFormClose(false)}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

CompanyForm.propTypes = {
	actionFunc: PropTypes.func.isRequired,
	handleFormClose: PropTypes.func.isRequired,
	initialData: PropTypes.object,
	isAdd: PropTypes.bool.isRequired
};

export default CompanyForm;
