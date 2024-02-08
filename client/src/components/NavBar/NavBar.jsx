import axios from 'axios';
import { useEffect, useState } from 'react';
import { BiStats } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { FaHome, FaSignInAlt, FaUsers } from 'react-icons/fa';
import { GiStarSwirl } from 'react-icons/gi';
import { GoOrganization } from 'react-icons/go';
import { PiSignOutBold } from 'react-icons/pi';
import { RiTeamFill } from 'react-icons/ri';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import classes from './Navbar.module.css';

const NavBar = () => {
	const [navItems, setNavItems] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (token) {
			const headers = {
				Authorization: `Bearer ${token}`
			};
			axios
				.get('http://localhost:5000/token-check', { headers })
				.then(() => {
					setIsAuthenticated(true);
				})
				.catch((error) => {
					console.log(error);
					setIsAuthenticated(false);
				});
		} else {
			setIsAuthenticated(false);
		}
	}, [token]);

	useEffect(() => {
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
			setNavItems([
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
			]);
		} else {
			setNavItems([
				...fixedItems,
				{
					to: 'auth?mode=signin',
					label: 'Auth',
					icon: <FaSignInAlt />
				}
			]);
		}
	}, [isAuthenticated]);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const onSignOutClick = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const onConfirmSignOut = () => {
		localStorage.removeItem('token');
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
