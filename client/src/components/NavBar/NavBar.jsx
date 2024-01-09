import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import { FaHome } from 'react-icons/fa';
import { BiStats } from 'react-icons/bi';
import { RiTeamFill } from 'react-icons/ri';
import { FaSignInAlt } from 'react-icons/fa';

const NavBar = () => {
  const location = useLocation();

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
    <nav className="nav">
      <Link to="/" aria-label="Home" className="nav__logo">
        <span>MCA</span>
      </Link>
      <div className="nav__list">
        {navItems.map(item => (
          <Link
            to={item.to}
            className={location.pathname.includes(item.content) ? 'active' : ''}
            aria-label={item.label}
            key={item.to}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
