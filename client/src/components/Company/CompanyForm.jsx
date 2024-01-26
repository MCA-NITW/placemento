import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import './CompanyForm.css';

const formatDate = (date) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const getDefaultFormData = (initialData) => {
	const defaultData = {
		name: '',
		status: '',
		interviewShortlist: 0,
		selectedStudents: [],
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

	if (initialData) {
		defaultData.name = initialData.name || defaultData.name;
		defaultData.status = initialData.status || defaultData.status;
		defaultData.interviewShortlist = initialData.interviewShortlist || defaultData.interviewShortlist;
		defaultData.selectedStudents = initialData.selectedStudentsRollNo || defaultData.selectedStudents;
		defaultData.dateOfOffer = initialData.dateOfOffer
			? formatDate(new Date(initialData.dateOfOffer))
			: defaultData.dateOfOffer;
		defaultData.locations = initialData.locations || defaultData.locations;
		defaultData.cutoff_pg = initialData.cutoffs && (initialData.cutoffs.pg?.cgpa || initialData.cutoffs.pg?.percentage);
		defaultData.cutoff_ug = initialData.cutoffs && (initialData.cutoffs.ug?.cgpa || initialData.cutoffs.ug?.percentage);
		defaultData.cutoff_12 =
			initialData.cutoffs && (initialData.cutoffs.twelth?.cgpa || initialData.cutoffs.twelth?.percentage);
		defaultData.cutoff_10 =
			initialData.cutoffs && (initialData.cutoffs.tenth?.cgpa || initialData.cutoffs.tenth?.percentage);
		defaultData.typeOfOffer = initialData.typeOfOffer || defaultData.typeOfOffer;
		defaultData.profile = initialData.profile || defaultData.profile;
		defaultData.profileCategory = initialData.profileCategory || defaultData.profileCategory;
		defaultData.ctc = initialData.ctc || defaultData.ctc;
		defaultData.ctcBase = initialData.ctcBreakup?.base || defaultData.ctcBase;
		defaultData.bond = initialData.bond || defaultData.bond;
	}

	return defaultData;
};

const ToastContent = ({ res, message }) => (
	<div>
		<h3>{res}</h3>
		<div>{message}</div>
	</div>
);

ToastContent.propTypes = {
	res: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
};

const style = {
	backgroundColor: 'var(--color-bg)',
	color: 'var(--color-white)',
	borderRadius: '1rem',
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
			'selectedStudents',
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
			name: formData.name,
			status: formData.status,
			interviewShortlist: formData.interviewShortlist,
			selected: formData.selectedStudents.length,
			selectedStudentsRollNo: formData.selectedStudents,
			dateOfOffer: formatDate(new Date(formData.dateOfOffer)),
			locations: formData.locations,
			cutoffs: {
				pg: processCutoff(formData.cutoff_pg),
				ug: processCutoff(formData.cutoff_ug),
				twelth: processCutoff(formData.cutoff_12),
				tenth: processCutoff(formData.cutoff_10),
			},
			typeOfOffer: formData.typeOfOffer,
			profile: formData.profile,
			profileCategory: formData.profileCategory,
			ctc: formData.ctc,
			ctcBreakup: {
				base: formData.ctcBase,
				other: (formData.ctc - formData.ctcBase).toFixed(2),
			},
			bond: formData.bond,
		};
		try {
			const res = isAdd ? await actionFunc(newCompany) : await actionFunc(initialData._id, newCompany);
			if (res.status === 200)
				toast.success(<ToastContent res="Success" message={`Company ${isAdd ? 'added' : 'updated'} successfully`} />, {
					style,
				});
			else toast.error(<ToastContent res="Error" message="An unexpected error occurred" />, { style });
			handleFormClose(true);
		} catch (error) {
			console.error('Error:', error);
			toast.error(<ToastContent res="Error" message="An unexpected error occurred" />, { style });
		}
	};

	return (
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
					required
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
				<label htmlFor="selectedStudents">Selected Students</label>
				<textarea
					id="selectedStudents"
					className="form-control"
					placeholder="(Comma separated roll numbers of selected students)"
					value={formData.selectedStudents.join(', ')}
					onChange={(e) => handleSelectedStudentsChange(e.target.value)}
				/>
			</div>

			<div className="form-group">
				<label htmlFor="locations">Locations</label>
				<textarea
					id="locations"
					className="form-control"
					placeholder="Locations  (Separate multiple locations with commas)"
					value={formData.locations.join(', ')}
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
	);
};

CompanyForm.propTypes = {
	actionFunc: PropTypes.func.isRequired,
	handleFormClose: PropTypes.func.isRequired,
	initialData: PropTypes.object,
	isAdd: PropTypes.bool.isRequired,
};

export default CompanyForm;
