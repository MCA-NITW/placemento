import { useMemo, useState } from 'react';
import { BiStats } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { FaHome, FaSignInAlt, FaUsers } from 'react-icons/fa';
import { GiStarSwirl } from 'react-icons/gi';
import { GoOrganization } from 'react-icons/go';
import { PiSignOutBold } from 'react-icons/pi';
import { RiTeamFill } from 'react-icons/ri';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../Modal/Modal';
import classes from './Navbar.module.css';

const NavBar = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout } = useAuth();

	// Memoize nav items calculation - only recalculate when isAuthenticated changes
	const navItems = useMemo(() => {
		const fixedItems = [
			{
				to: '/',
				label: 'Home',
				icon: <FaHome />
			},
			{
				to: 'stats',
				label: 'Stats',
				icon: <BiStats />
			},
			{
				to: 'teams',
				label: 'Teams',
				icon: <RiTeamFill />
			}
		];

		if (isAuthenticated) {
			return [
				...fixedItems,
				{
					to: 'students',
					label: 'Students',
					icon: <FaUsers />
				},
				{
					to: 'companies',
					label: 'Companies',
					icon: <GoOrganization />
				},
				{
					to: 'experience',
					label: 'Experience',
					icon: <GiStarSwirl />
				},
				{
					to: 'profile',
					label: 'Profile',
					icon: <CgProfile />
				}
			];
		}

		return [
			...fixedItems,
			{
				to: 'auth?mode=signin',
				label: 'Auth',
				icon: <FaSignInAlt />
			}
		];
	}, [isAuthenticated]);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const onSignOutClick = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const onConfirmSignOut = () => {
		logout();
		navigate('/');
		closeModal();
	};

	return (
		<>
			<nav className={classes.nav}>
				<NavLink to="/" aria-label="Home" className={classes['nav__logo']}>
					<span>Placemento</span>
				</NavLink>
				<div className={classes['nav__list']}>
					{navItems.map((item) => (
						<NavLink to={item.to} className={({ isActive }) => (isActive ? classes.active : undefined)} aria-label={item.label} key={item.to}>
							{item.icon}
						</NavLink>
					))}
					{isAuthenticated && (
						<button className={classes['nav__signout']} aria-label="Sign Out" onClick={onSignOutClick}>
							<PiSignOutBold />
						</button>
					)}
					<Modal
						isOpen={isModalOpen}
						onClose={closeModal}
						onConfirm={onConfirmSignOut}
						message="Are you sure you want to sign out?"
						buttonTitle="Sign Out"
					/>
				</div>
			</nav>
			<Outlet />
		</>
	);
};

export default NavBar;
