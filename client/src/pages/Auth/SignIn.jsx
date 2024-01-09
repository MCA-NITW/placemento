import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './auth.css';

const SignIn = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    axios
      .post('http://localhost:5000/auth/login', user)
      .then(res => {
        console.log(res.data);
        setIsAuthenticated(true);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container auth">
      <div className="auth-form">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
        </form>
        <div className="auth-form__footer">
          <p>Don't have an account?</p>
          <Link to="/auth/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
