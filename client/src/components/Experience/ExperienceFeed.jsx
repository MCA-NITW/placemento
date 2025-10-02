import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaRegComment } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllExperience } from '../../api/experienceApi';
import { useAuth } from '../../context/AuthContext';
import Structure from '../../components/Structure/Structure';
import './ExperienceFeed.css';
import ExperienceForm from './ExperienceForm';
import ExperienceView from './ExperienceView';

const ExperienceFeed = () => {
	const { user } = useAuth();
	const [allExperiences, setAllExperiences] = useState([]);
	const [experiences, setExperiences] = useState([]);
	const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
	const [showExperienceViewModal, setShowExperienceViewModal] = useState(false);
	const [experienceViewModalData, setExperienceViewModalData] = useState({});
	const [tags, setTags] = useState([]);
	const [activeTag, setActiveTag] = useState('All');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const formatCreatedAt = (createdAt) => {
		const formattedDate = createdAt.toLocaleDateString('en-In', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
		const formattedTime = createdAt.toLocaleTimeString('en-In', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
		return `${formattedTime} (${formattedDate})`;
	};

	const updateTags = (tags, experience) => {
		experience.tags.forEach((tag) => {
			const existingTag = tags.find((t) => t.tag === tag);
			if (existingTag) {
				existingTag.count++;
			} else {
				tags.push({ tag, count: 1 });
			}
		});
	};

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await getAllExperience();
			const tags = [];
			response.data.experiences.forEach((experience) => {
				experience.createdAt = formatCreatedAt(new Date(experience.createdAt));
				updateTags(tags, experience);
			});
			tags.sort((a, b) => b.count - a.count);
			setTags(tags);
			setExperiences(response.data.experiences);
			setAllExperiences(response.data.experiences);
		} catch (error) {
			console.error('Error fetching data:', error);
			const errorMessage = error.response?.data?.message || 'Failed to load experiences. Please try again.';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const closeExperienceAddModal = useCallback(
		(fetch) => {
			setShowAddExperienceModal(false);
			if (fetch) fetchData();
		},
		[fetchData]
	);

	const closeExperienceViewModal = useCallback(
		(fetch) => {
			setShowExperienceViewModal(false);
			if (fetch) fetchData();
		},
		[fetchData]
	);

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
			<ExperienceView closeExperienceViewModal={closeExperienceViewModal} experienceViewModalData={experienceViewModalData} user={user} />,
			document.getElementById('modal-root')
		);
	};

	const handleTagClick = (tag) => {
		if (tag === 'All') {
			setExperiences(allExperiences);
		} else {
			const filteredExperiences = allExperiences.filter((experience) => experience.tags.includes(tag));
			setExperiences(filteredExperiences);
		}
		setActiveTag(tag);
	};

	const renderTags = () => {
		return tags.map((tag) => (
			<button
				key={tag.tag}
				className={`experience-tag ${activeTag === tag.tag ? 'active' : ''}`}
				onClick={() => handleTagClick(tag.tag)}
				id={tag.tag}
			>
				#{tag.tag} - ({tag.count})
			</button>
		));
	};

	return (
		<Structure
			LeftComponent={
				<>
					<button
						className="btn btn-primary"
						onClick={() => {
							setShowAddExperienceModal(true);
						}}
					>
						Add Experience
					</button>
					<div className="experience-filters">
						<button
							key={'All'}
							className={`experience-tag-all ${activeTag === 'All' ? 'active' : ''} `}
							onClick={() => handleTagClick('All')}
							id="All"
						>
							All Tags
						</button>
						{renderTags()}
					</div>
				</>
			}
			RightComponent={
				isLoading ? (
					<div style={{ textAlign: 'center', padding: '2rem' }}>
						<div className="loading-spinner">Loading experiences...</div>
					</div>
				) : error ? (
					<div style={{ textAlign: 'center', padding: '2rem', color: '#e53e3e' }}>
						<p>{error}</p>
						<button 
							onClick={fetchData}
							style={{ 
								marginTop: '1rem',
								padding: '0.5rem 1rem',
								background: '#667eea',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
						>
							Retry
						</button>
					</div>
				) : experiences.length === 0 ? (
					<div>No experiences to show.</div>
				) : (
					<>
						{experiences.map((experience) => (
							<div key={experience._id} className="experience-item">
							<div className="experience-header">
								<h3 className="experience-student-details">
									{experience.studentDetails.name} ({experience.studentDetails.batch})
								</h3>
								<div>{experience.createdAt}</div>
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
							<div className="experience-item-tags">
								{experience.tags.map((tag) => (
									<div key={tag} className="experience-item-tag">
										#{tag}
									</div>
								))}
							</div>
							<div className="experience-comments-count">
								{experience.Comments.length} <FaRegComment />
							</div>
						</div>
					))}
					</>
				)
			}
			ContainerComponent={
				<>
					{addExperienceModal()}
					{experienceViewModal()}
				</>
			}
		/>
	);
};

export default ExperienceFeed;
