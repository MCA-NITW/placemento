import { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getCompanyStats, getCtcStats, getStudentStats } from '../api/statsApi';

const g = 'glass';

const Home = () => {
	const nav = useNavigate();
	const [stats, setStats] = useState<any>(null);
	const [err, setErr] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const [s, c, t] = await Promise.all([getStudentStats(), getCompanyStats(), getCtcStats()]);
				setStats({ s: s.data, c: c.data, t: t.data });
			} catch {
				setErr(true);
			}
		})();
	}, []);

	const actions = [
		{ label: 'Students', path: '/students', desc: 'Browse student profiles and placement status' },
		{ label: 'Companies', path: '/companies', desc: 'View visiting companies with CTC and cutoffs' },
		{ label: 'Statistics', path: '/stats', desc: 'Detailed placement analytics and charts' },
		{ label: 'Experiences', path: '/experience', desc: 'Read and share interview experiences' }
	];

	return (
		<div style={{ maxWidth: 960, margin: '0 auto', animation: 'fadeIn .5s ease' }}>
			{/* Hero */}
			<div style={{ textAlign: 'center', padding: '3rem 0 2.5rem' }}>
				<h1
					style={{
						fontSize: 'clamp(2.4rem,6vw,3.5rem)',
						fontWeight: 800,
						lineHeight: 1.1,
						background: 'linear-gradient(135deg,var(--primary),var(--accent))',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text'
					}}
				>
					Placemento
				</h1>
				<p style={{ color: 'var(--dim)', fontSize: '1.05rem', marginTop: '.5rem', fontWeight: 300 }}>MCA NIT Warangal — Placement Portal</p>
			</div>

			{/* Stats */}
			{err ? (
				<div className={g} style={{ textAlign: 'center', padding: '2rem', marginBottom: '2rem' }}>
					<p style={{ color: 'var(--dim)', marginBottom: '1rem' }}>Sign in to view placement statistics</p>
					<button
						onClick={() => nav('/auth?mode=signin')}
						style={{
							padding: '.6rem 1.5rem',
							background: 'var(--primary)',
							color: '#fff',
							border: 'none',
							borderRadius: 'var(--r1)',
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						Sign In
					</button>
				</div>
			) : (
				stats && (
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '.75rem', marginBottom: '2rem' }}>
						{[
							{
								v: stats.s.totalPlacedStudents + '/' + stats.s.totalEligibleStudents,
								l: 'Students Placed',
								sub: stats.s.placementPercentage + '%',
								color: 'var(--success)'
							},
							{ v: stats.c.totalCompanies, l: 'Companies', sub: stats.c.totalSoftwareCompanies + ' software', color: 'var(--accent)' },
							{ v: stats.t.highestCTCOffered + 'L', l: 'Highest CTC', sub: 'Avg ' + Number(stats.t.avgCTC).toFixed(1) + 'L', color: 'var(--primary)' }
						].map((s) => (
							<div key={s.l} className={g} style={{ padding: '1.4rem', position: 'relative', overflow: 'hidden' }}>
								<div
									style={{
										position: 'absolute',
										top: 0,
										right: 0,
										width: 60,
										height: 60,
										background: s.color,
										opacity: 0.08,
										borderRadius: '0 0 0 60px'
									}}
								/>
								<div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.v}</div>
								<div style={{ fontWeight: 600, fontSize: '.9rem', marginTop: 2 }}>{s.l}</div>
								<div style={{ fontSize: '.8rem', color: 'var(--dim)', marginTop: 2 }}>{s.sub}</div>
							</div>
						))}
					</div>
				)
			)}

			{/* Actions */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '.75rem', marginBottom: '2rem' }}>
				{actions.map((a) => (
					<button
						key={a.label}
						onClick={() => nav(a.path)}
						className={g}
						style={{
							padding: '1.3rem',
							textAlign: 'left',
							cursor: 'pointer',
							transition: 'all .2s',
							fontFamily: 'inherit',
							color: 'var(--text)',
							display: 'flex',
							flexDirection: 'column',
							gap: '.4rem'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.borderColor = 'var(--primary)';
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.borderColor = 'var(--border)';
							e.currentTarget.style.transform = 'none';
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span style={{ fontWeight: 600, fontSize: '1rem' }}>{a.label}</span>
							<FiArrowRight style={{ color: 'var(--primary)' }} />
						</div>
						<span style={{ fontSize: '.82rem', color: 'var(--dim)', lineHeight: 1.4 }}>{a.desc}</span>
					</button>
				))}
			</div>

			{/* CTA */}
			<div className={g} style={{ textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'radial-gradient(ellipse at 50% 0%,var(--primary-glow),transparent 70%)',
						pointerEvents: 'none'
					}}
				/>
				<h3 style={{ color: 'var(--text)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '.4rem', position: 'relative' }}>Get Started</h3>
				<p style={{ color: 'var(--dim)', marginBottom: '1.2rem', position: 'relative' }}>Sign in with your NITW student email</p>
				<div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
					<button
						onClick={() => nav('/auth?mode=signin')}
						style={{
							padding: '.65rem 1.6rem',
							background: 'var(--primary)',
							color: '#fff',
							border: 'none',
							borderRadius: 'var(--r1)',
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						Sign In
					</button>
					<button
						onClick={() => nav('/stats')}
						style={{
							padding: '.65rem 1.6rem',
							background: 'transparent',
							color: 'var(--primary)',
							border: '1px solid var(--primary)',
							borderRadius: 'var(--r1)',
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						View Stats
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;
