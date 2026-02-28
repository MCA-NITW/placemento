import { FaGithub, FaLinkedin } from 'react-icons/fa';

const g = 'glass';
const chip: React.CSSProperties = {
	padding: '2px 8px',
	borderRadius: 14,
	fontSize: '.72rem',
	background: 'var(--primary-glow)',
	color: 'var(--text)'
};
const iconBtn: React.CSSProperties = {
	width: 34,
	height: 34,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 'var(--r1)',
	background: 'var(--bg3)',
	border: 'none',
	color: 'var(--dim)',
	cursor: 'pointer',
	fontSize: '1rem',
	transition: 'all .15s'
};

const members = [
	{
		name: 'Sagar Gupta',
		role: 'Lead Developer',
		commits: 124,
		skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
		gh: 'https://github.com/sagargupta35',
		li: 'https://linkedin.com/in/sagargupta35'
	},
	{
		name: 'Sachin Gupta',
		role: 'Contributor',
		commits: 3,
		skills: ['React', 'CSS'],
		gh: 'https://github.com/sachin-gupta99',
		li: 'https://linkedin.com/in/sachin-gupta99'
	}
];
const stack = [
	{ cat: 'Frontend', items: ['React 19', 'TypeScript', 'Vite', 'Recharts'] },
	{ cat: 'Backend', items: ['Node.js', 'Express 5', 'MongoDB', 'JWT', 'Nodemailer'] },
	{ cat: 'Tools', items: ['pnpm', 'GitHub Actions', 'Prettier', 'Vitest'] }
];

const Teams = () => (
	<div style={{ maxWidth: 760, margin: '0 auto', animation: 'fadeIn .4s ease' }}>
		<h2 style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '.8rem' }}>Team</h2>
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '.75rem', marginBottom: '1.5rem' }}>
			{members.map((m) => (
				<div key={m.name} className={g} style={{ padding: '1.4rem' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem' }}>
						<div
							style={{
								width: 46,
								height: 46,
								borderRadius: '50%',
								background: 'linear-gradient(135deg,var(--primary),var(--accent))',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1.1rem',
								fontWeight: 700,
								color: '#fff',
								flexShrink: 0
							}}
						>
							{m.name
								.split(' ')
								.map((w) => w[0])
								.join('')}
						</div>
						<div>
							<div style={{ fontWeight: 600, fontSize: '1rem' }}>{m.name}</div>
							<div style={{ fontSize: '.78rem', color: 'var(--dim)' }}>
								{m.role} · {m.commits} commits
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', marginBottom: '1rem' }}>
						{m.skills.map((s) => (
							<span key={s} style={chip}>
								{s}
							</span>
						))}
					</div>
					<div style={{ display: 'flex', gap: '.4rem' }}>
						<a href={m.gh} target="_blank" rel="noreferrer">
							<button
								style={iconBtn}
								onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
								onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--dim)')}
							>
								<FaGithub />
							</button>
						</a>
						<a href={m.li} target="_blank" rel="noreferrer">
							<button
								style={iconBtn}
								onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
								onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--dim)')}
							>
								<FaLinkedin />
							</button>
						</a>
					</div>
				</div>
			))}
		</div>
		<h3 style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: 600, marginBottom: '.6rem' }}>Tech Stack</h3>
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '.6rem' }}>
			{stack.map((t) => (
				<div key={t.cat} className={g} style={{ padding: '1.2rem' }}>
					<div style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: '.4rem', fontSize: '.85rem' }}>{t.cat}</div>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
						{t.items.map((i) => (
							<span key={i} style={chip}>
								{i}
							</span>
						))}
					</div>
				</div>
			))}
		</div>
	</div>
);

export default Teams;
