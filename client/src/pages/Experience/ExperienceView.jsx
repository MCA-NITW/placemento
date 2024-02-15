import propTypes from 'prop-types';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { deleteExperience } from '../../api/experienceApi';
import Modal from '../../components/Modal/Modal';
import ToastContent from '../../components/ToastContent/ToastContent';
import ExperienceForm from './ExperienceForm';

const ExperienceView = ({ closeExperienceViewModal, experienceViewModalData, user }) => {
	const [initialData, setInitialData] = useState({});
	const [showupdateExperienceModal, setShowupdateExperienceModal] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [experienceToDelete, setExperienceToDelete] = useState({});

	const onConfirmDelete = async () => {
		try {
			const id = experienceToDelete._id;
			await deleteExperience(id);
			toast.success(<ToastContent res="success" messages={[`Experience deleted successfully.`]} />);
			closeExperienceViewModal(true);
			setIsModalOpen(false);
		} catch (error) {
			console.error('Error deleting experience:', error);
			toast.error(<ToastContent res="Error" messages={error.response.data.errors} />);
		}
	};

	const handleDeleteButtonClick = (experience) => {
		setIsModalOpen(true);
		setExperienceToDelete(experience);
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
							<div>{experienceViewModalData.createdAt}</div>
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
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={onConfirmDelete}
				message="Are you sure you want to delete this Experience?"
				buttonTitle="Delete"
				rootid="experience-view-modal"
			/>
		</>
	);
};

ExperienceView.propTypes = {
	closeExperienceViewModal: propTypes.func.isRequired,
	experienceViewModalData: propTypes.object.isRequired,
	user: propTypes.object.isRequired
};

export default ExperienceView;
