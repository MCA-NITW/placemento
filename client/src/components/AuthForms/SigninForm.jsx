import React, { useState } from 'react';
import axios from 'axios';
import FormFooter from './FormFooter';
import './auth.css';

const SigninForm = ({ setIsAuthenticated }) => {
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
    <div className="auth-form">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Sign In</button>
      </form>
      <FormFooter mode="signup" />
    </div>
  );
};

export default SigninForm;
