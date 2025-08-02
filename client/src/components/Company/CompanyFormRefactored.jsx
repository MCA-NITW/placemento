import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { FormField, SelectField, TextAreaField, PrimaryButton, SecondaryButton } from '../common';
import { OPTIONS, UTILS } from '../../constants/options';
import ToastContent from '../ToastContent/ToastContent';
import './CompanyForm.css';

const getDefaultFormData = (initialData) => {
	const formData = {
		name: '',
		status: '',
		interviewShortlist: 0,
		selectedStudentsRollNo: [],
		dateOfOffer: UTILS.formatDate(new Date()),
		locations: [],
		cutoff_pg: 0,
		cutoff_ug: 0,
		cutoff_12: 0,
		cutoff_10: 0,
		typeOfOffer: '',
		profile: '',
		profileCategory: '',
		ctc: 0,
		ctcBase: 0,
		bond: 0
	};

	if (initialData) {
		formData.name = initialData.name;
		formData.status = initialData.status;
		formData.interviewShortlist = initialData.interviewShortlist;
		formData.selectedStudentsRollNo = initialData.selectedStudentsRollNo;
		formData.dateOfOffer = UTILS.formatDate(new Date(initialData.dateOfOffer));
		formData.locations = initialData.locations;
		formData.cutoff_pg = initialData.cutoffs?.pg?.cgpa || initialData.cutoffs?.pg?.percentage;
		formData.cutoff_ug = initialData.cutoffs?.ug?.cgpa || initialData.cutoffs?.ug?.percentage;
		formData.cutoff_12 = initialData.cutoffs?.twelth?.cgpa || initialData.cutoffs?.twelth?.percentage;
		formData.cutoff_10 = initialData.cutoffs?.tenth?.cgpa || initialData.cutoffs?.tenth?.percentage;
		formData.typeOfOffer = initialData.typeOfOffer;
		formData.profile = initialData.profile;
		formData.profileCategory = initialData.profileCategory;
		formData.ctc = initialData.ctc;
		formData.ctcBase = initialData.ctcBreakup.base;
		formData.bond = initialData.bond;
	}
	return formData;
};

const CompanyForm = ({ actionFunc, handleFormClose, initialData, isAdd }) => {
	const [formData, setFormData] = useState(getDefaultFormData(initialData));

	const handleChange = useCallback((field, value) => {
		setFormData((prevData) => ({ ...prevData, [field]: value }));
	}, []);

	const handleArrayChange = useCallback((field, value) => {
		const arrayValue = value === '' ? [] : value.split(',').map((i) => i.trim());
		handleChange(field, arrayValue);
	}, [handleChange]);

	const processCutoff = (value) => ({
		cgpa: value <= 10 ? value : 0,
		percentage: value > 10 ? value : 0
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newCompany = {
			...formData,
			selected: formData.selectedStudentsRollNo.length,
			dateOfOffer: UTILS.formatDate(new Date(formData.dateOfOffer)),
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
			if (res.status === 200) {
				toast.success(<ToastContent res="Success" messages={[`Company ${isAdd ? 'added' : 'updated'} successfully`]} />);
			} else {
				toast.error(<ToastContent res="Error" messages={res.data.errors} />);
			}
			handleFormClose(true);
		} catch (error) {
			console.error('Error:', error);
			toast.error(<ToastContent res="Error" messages={error.response.data.errors} />);
		}
	};

	return (
		<div className="overlay" id="companyFormModal">
			<form className="company-form" onSubmit={handleSubmit}>
				<FormField
					label="Company Name"
					name="name"
					value={formData.name}
					onChange={(e) => handleChange('name', e.target.value)}
					required
				/>

				<SelectField
					label="Status"
					name="status"
					value={formData.status}
					onChange={(e) => handleChange('status', e.target.value)}
					options={OPTIONS.STATUS}
					required
				/>

				<div className="form-group">
					<FormField
						label="Interview/Intern Shortlists"
						name="interviewShortlist"
						type="number"
						value={formData.interviewShortlist}
						onChange={(e) => handleChange('interviewShortlist', e.target.value)}
						min="0"
					/>
					<FormField
						label="Date of Offer"
						name="dateOfOffer"
						type="date"
						value={formData.dateOfOffer}
						onChange={(e) => handleChange('dateOfOffer', e.target.value)}
						required
					/>
				</div>

				<TextAreaField
					label="Selected Students Roll No"
					name="selectedStudentsRollNo"
					placeholder="Comma separated roll numbers"
					value={formData.selectedStudentsRollNo.join(',')}
					onChange={(e) => handleArrayChange('selectedStudentsRollNo', e.target.value)}
					rows={2}
				/>

				<TextAreaField
					label="Locations"
					name="locations"
					placeholder="Comma separated locations"
					value={formData.locations.join(',')}
					onChange={(e) => handleArrayChange('locations', e.target.value)}
					rows={2}
				/>

				<div className="input-group-out">
					<h4>Cutoffs</h4>
					<div className="form-group">
						<FormField
							label="Cutoff PG"
							name="cutoff_pg"
							type="number"
							value={formData.cutoff_pg}
							onChange={(e) => handleChange('cutoff_pg', e.target.value)}
							min="0"
							step="0.01"
						/>
						<FormField
							label="Cutoff UG"
							name="cutoff_ug"
							type="number"
							value={formData.cutoff_ug}
							onChange={(e) => handleChange('cutoff_ug', e.target.value)}
							min="0"
							step="0.01"
						/>
					</div>
					<div className="form-group">
						<FormField
							label="Cutoff 12th"
							name="cutoff_12"
							type="number"
							value={formData.cutoff_12}
							onChange={(e) => handleChange('cutoff_12', e.target.value)}
							min="0"
							step="0.01"
						/>
						<FormField
							label="Cutoff 10th"
							name="cutoff_10"
							type="number"
							value={formData.cutoff_10}
							onChange={(e) => handleChange('cutoff_10', e.target.value)}
							min="0"
							step="0.01"
						/>
					</div>
				</div>

				<SelectField
					label="Offer Type"
					name="typeOfOffer"
					value={formData.typeOfOffer}
					onChange={(e) => handleChange('typeOfOffer', e.target.value)}
					options={OPTIONS.OFFERS}
					required
				/>

				<div className="form-group">
					<FormField
						label="Profile"
						name="profile"
						value={formData.profile}
						onChange={(e) => handleChange('profile', e.target.value)}
						required
					/>
					<SelectField
						label="Profile Category"
						name="profileCategory"
						value={formData.profileCategory}
						onChange={(e) => handleChange('profileCategory', e.target.value)}
						options={OPTIONS.PROFILE_CATEGORIES}
						required
					/>
				</div>

				<div className="form-group">
					<FormField
						label="CTC"
						name="ctc"
						type="number"
						value={formData.ctc}
						onChange={(e) => handleChange('ctc', e.target.value)}
						min="0"
						step="0.01"
						required
					/>
					<FormField
						label="CTC Base"
						name="ctcBase"
						type="number"
						value={formData.ctcBase}
						onChange={(e) => handleChange('ctcBase', e.target.value)}
						min="0"
						step="0.01"
						required
					/>
					<FormField
						label="Bond (years)"
						name="bond"
						type="number"
						value={formData.bond}
						onChange={(e) => handleChange('bond', e.target.value)}
						min="0"
					/>
				</div>

				<div className="btn-group">
					<PrimaryButton type="submit">
						{isAdd ? 'Add Company' : 'Update Company'}
					</PrimaryButton>
					<SecondaryButton type="button" onClick={() => handleFormClose(false)}>
						Cancel
					</SecondaryButton>
				</div>
			</form>
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
