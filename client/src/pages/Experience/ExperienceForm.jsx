import propTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { addExperience, updateExperience } from '../../api/experienceApi';
import ToastContent from '../../components/ToastContent/ToastContent';

const ExperienceForm = ({ closeExperienceAddModal, initialData, isAdd }) => {
	const [companyName, setCompanyName] = useState(isAdd ? '' : initialData.companyName);
	const [content, setContent] = useState(isAdd ? '' : initialData.content);

	const handleAddExperience = async (e) => {
		e.preventDefault();
		try {
			const id = isAdd ? '' : initialData._id;
			const response = await (isAdd ? addExperience({ companyName, content }) : updateExperience(id, { companyName, content }));
			toast.success(<ToastContent res="Success" messages={[response.data.message]} />);
			closeExperienceAddModal(true);
		} catch (error) {
			console.error('Error adding experience:', error);
			toast.error(<ToastContent res="Error" messages={error.response.data.errors} />);
		}
	};

	return (
		<div className="modal" id="experience-modal">
			<div className="modal-dialog">
				<form className="experience-form" onSubmit={handleAddExperience}>
					<div className="experience-form-group">
						<label htmlFor="companyName">Company Name</label>
						<input
							type="text"
							className="form-control"
							id="companyName"
							name="companyName"
							value={companyName}
							onChange={(e) => setCompanyName(e.target.value)}
						/>
					</div>
					<div className="experience-form-group">
						<label htmlFor="content">Content</label>
						<textarea className="form-control" id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} />
					</div>
					<div className="modal-buttons">
						<button type="submit" className="btn btn-primary">
							{isAdd ? 'Add' : 'Update'}
						</button>
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => {
								closeExperienceAddModal(false);
							}}
						>
							Close
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

ExperienceForm.propTypes = {
	closeExperienceAddModal: propTypes.func.isRequired,
	initialData: propTypes.object.isRequired,
	isAdd: propTypes.bool.isRequired
};

export default ExperienceForm;
