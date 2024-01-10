import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { BiStats } from 'react-icons/bi';
import { RiTeamFill } from 'react-icons/ri';
import { FaSignInAlt } from 'react-icons/fa';
import './Navbar.css';

const NavBar = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: <FaHome />, content: 'home' },
    { to: '/stats', label: 'Stats', icon: <BiStats />, content: 'stats' },
    {
      to: '/teams',
      label: 'Teams',
      icon: <RiTeamFill />,
      content: 'teams',
    },
    {
      to: '/auth/signin',
      label: 'Sign In',
      icon: <FaSignInAlt />,
      content: 'auth',
    },
  ];

  return (
    <>
      <nav className="nav">
        <NavLink to="/" aria-label="Home" className="nav__logo">
          <span>MCA</span>
        </NavLink>
        <div className="nav__list">
          {navItems.map(item => (
            <NavLink to={item.to} aria-label={item.label} key={item.content}>
              {item.icon}
            </NavLink>
          ))}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
