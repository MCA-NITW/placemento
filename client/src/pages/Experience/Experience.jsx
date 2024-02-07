import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaRegComment } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { deleteExperience, getAllExperience } from '../../api/experienceApi';
import ToastContent from '../../components/ToastContent/ToastContent';
import getUser from '../../utils/user';
import './Experience.css';
import ExperienceForm from './ExperienceForm';

const Experience = () => {
	const user = getUser();
	const [experiences, setExperiences] = useState([]);
	const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
	const [showExperienceViewModal, setShowExperienceViewModal] = useState(false);
	const [experienceViewModalData, setExperienceViewModalData] = useState({});
	const [initialData, setInitialData] = useState({});
	const [isAdd, setIsAdd] = useState(true);

	const fetchData = async () => {
		try {
			const response = await getAllExperience();
			response.data.experiences.forEach((experience) => {
				const postDate = new Date(experience.postDate);
				const formattedDate = postDate.toLocaleDateString('en-In', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				});
				const formattedTime = postDate.toLocaleTimeString('en-In', {
					hour: 'numeric',
					minute: 'numeric',
					hour12: true
				});
				experience.postDate = `${formattedTime} (${formattedDate})`;
			});

			setExperiences(response.data.experiences);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleDeleteButtonClick = async (experience) => {
		try {
			const id = experience._id;
			await deleteExperience(id);
			toast.success(<ToastContent res="success" messages={[`Experience deleted successfully.`]} />);
			fetchData();
			setShowExperienceViewModal(false);
		} catch (error) {
			console.error('Error deleting experience:', error);
			toast.error(<ToastContent res="Error" messages={error.response.data.errors} />);
		}
	};

	const handleEditButtonClick = (experience) => {
		setInitialData(experience);
		setIsAdd(false);
		setShowExperienceViewModal(false);
		setShowAddExperienceModal(true);
	};

	const closeExperienceAddModal = useCallback((fetch) => {
		setShowAddExperienceModal(false);
		if (fetch) fetchData();
	}, []);

	const addExperienceModal = () => {
		if (!showAddExperienceModal) return null;
		return ReactDOM.createPortal(
			<ExperienceForm closeExperienceAddModal={closeExperienceAddModal} initialData={initialData} isAdd={isAdd} />,
			document.getElementById('modal-root')
		);
	};

	const experienceViewModal = () => {
		if (!showExperienceViewModal) return null;
		return ReactDOM.createPortal(
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
						<div className="experience-tags">
							{experienceViewModalData.tags.map((tag) => (
								<div key={tag} className="experience-tag">
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
							{user.rollNo === experienceViewModalData.studentDetails.rollNo ? (
								<>
									<button type="button" className="btn btn-primary" onClick={() => handleEditButtonClick(experienceViewModalData)}>
										{' '}
										Edit{' '}
									</button>
									<button type="button" className="btn btn-danger" onClick={() => handleDeleteButtonClick(experienceViewModalData)}>
										{' '}
										Delete{' '}
									</button>{' '}
								</>
							) : (
								<></>
							)}

							<button type="button" className="btn btn-primary" onClick={() => setShowExperienceViewModal(false)}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>,
			document.getElementById('modal-root')
		);
	};

	return (
		<div className="container">
			<h1>Experience</h1>
			{addExperienceModal()}
			{experienceViewModal()}
			<button
				className="btn btn-primary"
				onClick={() => {
					setShowAddExperienceModal(true);
					setInitialData({});
					setIsAdd(true);
				}}
			>
				Add Experience
			</button>
			<div className="experience-container">
				{experiences &&
					experiences.map((experience) => (
						<div key={experience._id} className="experience-item">
							<div className="experience-header">
								<h3 className="experience-student-details">
									{experience.studentDetails.name} ({experience.studentDetails.batch})
								</h3>
								<div>{experience.postDate}</div>
							</div>
							<button
								className="experience-Title"
								onClick={() => {
									setShowExperienceViewModal(true);
									setExperienceViewModalData(experience);
								}}
							>
								{experience.companyName}
							</button>
							<div className="experience-tags">
								{experience.tags.map((tag) => (
									<div key={tag} className="experience-tag">
										#{tag}
									</div>
								))}
							</div>
							<div className="experience-comments-count">
								{experience.Comments.length} <FaRegComment />
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default Experience;
