import React, { useState } from 'react';
import axios from 'axios';
import FormFooter from './FormFooter';
import './auth.css';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    const user = {
      name,
      rollNo,
      email,
      password,
    };

    axios
      .post('http://localhost:5000/auth/signup', user)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };
  return (
    <div className="auth-form">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Roll No" onChange={e => setRollNo(e.target.value)} />
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Sign Up</button>
      </form>
      <FormFooter mode="signin" />
    </div>
  );
};

export default SignupForm;
