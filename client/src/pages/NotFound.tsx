import { useNavigate } from 'react-router-dom';

const NotFound = () => {
	const nav = useNavigate();
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 6rem)' }}>
			<div className="glass" style={{ padding: '3rem', textAlign: 'center', animation: 'fadeIn .4s ease' }}>
				<div
					style={{
						fontSize: '4.5rem',
						fontWeight: 800,
						color: 'var(--primary)',
						lineHeight: 1,
						background: 'linear-gradient(135deg,var(--primary),var(--accent))',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent'
					}}
				>
					404
				</div>
				<p style={{ color: 'var(--dim)', margin: '1rem 0 1.5rem' }}>Page not found</p>
				<button
					onClick={() => nav('/')}
					style={{
						padding: '.65rem 2rem',
						background: 'var(--primary)',
						color: '#fff',
						border: 'none',
						borderRadius: 'var(--r1)',
						fontWeight: 600,
						cursor: 'pointer'
					}}
				>
					Go Home
				</button>
			</div>
		</div>
	);
};
export default NotFound;
