import './Home.css';

const Home = () => {
	return (
		<div className="container home-container">
			<div className="home-header animate-fadeInDown">
				<h1 className="home-title">
					Welcome to <span className="highlight-text animate-gradient">Placemento</span>
				</h1>
				<p className="home-subtitle animate-fadeInUp animate-delay-300">
					Your Ultimate Placement Management Platform
				</p>
			</div>
			
			<div className="home-features animate-fadeIn animate-delay-500">
				<div className="feature-card hover-lift animate-fadeInLeft animate-delay-600">
					<div className="feature-icon animate-pulse">📊</div>
					<h3>Statistics</h3>
					<p>Track placement statistics and analytics</p>
				</div>
				
				<div className="feature-card hover-lift animate-fadeInUp animate-delay-700">
					<div className="feature-icon animate-bounce">👥</div>
					<h3>Students</h3>
					<p>Manage student profiles and data</p>
				</div>
				
				<div className="feature-card hover-lift animate-fadeInRight animate-delay-800">
					<div className="feature-icon animate-float">🏢</div>
					<h3>Companies</h3>
					<p>Connect with top recruiting companies</p>
				</div>
				
				<div className="feature-card hover-lift animate-fadeInLeft animate-delay-900">
					<div className="feature-icon animate-wiggle">💼</div>
					<h3>Experience</h3>
					<p>Share placement experiences and tips</p>
				</div>
				
				<div className="feature-card hover-lift animate-fadeInUp animate-delay-1000">
					<div className="feature-icon animate-glow">⚡</div>
					<h3>Teams</h3>
					<p>Meet our development team</p>
				</div>
				
				<div className="feature-card hover-lift animate-fadeInRight animate-delay-1000">
					<div className="feature-icon animate-pulse">👤</div>
					<h3>Profile</h3>
					<p>Manage your personal profile</p>
				</div>
			</div>
			
			<div className="home-cta animate-scaleIn animate-delay-1000">
				<p className="cta-text animate-fadeIn animate-delay-1200">
					Start your placement journey today!
				</p>
			</div>
		</div>
	);
};

export default Home;
