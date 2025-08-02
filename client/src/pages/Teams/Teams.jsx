import { useState } from 'react';
import './Teams.css';

const Teams = () => {
	const [teamMembers] = useState([
		{
			id: 1,
			name: 'Sagar Gupta',
			role: 'Lead Developer',
			email: 'sagar@student.nitw.ac.in',
			github: 'https://github.com/Sagargupta16',
			linkedin: 'https://linkedin.com/in/sagar-gupta',
			image: '/api/placeholder/150/150',
			skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'Full Stack Development'],
			contributions: ['Project Architecture', 'Frontend Development', 'Database Design', 'Authentication System']
		},
		{
			id: 2,
			name: 'Sachin Gupta',
			role: 'Full Stack Developer',
			email: 'sachin@student.nitw.ac.in',
			github: 'https://github.com/sachin-gupta99',
			linkedin: 'https://linkedin.com/in/sachin-gupta',
			image: '/api/placeholder/150/150',
			skills: ['React', 'Node.js', 'Express', 'JavaScript', 'API Development', 'UI/UX'],
			contributions: ['Backend Development', 'API Design', 'Frontend Components', 'Testing & Debugging']
		}
	]);

	const [stats] = useState({
		totalCommits: '200+',
		linesOfCode: '15,000+',
		features: '25+',
		bugsFixed: '50+'
	});

	return (
		<div className="container">
			<h1>Development Team</h1>
			
			<div className="teams-content">
				{/* Project Stats */}
				<section className="project-stats">
					<h2>Project Statistics</h2>
					<div className="stats-grid">
						<div className="stat-card">
							<div className="stat-number">{stats.totalCommits}</div>
							<div className="stat-label">Total Commits</div>
						</div>
						<div className="stat-card">
							<div className="stat-number">{stats.linesOfCode}</div>
							<div className="stat-label">Lines of Code</div>
						</div>
						<div className="stat-card">
							<div className="stat-number">{stats.features}</div>
							<div className="stat-label">Features Built</div>
						</div>
						<div className="stat-card">
							<div className="stat-number">{stats.bugsFixed}</div>
							<div className="stat-label">Bugs Fixed</div>
						</div>
					</div>
				</section>

				{/* Team Members */}
				<section className="team-members">
					<h2>Meet the Team</h2>
					<div className="members-grid">
						{teamMembers.map((member) => (
							<div key={member.id} className="member-card">
								<div className="member-image">
									<div className="placeholder-image">
										{member.name.split(' ').map(n => n[0]).join('')}
									</div>
								</div>
								<div className="member-info">
									<h3>{member.name}</h3>
									<p className="member-role">{member.role}</p>
									<p className="member-email">{member.email}</p>
									
									<div className="member-links">
										<a href={member.github} target="_blank" rel="noopener noreferrer" className="link-button">
											GitHub
										</a>
										<a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="link-button">
											LinkedIn
										</a>
									</div>

									<div className="member-skills">
										<h4>Skills</h4>
										<div className="skills-list">
											{member.skills.map((skill) => (
												<span key={skill} className="skill-tag">{skill}</span>
											))}
										</div>
									</div>

									<div className="member-contributions">
										<h4>Key Contributions</h4>
										<ul>
											{member.contributions.map((contribution) => (
												<li key={contribution}>{contribution}</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Technology Stack */}
				<section className="tech-stack">
					<h2>Technology Stack</h2>
					<div className="tech-categories">
						<div className="tech-category">
							<h3>Frontend</h3>
							<div className="tech-list">
								<span className="tech-item">React 18.2</span>
								<span className="tech-item">JavaScript ES6+</span>
								<span className="tech-item">CSS3</span>
								<span className="tech-item">React Router</span>
								<span className="tech-item">Axios</span>
								<span className="tech-item">AG Grid</span>
								<span className="tech-item">React Toastify</span>
								<span className="tech-item">React Icons</span>
							</div>
						</div>
						<div className="tech-category">
							<h3>Backend</h3>
							<div className="tech-list">
								<span className="tech-item">Node.js 20+</span>
								<span className="tech-item">Express.js</span>
								<span className="tech-item">MongoDB</span>
								<span className="tech-item">Mongoose</span>
								<span className="tech-item">JWT</span>
								<span className="tech-item">bcrypt</span>
								<span className="tech-item">Nodemailer</span>
								<span className="tech-item">Winston Logger</span>
							</div>
						</div>
						<div className="tech-category">
							<h3>Development Tools</h3>
							<div className="tech-list">
								<span className="tech-item">Git & GitHub</span>
								<span className="tech-item">VS Code</span>
								<span className="tech-item">Prettier</span>
								<span className="tech-item">Nodemon</span>
								<span className="tech-item">Concurrently</span>
								<span className="tech-item">npm</span>
							</div>
						</div>
					</div>
				</section>

				{/* Project Timeline */}
				<section className="project-timeline">
					<h2>Development Timeline</h2>
					<div className="timeline">
						<div className="timeline-item">
							<div className="timeline-marker"></div>
							<div className="timeline-content">
								<h4>Project Initialization</h4>
								<p>Set up MERN stack foundation, project structure, and basic authentication</p>
							</div>
						</div>
						<div className="timeline-item">
							<div className="timeline-marker"></div>
							<div className="timeline-content">
								<h4>User Management System</h4>
								<p>Implemented student registration, verification, and role-based access control</p>
							</div>
						</div>
						<div className="timeline-item">
							<div className="timeline-marker"></div>
							<div className="timeline-content">
								<h4>Company Management</h4>
								<p>Built company registration, placement tracking, and data management features</p>
							</div>
						</div>
						<div className="timeline-item">
							<div className="timeline-marker"></div>
							<div className="timeline-content">
								<h4>Analytics & Reporting</h4>
								<p>Added comprehensive statistics, filtering, and data visualization capabilities</p>
							</div>
						</div>
						<div className="timeline-item">
							<div className="timeline-marker"></div>
							<div className="timeline-content">
								<h4>Experience Sharing</h4>
								<p>Developed platform for students to share placement experiences and insights</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Teams;
