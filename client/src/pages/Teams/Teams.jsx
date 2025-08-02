import React from 'react';
import './Teams.css';

const Teams = () => {
	// Team members data
	const teamMembers = [
		{
			id: 1,
			name: "Abhishek Bandiwadekar",
			role: "Frontend Developer & Project Lead",
			email: "abhishek@mcanitw.ac.in",
			github: "https://github.com/abhishek",
			linkedin: "https://linkedin.com/in/abhishek",
			experience: "3+ Years",
			motto: "Clean code is simple and direct",
			skills: ["React", "JavaScript", "CSS3", "UI/UX Design", "Node.js", "MongoDB", "Git"],
			contributions: [
				"Led frontend architecture and component design",
				"Implemented responsive UI with modern CSS3",
				"Built comprehensive authentication system",
				"Designed user-friendly interface components",
				"Coordinated team collaboration and project delivery"
			]
		},
		{
			id: 2,
			name: "Priya Sharma",
			role: "Backend Developer & Database Architect",
			email: "priya@mcanitw.ac.in",
			github: "https://github.com/priya",
			linkedin: "https://linkedin.com/in/priya",
			experience: "2+ Years",
			motto: "Efficient code is beautiful code",
			skills: ["Node.js", "Express", "MongoDB", "API Design", "JWT", "Database Design", "Testing"],
			contributions: [
				"Designed and implemented RESTful APIs",
				"Built secure authentication with JWT",
				"Optimized database schema and queries",
				"Implemented email verification system",
				"Created comprehensive error handling"
			]
		},
		{
			id: 3,
			name: "Raj Patel",
			role: "Full Stack Developer & DevOps",
			email: "raj@mcanitw.ac.in",
			github: "https://github.com/raj",
			linkedin: "https://linkedin.com/in/raj",
			experience: "2+ Years",
			motto: "Automation makes everything better",
			skills: ["React", "Node.js", "DevOps", "Git", "Deployment", "Testing", "Documentation"],
			contributions: [
				"Set up development and deployment pipeline",
				"Implemented student and company management",
				"Built advanced filtering and search features",
				"Created comprehensive documentation",
				"Ensured code quality and testing standards"
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
		features: "25+",
		bugsFixed: "100+"
	};

	return (
		<div className="teams-page">
			<div className="teams-container">
				{/* Enhanced Hero Section */}
				<section className="hero-section">
					<div className="hero-content">
						<div className="hero-badge">
							<span className="badge-icon">🎓</span>
							<span className="badge-text">MCA NIT Warangal</span>
						</div>
						<h1 className="hero-title">
							Meet the <span className="title-highlight">Development Team</span>
						</h1>
						<p className="hero-subtitle">
							Passionate MCA students who built this comprehensive placement management system 
							from the ground up, combining innovation with practical solutions.
						</p>
						<div className="hero-stats">
							<div className="hero-stat">
								<span className="stat-number">{stats.teamMembers}</span>
								<span className="stat-label">Developers</span>
							</div>
							<div className="hero-stat">
								<span className="stat-number">{stats.features}</span>
								<span className="stat-label">Features</span>
							</div>
							<div className="hero-stat">
								<span className="stat-number">{stats.linesOfCode}</span>
								<span className="stat-label">Lines of Code</span>
							</div>
						</div>
					</div>
					<div className="hero-background">
						<div className="bg-pattern"></div>
					</div>
				</section>

				{/* Enhanced Project Overview */}
				<section className="project-overview">
					<div className="section-header">
						<h2>Project Overview</h2>
						<p>A comprehensive solution for placement management at NIT Warangal</p>
					</div>
					<div className="overview-content">
						<div className="overview-text">
							<div className="feature-highlight">
								<h3>🎯 Our Mission</h3>
								<p>To create a seamless, efficient, and user-friendly platform that streamlines the entire placement process for students, companies, and administrators at NIT Warangal.</p>
							</div>
							<div className="feature-highlight">
								<h3>💡 Key Innovation</h3>
								<p>Combining modern web technologies with intuitive design to deliver a robust system that handles everything from student registration to placement analytics.</p>
							</div>
						</div>
						<div className="overview-stats">
							<div className="stat-card">
								<div className="stat-number">{stats.teamMembers}</div>
								<div className="stat-label">Team Members</div>
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
					</div>
				</section>

				{/* Enhanced Team Members */}
				<section className="team-members">
					<div className="section-header">
						<h2>Meet the Team</h2>
						<p>The brilliant minds who brought this project to life</p>
					</div>
					<div className="members-grid">
						{teamMembers.map((member) => (
							<div key={member.id} className="member-card">
								<div className="member-header">
									<div className="member-avatar">
										<div className="avatar-image">
											{member.name.split(' ').map(n => n[0]).join('')}
										</div>
										<div className="avatar-status"></div>
									</div>
									<div className="member-basic-info">
										<h3 className="member-name">{member.name}</h3>
										<p className="member-role">{member.role}</p>
										<p className="member-experience">{member.experience} Experience</p>
										<p className="member-motto">"{member.motto}"</p>
									</div>
								</div>

								<div className="member-contact">
									<div className="contact-info">
										<span className="contact-email">📧 {member.email}</span>
									</div>
									<div className="social-links">
										<a href={member.github} target="_blank" rel="noopener noreferrer" className="social-link github">
											<span className="link-icon">🐙</span>
											GitHub
										</a>
										<a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
											<span className="link-icon">💼</span>
											LinkedIn
										</a>
									</div>
								</div>

								<div className="member-details">
									<div className="member-skills">
										<h4>💡 Technical Skills</h4>
										<div className="skills-grid">
											{member.skills.map((skill, index) => (
												<span key={skill} className={`skill-badge skill-${index % 4}`}>{skill}</span>
											))}
										</div>
									</div>

									<div className="member-contributions">
										<h4>🎯 Key Contributions</h4>
										<ul className="contributions-list">
											{member.contributions.map((contribution, index) => (
												<li key={contribution} className="contribution-item">
													<span className="contribution-marker">{index + 1}</span>
													{contribution}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Enhanced Technology Stack */}
				<section className="tech-stack">
					<div className="section-header">
						<h2>Technology Stack</h2>
						<p>Modern technologies powering our placement management system</p>
					</div>
					<div className="tech-categories">
						{Object.entries(techStack).map(([category, technologies]) => (
							<div key={category} className="tech-category">
								<div className="category-header">
									<h3 className="category-title">
										{category === 'frontend' && '🎨 Frontend'}
										{category === 'backend' && '⚙️ Backend'}
										{category === 'tools' && '🛠️ Development Tools'}
									</h3>
								</div>
								<div className="tech-grid">
									{technologies.map((tech) => (
										<div key={tech.name} className="tech-item">
											<span className="tech-icon">{tech.icon}</span>
											<div className="tech-info">
												<span className="tech-name">{tech.name}</span>
												<span className="tech-version">{tech.version}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Enhanced Project Timeline */}
				<section className="project-timeline">
					<div className="section-header">
						<h2>Development Journey</h2>
						<p>Our step-by-step approach to building the complete system</p>
					</div>
					<div className="timeline-container">
						<div className="timeline">
							<div className="timeline-item">
								<div className="timeline-marker">
									<span className="marker-icon">🚀</span>
								</div>
								<div className="timeline-content">
									<div className="timeline-header">
										<h4>Project Initialization</h4>
										<span className="timeline-phase">Phase 1</span>
									</div>
									<p>Set up MERN stack foundation, project structure, and basic authentication system with modern development practices.</p>
									<div className="timeline-tech">
										<span>React</span>
										<span>Node.js</span>
										<span>MongoDB</span>
									</div>
								</div>
							</div>
							<div className="timeline-item">
								<div className="timeline-marker">
									<span className="marker-icon">👥</span>
								</div>
								<div className="timeline-content">
									<div className="timeline-header">
										<h4>User Management System</h4>
										<span className="timeline-phase">Phase 2</span>
									</div>
									<p>Implemented comprehensive student registration, email verification, and role-based access control with JWT authentication.</p>
									<div className="timeline-tech">
										<span>JWT</span>
										<span>Nodemailer</span>
										<span>bcrypt</span>
									</div>
								</div>
							</div>
							<div className="timeline-item">
								<div className="timeline-marker">
									<span className="marker-icon">🏢</span>
								</div>
								<div className="timeline-content">
									<div className="timeline-header">
										<h4>Company & Placement Management</h4>
										<span className="timeline-phase">Phase 3</span>
									</div>
									<p>Built robust company registration, placement tracking, and comprehensive data management with advanced filtering capabilities.</p>
									<div className="timeline-tech">
										<span>AG Grid</span>
										<span>Express</span>
										<span>Mongoose</span>
									</div>
								</div>
							</div>
							<div className="timeline-item">
								<div className="timeline-marker">
									<span className="marker-icon">📊</span>
								</div>
								<div className="timeline-content">
									<div className="timeline-header">
										<h4>Analytics & Reporting</h4>
										<span className="timeline-phase">Phase 4</span>
									</div>
									<p>Added comprehensive statistics dashboard, data visualization, and detailed reporting features for placement insights.</p>
									<div className="timeline-tech">
										<span>Charts</span>
										<span>Analytics</span>
										<span>Aggregation</span>
									</div>
								</div>
							</div>
							<div className="timeline-item">
								<div className="timeline-marker">
									<span className="marker-icon">💬</span>
								</div>
								<div className="timeline-content">
									<div className="timeline-header">
										<h4>Experience Sharing Platform</h4>
										<span className="timeline-phase">Phase 5</span>
									</div>
									<p>Developed an interactive platform for students to share placement experiences, interview tips, and rating system.</p>
									<div className="timeline-tech">
										<span>Reviews</span>
										<span>Ratings</span>
										<span>Social Features</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Project Highlights */}
				<section className="project-highlights">
					<div className="section-header">
						<h2>Project Highlights</h2>
						<p>What makes our placement management system special</p>
					</div>
					<div className="highlights-grid">
						<div className="highlight-card">
							<div className="highlight-icon">🔐</div>
							<h4>Secure Authentication</h4>
							<p>JWT-based authentication with email verification and role-based access control ensuring data security.</p>
						</div>
						<div className="highlight-card">
							<div className="highlight-icon">📱</div>
							<h4>Responsive Design</h4>
							<p>Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices.</p>
						</div>
						<div className="highlight-card">
							<div className="highlight-icon">⚡</div>
							<h4>Real-time Updates</h4>
							<p>Live data synchronization and instant notifications for placement activities and updates.</p>
						</div>
						<div className="highlight-card">
							<div className="highlight-icon">📈</div>
							<h4>Advanced Analytics</h4>
							<p>Comprehensive dashboard with detailed statistics, trends, and insights for informed decision making.</p>
						</div>
						<div className="highlight-card">
							<div className="highlight-icon">🎯</div>
							<h4>User-Centric Design</h4>
							<p>Intuitive interface designed with student and admin needs in mind for optimal user experience.</p>
						</div>
						<div className="highlight-card">
							<div className="highlight-icon">🔄</div>
							<h4>Scalable Architecture</h4>
							<p>Built with modern MERN stack ensuring scalability and maintainability for future enhancements.</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Teams;
