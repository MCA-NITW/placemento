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
	if (initialData) {
		const updatedData = {
			...initialData,
			dateOfOffer: formatDate(new Date(initialData.dateOfOffer)),
			cutoff_pg: initialData.cutoffs?.pg?.cgpa || initialData.cutoffs?.pg?.percentage,
			cutoff_ug: initialData.cutoffs?.ug?.cgpa || initialData.cutoffs?.ug?.percentage,
			cutoff_12: initialData.cutoffs?.twelth?.cgpa || initialData.cutoffs?.twelth?.percentage,
			cutoff_10: initialData.cutoffs?.tenth?.cgpa || initialData.cutoffs?.tenth?.percentage,
			ctcBase: initialData.ctcBreakup?.base,
			cutoffs: undefined,
		};
		return updatedData;
	}

	return {
		name: '',
		status: '',
		interviewShortlist: 0,
		selectedStudentsRollNo: [],
		dateOfOffer: formatDate(new Date()),
		locations: [],
		cutoff_pg: 0,
		cutoff_ug: 0,
		cutoff_12: 0,
		cutoff_10: 0,
		typeOfOffer: '',
		profile: '',
		profileCategory: '',
		ctc: 0.0,
		ctcBase: 0.0,
		bond: 0,
	};
};

const CompanyForm = ({ actionFunc, handleFormClose, initialData, isAdd }) => {
	const [formData, setFormData] = useState(getDefaultFormData(initialData));

	const handleChange = (field, value) => {
		setFormData((prevData) => ({ ...prevData, [field]: value }));
	};

	const handleLocationsChange = (value) => {
		handleChange(
			'locations',
			value.split(',').map((loc) => loc.trim()),
		);
	};

	const handleSelectedStudentsChange = (value) => {
		handleChange(
			'selectedStudentsRollNo',
			value.split(',').map((rollNo) => rollNo.trim()),
		);
	};

	const processCutoff = (value) => ({
		cgpa: value <= 10 ? value : 0,
		percentage: value > 10 ? value : 0,
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
				tenth: processCutoff(formData.cutoff_10),
			},
			ctcBreakup: {
				base: formData.ctcBase,
				other: (formData.ctc - formData.ctcBase).toFixed(2),
			},
		};
		try {
			const res = isAdd ? await actionFunc(newCompany) : await actionFunc(initialData._id, newCompany);
			if (res.status === 200)
				toast.success(
					<ToastContent res="Success" messages={[`Company ${isAdd ? 'added' : 'updated'} successfully`]} />,
				);
			else toast.error(<ToastContent res="Error" messages={res.data.errors} />);
			handleFormClose(true);
		} catch (error) {
			console.error('Error:', error);
			toast.error(<ToastContent res="Error" messages={error.response.data.errors} />);
		}
	};

	return (
		<div className="modal" id="companyFormModal">
			<div className="modal-dialog">
				<form className="company-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="companyName">Company Name</label>
						<input
							type="text"
							id="companyName"
							className="form-control"
							placeholder="Company Name"
							value={formData.name}
							onChange={(e) => handleChange('name', e.target.value)}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="status">Status</label>
						<select
							id="status"
							className="form-select"
							value={formData.status}
							onChange={(e) => handleChange('status', e.target.value)}
						>
							<option value="" disabled>
								Select Status
							</option>
							<option value="upcoming">Upcoming</option>
							<option value="ongoing">Ongoing</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>

					<div className="input-group">
						<div className="form-group">
							<label htmlFor="interviewShortlist">Interview/Intern Shortlists</label>
							<input
								type="number"
								id="interviewShortlist"
								className="form-control"
								placeholder="Interview/Intern Shortlist"
								value={formData.interviewShortlist}
								onChange={(e) => handleChange('interviewShortlist', e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="dateOfOffer">Date of Offer</label>
							<input
								type="date"
								id="dateOfOffer"
								className="form-control"
								placeholder="Date of Offer"
								value={formData.dateOfOffer}
								onChange={(e) => handleChange('dateOfOffer', e.target.value)}
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="selectedStudentsRollNo">Selected Students</label>
						<textarea
							id="selectedStudentsRollNo"
							className="form-control"
							placeholder="(Comma separated roll numbers of selected students)"
							value={formData.selectedStudentsRollNo.join(',')}
							onChange={(e) => handleSelectedStudentsChange(e.target.value)}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="locations">Locations</label>
						<textarea
							id="locations"
							className="form-control"
							placeholder="Locations  (Separate multiple locations with commas)"
							value={formData.locations.join(',')}
							onChange={(e) => handleLocationsChange(e.target.value)}
						/>
					</div>

					<div className="input-group-out">
						<div className="input-group">
							<div className="form-group">
								<label htmlFor="cutoffPG">Cutoff PG</label>
								<input
									type="number"
									id="cutoffPG"
									className="form-control"
									placeholder="Cutoff PG"
									value={formData.cutoff_pg}
									onChange={(e) => handleChange('cutoff_pg', e.target.value)}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="cutoffUG">Cutoff UG</label>
								<input
									type="number"
									id="cutoffUG"
									className="form-control"
									placeholder="Cutoff UG"
									value={formData.cutoff_ug}
									onChange={(e) => handleChange('cutoff_ug', e.target.value)}
								/>
							</div>
						</div>
						<div className="input-group">
							<div className="form-group">
								<label htmlFor="cutoff12">Cutoff 12</label>
								<input
									type="number"
									id="cutoff12"
									className="form-control"
									placeholder="Cutoff 12"
									value={formData.cutoff_12}
									onChange={(e) => handleChange('cutoff_12', e.target.value)}
								/>
							</div>

							<div className="form-group">
								<label htmlFor="cutoff10">Cutoff 10</label>
								<input
									type="number"
									id="cutoff10"
									className="form-control"
									placeholder="Cutoff 10"
									value={formData.cutoff_10}
									onChange={(e) => handleChange('cutoff_10', e.target.value)}
								/>
							</div>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="typeOfOffer">Offer</label>
						<select
							id="typeOfOffer"
							className="form-select"
							value={formData.typeOfOffer}
							onChange={(e) => handleChange('typeOfOffer', e.target.value)}
						>
							<option value="" disabled>
								Select Type of Offer
							</option>
							<option value="PPO">PPO</option>
							<option value="FTE">FTE</option>
							<option value="6M+FTE">6M+FTE</option>
							<option value="Intern">Intern</option>
						</select>
					</div>
					<div className="input-group">
						<div className="form-group">
							<label htmlFor="profile">Profile</label>
							<input
								type="text"
								id="profile"
								className="form-control"
								placeholder="Profile"
								value={formData.profile}
								onChange={(e) => handleChange('profile', e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="profileCategory">Profile Category</label>
							<select
								id="profileCategory"
								className="form-select"
								value={formData.profileCategory}
								onChange={(e) => handleChange('profileCategory', e.target.value)}
							>
								<option value="" disabled>
									Select Profile Category
								</option>
								<option value="Software">Software</option>
								<option value="Analyst">Analyst</option>
								<option value="Others">Others</option>
							</select>
						</div>
					</div>

					<div className="input-group">
						<div className="form-group">
							<label htmlFor="ctc">CTC</label>
							<input
								type="number"
								id="ctc"
								className="form-control"
								placeholder="CTC"
								value={formData.ctc}
								onChange={(e) => handleChange('ctc', e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="ctcBase">CTC Base</label>
							<input
								type="number"
								id="ctcBase"
								className="form-control"
								placeholder="CTC Base"
								value={formData.ctcBase}
								onChange={(e) => handleChange('ctcBase', e.target.value)}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="bond">Bond</label>
							<input
								type="number"
								id="bond"
								className="form-control"
								placeholder="Bond in Months"
								value={formData.bond}
								onChange={(e) => handleChange('bond', e.target.value)}
							/>
						</div>
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
	isAdd: PropTypes.bool.isRequired,
};

export default CompanyForm;
