import ExperienceFeed from '../../components/Experience/ExperienceFeed';
import './Experience.css';

const Experience = () => {
	return (
		<div className="container page-container">
			<div className="page-header animate-fadeInDown">
				<h1 className="page-title">
					<span className="title-icon animate-wiggle">💼</span>
					Experience
					<div className="title-underline"></div>
				</h1>
				<p className="page-subtitle animate-fadeInUp animate-delay-300">
					Share and explore placement experiences, tips, and interview insights
				</p>
			</div>
			
			<div className="page-content animate-fadeInUp animate-delay-500">
				<ExperienceFeed />
			</div>
		</div>
	);
};

export default Experience;
