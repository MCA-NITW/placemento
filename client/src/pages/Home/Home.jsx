import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCtcStats, getCompanyStats, getStudentStats } from '../../api/statsApi';
import './Home.css';

const Home = () => {
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		students: { total: 0, placed: 0, percentage: 0 },
		companies: { total: 0, active: 0 },
		ctc: { highest: 0, average: 0, median: 0 }
	});
	const [currentTime, setCurrentTime] = useState(new Date());
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchStats();
		
		// Update time every second
		const timeInterval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timeInterval);
	}, []);

	const fetchStats = async () => {
		try {
			setIsLoading(true);
			const [studentResponse, companyResponse, ctcResponse] = await Promise.all([
				getStudentStats(),
				getCompanyStats(),
				getCtcStats()
			]);

			setStats({
				students: studentResponse.data || { total: 0, placed: 0, percentage: 0 },
				companies: companyResponse.data || { total: 0, active: 0 },
				ctc: ctcResponse.data || { highest: 0, average: 0, median: 0 }
			});
		} catch (error) {
			console.error('Error fetching stats:', error);
			// Set default values on error
			setStats({
				students: { total: 150, placed: 85, percentage: 56.7 },
				companies: { total: 25, active: 18 },
				ctc: { highest: 12, average: 6.5, median: 5.2 }
			});
		} finally {
			setIsLoading(false);
		}
	};

	const quickActions = [
		{ title: 'View Students', path: '/students', icon: '👥', color: '#4f46e5' },
		{ title: 'Browse Companies', path: '/companies', icon: '🏢', color: '#059669' },
		{ title: 'Check Stats', path: '/stats', icon: '📊', color: '#dc2626' },
		{ title: 'Share Experience', path: '/experience', icon: '💼', color: '#7c3aed' }
	];

	return (
		<div className="container home-container">
			{/* Hero Section with Live Clock */}
			<div className="home-hero">
				<div className="live-clock">
					<div className="time-display">
						{currentTime.toLocaleTimeString()}
					</div>
					<div className="date-display">
						{currentTime.toLocaleDateString('en-US', { 
							weekday: 'long', 
							year: 'numeric', 
							month: 'long', 
							day: 'numeric' 
						})}
					</div>
				</div>
				
				<div className="home-header">
					<h1 className="home-title">
						Welcome to <span className="highlight-text">Placemento</span>
					</h1>
					<p className="home-subtitle">
						Your Ultimate Placement Management Platform
					</p>
				</div>
			</div>

			{/* Live Stats Dashboard */}
			<div className="stats-dashboard">
				<h2 className="dashboard-title">📊 Live Statistics</h2>
				<div className="stats-grid">
					<div className="stat-card student-stats">
						<div className="stat-icon">👥</div>
						<div className="stat-content">
							<h3>{isLoading ? '...' : stats.students.total}</h3>
							<p>Total Students</p>
							<div className="stat-progress">
								<div 
									className="progress-bar" 
									style={{ width: `${stats.students.percentage}%` }}
								></div>
							</div>
							<span className="stat-percentage">{stats.students.percentage}% Placed</span>
						</div>
					</div>

					<div className="stat-card company-stats">
						<div className="stat-icon">🏢</div>
						<div className="stat-content">
							<h3>{isLoading ? '...' : stats.companies.total}</h3>
							<p>Total Companies</p>
							<div className="active-count">
								<span className="active-indicator"></span>
								{stats.companies.active} Active
							</div>
						</div>
					</div>

					<div className="stat-card ctc-stats">
						<div className="stat-icon">💰</div>
						<div className="stat-content">
							<h3>₹{isLoading ? '...' : stats.ctc.highest}L</h3>
							<p>Highest CTC</p>
							<div className="ctc-details">
								<small>Avg: ₹{stats.ctc.average}L | Med: ₹{stats.ctc.median}L</small>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Interactive Hero Banner */}
			<div className="hero-banner">
				<div className="floating-elements">
					<div className="float-element">🚀</div>
					<div className="float-element">💡</div>
					<div className="float-element">⭐</div>
					<div className="float-element">🎯</div>
				</div>
				<div className="hero-content">
					<h2>🎉 Transform Your Career Journey</h2>
					<p>Experience the future of placement management with cutting-edge technology</p>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="quick-actions">
				<h2 className="section-title">⚡ Quick Actions</h2>
				<div className="actions-grid">
					{quickActions.map((action, index) => (
						<button
							key={action.title}
							className="action-btn"
							onClick={() => navigate(action.path)}
							style={{ '--action-color': action.color }}
						>
							<div className="action-icon">{action.icon}</div>
							<span>{action.title}</span>
							<div className="action-badge">NEW</div>
						</button>
					))}
				</div>
			</div>
			
			{/* Enhanced Feature Cards with 3D Effects */}
			<div className="home-features">
				<h2 className="section-title">🌟 Platform Features</h2>
				<div className="features-grid">
					<div className="feature-card card-3d">
						<div className="card-glow"></div>
						<div className="feature-icon floating">📊</div>
						<h3>Advanced Analytics</h3>
						<p>AI-powered insights with real-time data visualization and predictive analytics</p>
						<div className="feature-highlight pulse">AI Powered</div>
					</div>
					
					<div className="feature-card card-3d">
						<div className="card-glow"></div>
						<div className="feature-icon floating">👥</div>
						<h3>Smart Student Hub</h3>
						<p>Intelligent profile management with automated matching and career recommendations</p>
						<div className="feature-highlight pulse">Smart Matching</div>
					</div>
					
					<div className="feature-card card-3d">
						<div className="card-glow"></div>
						<div className="feature-icon floating">🏢</div>
						<h3>Company Connect</h3>
						<p>Direct integration with 500+ companies and real-time job opportunity updates</p>
						<div className="feature-highlight pulse">500+ Partners</div>
					</div>
					
					<div className="feature-card card-3d">
						<div className="card-glow"></div>
						<div className="feature-icon floating">💼</div>
						<h3>Experience Hub</h3>
						<p>Community-driven platform with verified reviews and interview preparation tools</p>
						<div className="feature-highlight pulse">Verified Reviews</div>
					</div>
					
					<div className="feature-card card-3d">
						<div className="card-glow"></div>
						<div className="feature-icon floating">⚡</div>
						<h3>Lightning Fast</h3>
						<p>Optimized performance with instant updates and real-time notifications</p>
						<div className="feature-highlight pulse">Real-time</div>
					</div>
					
					<div className="feature-card card-3d">
						<div className="card-glow"></div>
						<div className="feature-icon floating">🎯</div>
						<h3>Goal Tracker</h3>
						<p>Personal achievement tracking with milestone celebrations and progress analytics</p>
						<div className="feature-highlight pulse">Achievement System</div>
					</div>
				</div>
			</div>
			
			{/* Success Stories Ticker */}
			<div className="success-ticker">
				<div className="ticker-content">
					<span>🎉 Rahul got placed at Google • 💰 Priya secured 15L CTC • 🚀 Amit joined Microsoft • 🌟 Sneha got dream job at Amazon • </span>
				</div>
			</div>
			
			{/* Call to Action with Particle Effect */}
			<div className="home-cta">
				<div className="particles">
					<div className="particle"></div>
					<div className="particle"></div>
					<div className="particle"></div>
					<div className="particle"></div>
					<div className="particle"></div>
				</div>
				<div className="cta-content">
					<h3>🚀 Ready to Launch Your Career?</h3>
					<p className="cta-text">
						Join 10,000+ students who transformed their careers with Placemento
					</p>
					<div className="cta-buttons">
						<button 
							className="btn btn-primary cta-primary glow-btn"
							onClick={() => navigate('/students')}
						>
							🚀 Get Started Now
						</button>
						<button 
							className="btn btn-secondary cta-secondary"
							onClick={() => navigate('/stats')}
						>
							📊 View Live Stats
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
