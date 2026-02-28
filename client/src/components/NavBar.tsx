import { type ReactNode, useEffect, useState } from 'react';
import { BiStats } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { FaHome, FaSignInAlt, FaUsers } from 'react-icons/fa';
import { GiStarSwirl } from 'react-icons/gi';
import { GoOrganization } from 'react-icons/go';
import { PiSignOutBold } from 'react-icons/pi';
import { RiTeamFill } from 'react-icons/ri';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { checkToken } from '../api/tokenCheckApi';
import Modal from './Modal';

interface NavItem {
	to: string;
	label: string;
	icon: ReactNode;
}

const s = {
	nav: {
		position: 'fixed' as const,
		top: 0,
		left: 0,
		right: 0,
		height: '3.5rem',
		margin: '0.6rem',
		borderRadius: 'var(--r3)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '0 1.2rem',
		background: 'rgba(6,6,12,.8)',
		backdropFilter: 'blur(24px)',
		border: '1px solid var(--border)',
		zIndex: 50
	},
	logo: {
		fontSize: '1.2rem',
		fontWeight: 700,
		color: 'var(--primary)',
		background: 'linear-gradient(135deg,var(--primary),var(--accent))',
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		backgroundClip: 'text'
	} as React.CSSProperties,
	list: { display: 'flex', alignItems: 'center', gap: '0.35rem' },
	link: {
		width: 36,
		height: 36,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 'var(--r1)',
		fontSize: '1.1rem',
		color: 'var(--dim)',
		background: 'transparent',
		border: 'none',
		transition: 'all .2s'
	} as React.CSSProperties,
	active: { color: 'var(--primary)', background: 'var(--primary-glow)' }
};

const NavBar = () => {
	const [items, setItems] = useState<NavItem[]>([]);
	const [authed, setAuthed] = useState(false);
	const [modal, setModal] = useState(false);
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (token) {
			checkToken()
				.then((r) => setAuthed(r.data.isAuthenticated))
				.catch(() => {
					localStorage.removeItem('token');
					setAuthed(false);
				});
		} else setAuthed(false);
	}, [token]);

	useEffect(() => {
		const base: NavItem[] = [
			{ to: '/', label: 'Home', icon: <FaHome /> },
			{ to: '/stats', label: 'Stats', icon: <BiStats /> },
			{ to: '/teams', label: 'Teams', icon: <RiTeamFill /> }
		];
		setAuthed((a) => {
			if (a)
				setItems([
					...base,
					{ to: '/students', label: 'Students', icon: <FaUsers /> },
					{ to: '/companies', label: 'Companies', icon: <GoOrganization /> },
					{ to: '/experience', label: 'Experience', icon: <GiStarSwirl /> },
					{ to: '/profile', label: 'Profile', icon: <CgProfile /> }
				]);
			else setItems([...base, { to: '/auth?mode=signin', label: 'Sign In', icon: <FaSignInAlt /> }]);
			return a;
		});
	}, [authed]);

	return (
		<>
			<nav style={s.nav}>
				<NavLink to="/" style={s.logo}>
					Placemento
				</NavLink>
				<div style={s.list}>
					{items.map((item) => (
						<NavLink key={item.to} to={item.to} title={item.label} style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}>
							{item.icon}
						</NavLink>
					))}
					{authed && (
						<button onClick={() => setModal(true)} title="Sign Out" style={s.link}>
							<PiSignOutBold />
						</button>
					)}
				</div>
			</nav>
			<div style={{ paddingTop: '4.8rem', minHeight: '100vh', padding: '4.8rem 1rem 2rem' }}>
				<Outlet />
			</div>
			<Modal
				open={modal}
				onClose={() => setModal(false)}
				onConfirm={() => {
					localStorage.removeItem('token');
					navigate('/');
					setModal(false);
				}}
				title="Sign Out"
				message="Are you sure you want to sign out?"
				confirmText="Sign Out"
			/>
		</>
	);
};

export default NavBar;
