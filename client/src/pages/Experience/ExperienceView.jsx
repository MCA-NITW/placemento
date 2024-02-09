import propTypes from 'prop-types';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { deleteExperience } from '../../api/experienceApi';
import ToastContent from '../../components/ToastContent/ToastContent';
import ExperienceForm from './ExperienceForm';

const ExperienceView = ({ closeExperienceViewModal, experienceViewModalData, user }) => {
	const [initialData, setInitialData] = useState({});
	const [showupdateExperienceModal, setShowupdateExperienceModal] = useState(false);

	const handleDeleteButtonClick = async (experience) => {
		try {
			const id = experience._id;
			await deleteExperience(id);
			toast.success(<ToastContent res="success" messages={[`Experience deleted successfully.`]} />);
			closeExperienceViewModal(true);
		} catch (error) {
			console.error('Error deleting experience:', error);
			toast.error(<ToastContent res="Error" messages={error.response.data.errors} />);
		}
	};

	const handleEditButtonClick = (experience) => {
		setInitialData(experience);
		setShowupdateExperienceModal(true);
	};

	const closeExperienceAddModal = (fetch) => {
		setShowupdateExperienceModal(false);
		if (fetch) closeExperienceViewModal(true);
	};

	const updateExperienceModal = () => {
		if (!showupdateExperienceModal) return null;
		return ReactDOM.createPortal(
			<ExperienceForm closeExperienceAddModal={closeExperienceAddModal} initialData={initialData} isAdd={false} />,
			document.getElementById('modal-root')
		);
	};

	return (
		<>
			<div className="modal" id="experience-view-modal">
				<div className="view-modal-dialog">
					<div className="experience-view">
						<div className="experience-header">
							<h3 className="experience-student-details">
								{experienceViewModalData.studentDetails.name} ({experienceViewModalData.studentDetails.batch})
							</h3>
							<div>{experienceViewModalData.postDate}</div>
						</div>
						<h3 className="experience-Title">{experienceViewModalData.companyName}</h3>
						<div className="experience-content">{experienceViewModalData.content}</div>
						<div className="experience-view-tags">
							{experienceViewModalData.tags.map((tag) => (
								<div key={tag} className="experience-view-tag">
									#{tag}
								</div>
							))}
						</div>
						<div className="experience-comments">
							{experienceViewModalData.Comments.map((comment) => (
								<div key={comment._id} className="experience-comment">
									{comment.content}
								</div>
							))}
						</div>
						<div className="modal-buttons">
							{user.rollNo === experienceViewModalData.studentDetails.rollNo && (
								<>
									<button type="button" className="btn btn-primary" onClick={() => handleEditButtonClick(experienceViewModalData)}>
										Edit
									</button>
									<button type="button" className="btn btn-danger" onClick={() => handleDeleteButtonClick(experienceViewModalData)}>
										Delete
									</button>
								</>
							)}

							<button type="button" className="btn btn-primary" onClick={() => closeExperienceViewModal(false)}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			{updateExperienceModal()}
		</>
	);
};

ExperienceView.propTypes = {
	closeExperienceViewModal: propTypes.func.isRequired,
	experienceViewModalData: propTypes.object.isRequired,
	user: propTypes.object.isRequired
};

export default ExperienceView;
