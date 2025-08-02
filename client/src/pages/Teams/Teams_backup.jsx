import React, { useState } from 'react';
import './Teams.css';

const Teams = () => {
	// State for handling collapsible contributions
	const [expandedContributions, setExpandedContributions] = useState({});

	// Toggle function for contributions
	const toggleContributions = (memberId) => {
		setExpandedContributions(prev => ({
			...prev,
			[memberId]: !prev[memberId]
		}));
	};

	// Team members data - Real contributors to the project
	const teamMembers = [
		{
			id: 1,
			name: "Sagar Gupta",
			role: "Lead Developer & Project Architect",
			email: "sg85207@gmail.com",
			github: "https://github.com/Sagargupta16",
			linkedin: "https://linkedin.com/in/sagar-gupta",
			motto: "Building scalable solutions with clean architecture",
			commits: 124,
			skills: ["React", "Node.js", "MongoDB", "Express.js", "JWT", "API Design", "System Architecture", "Database Design"],
			projectContributions: [
				"Led the entire project architecture and development",
				"Implemented complete MERN stack infrastructure",
				"Built comprehensive authentication system with JWT",
				"Designed and developed all major features and components",
				"Created responsive UI/UX with modern React patterns",
				"Established database schema and API endpoints",
				"Implemented security measures and best practices"
			]
		},
		{
			id: 2,
			name: "Sachin Gupta", 
			role: "Full Stack Developer & Contributor",
			email: "sachin.gupta.2j99@gmail.com",
			github: "https://github.com/sachin-gupta99",
			linkedin: "https://linkedin.com/in/sachin-gupta",
			motto: "Contributing to robust and efficient solutions",
			commits: 3,
			skills: ["JavaScript", "React", "Node.js", "MongoDB", "Git", "Frontend Development", "Backend APIs"],
			projectContributions: [
				"Contributed to frontend component development",
				"Assisted in backend API implementation", 
				"Participated in code reviews and testing",
				"Helped with bug fixes and feature enhancements"
			]
		}
	];

	// Technology stack data
	const techStack = {
		frontend: [
			{ name: "React", version: "18.2", icon: "⚛️" },
			{ name: "JavaScript", version: "ES6+", icon: "🟨" },
			{ name: "CSS3", version: "Latest", icon: "🎨" },
			{ name: "React Router", version: "6.x", icon: "🛣️" },
			{ name: "Axios", version: "1.x", icon: "🌐" },
			{ name: "AG Grid", version: "30.x", icon: "📊" }
		],
		backend: [
			{ name: "Node.js", version: "20.x", icon: "🟢" },
			{ name: "Express", version: "4.x", icon: "🚂" },
			{ name: "MongoDB", version: "7.x", icon: "🍃" },
			{ name: "Mongoose", version: "8.x", icon: "🏗️" },
			{ name: "JWT", version: "9.x", icon: "🔐" },
			{ name: "Nodemailer", version: "6.x", icon: "📧" }
		],
		tools: [
			{ name: "Git", version: "Latest", icon: "📝" },
			{ name: "VS Code", version: "Latest", icon: "💻" },
			{ name: "npm", version: "10.x", icon: "📦" },
			{ name: "Prettier", version: "3.x", icon: "✨" },
			{ name: "Nodemon", version: "3.x", icon: "🔄" },
			{ name: "Winston", version: "3.x", icon: "📋" }
		]
	};

	// Project statistics
	const stats = {
		teamMembers: teamMembers.length,
		linesOfCode: "10,000+",
		totalCommits: "127",
		features: "25+"
	};

	return (
		<div className="teams-page">
			<div className="teams-container">
				{/* Enhanced Hero Section */}
				<section className="hero-section animate-fadeInUp">
					<div className="hero-content">
						<div className="hero-badge animate-scaleIn animate-delay-200">
							<span className="badge-icon">🎓</span>
							<span className="badge-text">MCA NIT Warangal</span>
						</div>
						<h1 className="hero-title animate-fadeInDown animate-delay-300">
							Meet the <span className="title-highlight">Development Team</span>
						</h1>
						<p className="hero-subtitle animate-fadeInUp animate-delay-400">
							Passionate MCA students who built this comprehensive placement management system 
							from the ground up, combining innovation with practical solutions.
						</p>
						<div className="hero-stats animate-fadeInUp animate-delay-500">
							<div className="stat-item">
								<span className="stat-number">{stats.teamMembers}</span>
								<span className="stat-label">Team Members</span>
							</div>
							<div className="stat-item">
								<span className="stat-number">{stats.totalCommits}</span>
								<span className="stat-label">Total Commits</span>
							</div>
							<div className="stat-item">
								<span className="stat-number">{stats.linesOfCode}</span>
								<span className="stat-label">Lines of Code</span>
							</div>
						</div>
					</div>
				</section>

				{/* Team Members Section */}
				<section className="team-members animate-fadeInUp animate-delay-600">
					<div className="section-header">
						<h2 className="section-title">Our Team</h2>
						<p className="section-subtitle">
							Meet the talented individuals behind Placemento
						</p>
					</div>

					{/* Team member cards with animations */}
					<div className="team-grid">
						{teamMembers.map((member, index) => (
							<div 
								key={member.id} 
								className={`team-card animate-slideInUp animate-delay-${700 + (index * 100)}`}
							>
								<div className="member-avatar">
									<div className="avatar-placeholder">
										{member.name.split(' ').map(n => n[0]).join('')}
									</div>
									<div className="member-status online"></div>
								</div>
								<div className="member-info">
									<h3 className="member-name">{member.name}</h3>
									<p className="member-role">{member.role}</p>
									<p className="member-motto">"{member.motto}"</p>
									<div className="member-stats">
										<span className="commits-badge">
											{member.commits} commits
										</span>
									</div>
								</div>
								<div className="member-skills">
									{member.skills.slice(0, 3).map((skill, idx) => (
										<span key={idx} className="skill-tag">{skill}</span>
									))}
									{member.skills.length > 3 && (
										<span className="skill-tag more">+{member.skills.length - 3}</span>
									)}
								</div>
								<div className="member-actions">
									<a href={member.github} className="action-btn github" target="_blank" rel="noopener noreferrer">
										GitHub
									</a>
									<a href={member.linkedin} className="action-btn linkedin" target="_blank" rel="noopener noreferrer">
										LinkedIn
									</a>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Technology Stack */}
				<section className="tech-stack animate-fadeInUp animate-delay-800">
					<div className="section-header">
						<h2 className="section-title">Technology Stack</h2>
						<p className="section-subtitle">
							Modern technologies powering our platform
						</p>
					</div>
					<div className="tech-categories">
						{Object.entries(techStack).map(([category, technologies], categoryIndex) => (
							<div 
								key={category} 
								className={`tech-category animate-slideInUp animate-delay-${900 + (categoryIndex * 100)}`}
							>
								<h3 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
								<div className="tech-grid">
									{technologies.map((tech, techIndex) => (
										<div 
											key={tech.name} 
											className={`tech-item animate-scaleIn animate-delay-${1000 + (categoryIndex * 100) + (techIndex * 50)}`}
										>
											<span className="tech-icon">{tech.icon}</span>
											<span className="tech-name">{tech.name}</span>
											<span className="tech-version">{tech.version}</span>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Project Highlights */}
				<section className="project-highlights animate-fadeInUp animate-delay-1200">
					<div className="section-header">
						<h2 className="section-title">Project Highlights</h2>
						<p className="section-subtitle">What makes our placement management system special</p>
					</div>
					<div className="highlights-grid">
						{[
							{
								icon: "🔐",
								title: "Secure Authentication",
								description: "JWT-based authentication with email verification and role-based access control ensuring data security."
							},
							{
								icon: "📱",
								title: "Responsive Design", 
								description: "Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices."
							},
							{
								icon: "⚡",
								title: "Real-time Updates",
								description: "Live data synchronization and instant notifications for placement activities and updates."
							},
							{
								icon: "📈",
								title: "Advanced Analytics",
								description: "Comprehensive dashboard with detailed statistics, trends, and insights for informed decision making."
							},
							{
								icon: "🎯",
								title: "User-Centric Design",
								description: "Intuitive interface designed with student and admin needs in mind for optimal user experience."
							},
							{
								icon: "🔄",
								title: "Scalable Architecture",
								description: "Built with modern MERN stack ensuring scalability and maintainability for future enhancements."
							}
						].map((highlight, index) => (
							<div 
								key={highlight.title} 
								className={`highlight-card animate-slideInUp animate-delay-${1300 + (index * 100)}`}
							>
								<div className="highlight-icon">{highlight.icon}</div>
								<h4>{highlight.title}</h4>
								<p>{highlight.description}</p>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default Teams;
