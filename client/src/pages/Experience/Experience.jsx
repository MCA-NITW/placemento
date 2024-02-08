import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaRegComment } from 'react-icons/fa';
import { getAllExperience } from '../../api/experienceApi';
import './Experience.css';
import ExperienceForm from './ExperienceForm';
import ExperienceView from './ExperienceView';

const Experience = () => {
	const [experiences, setExperiences] = useState([]);
	const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
	const [showExperienceViewModal, setShowExperienceViewModal] = useState(false);
	const [experienceViewModalData, setExperienceViewModalData] = useState({});
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

	const closeExperienceAddModal = useCallback((fetch) => {
		setShowAddExperienceModal(false);
		if (fetch) fetchData();
	}, []);

	const closeExperienceViewModal = useCallback((fetch) => {
		setShowExperienceViewModal(false);
		if (fetch) fetchData();
	}, []);

	const addExperienceModal = () => {
		if (!showAddExperienceModal) return null;
		return ReactDOM.createPortal(
			<ExperienceForm closeExperienceAddModal={closeExperienceAddModal} initialData={{}} isAdd={true} />,
			document.getElementById('modal-root')
		);
	};

	const experienceViewModal = () => {
		if (!showExperienceViewModal) return null;
		return ReactDOM.createPortal(
			<ExperienceView closeExperienceViewModal={closeExperienceViewModal} experienceViewModalData={experienceViewModalData} />,
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
