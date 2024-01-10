import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './auth.css';

const SignUp = () => {
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
    <div className="container auth">
      <div className="auth-form">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
          <input type="text" placeholder="Roll No" onChange={e => setRollNo(e.target.value)} />
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button type="submit">Sign Up</button>
        </form>
        <div className="auth-form__footer">
          <p>Already have an account?</p>
          <Link to="/auth/signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
