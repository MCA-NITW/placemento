import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import Teams from './pages/Teams/Teams';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';

const RouterWrapper = ({ children, activeNav, setActiveNav }) => (
  <Router basename="/">
    <NavBar setActiveNav={setActiveNav} activeNav={activeNav} />
    {children}
  </Router>
);

RouterWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  activeNav: PropTypes.string.isRequired,
  setActiveNav: PropTypes.func.isRequired,
};

const App = () => {
  const [activeNav, setActiveNav] = React.useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <RouterWrapper activeNav={activeNav} setActiveNav={setActiveNav}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/teams" element={<Teams />} />
        <Route
          path="/auth/signin"
          element={
            <SignIn
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route path="/auth/signup" element={<SignUp />} />
      </Routes>
    </RouterWrapper>
  );
};

export default App;
