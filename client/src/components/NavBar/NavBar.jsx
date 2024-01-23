import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { BiStats } from 'react-icons/bi';
import { RiTeamFill } from 'react-icons/ri';
import { FaSignInAlt } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { GoOrganization } from 'react-icons/go';
import { PiSignOutBold } from 'react-icons/pi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classes from './Navbar.module.css';
import Modal from '../Modal/Modal';

const NavBar = () => {
	const [navItems, setNavItems] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (token) {
			const headers = {
				Authorization: `Bearer ${token}`,
			};
			axios
				.get('http://localhost:5000/profile', { headers })
				.then(response => {
					console.log(response);
					setIsAuthenticated(true);
				})
				.catch(error => {
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
				icon: <FaHome />,
			},
			{
				to: 'stats',
				label: 'Stats',
				icon: <BiStats />,
			},
			{
				to: 'teams',
				label: 'Teams',
				icon: <RiTeamFill />,
			},
		];

		if (isAuthenticated) {
			setNavItems([
				...fixedItems,
				{
					to: 'users',
					label: 'Users',
					icon: <FaUsers />,
				},
				{
					to: 'companies',
					label: 'Companies',
					icon: <GoOrganization />,
				},
			]);
		} else {
			setNavItems([
				...fixedItems,
				{
					to: 'auth?mode=signin',
					label: 'Auth',
					icon: <FaSignInAlt />,
				},
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
					<span>MCA</span>
				</NavLink>
				<div className={classes['nav__list']}>
					{navItems.map(item => (
						<NavLink
							to={item.to}
							className={({ isActive }) => (isActive ? classes.active : undefined)}
							aria-label={item.label}
							key={item.to}
						>
							{item.icon}
						</NavLink>
					))}
					{isAuthenticated && (
						<div className={classes['nav__signout']} aria-label="Sign Out" onClick={onSignOutClick}>
							<PiSignOutBold />
						</div>
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
