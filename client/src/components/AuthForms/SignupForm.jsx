import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormFooter from './FormFooter';
import './auth.css';
import { signup } from '../../api/authApi';

const ToastContent = ({ res, message }) => (
  <div>
    <div>{res}</div>
    {message && <div>{message}</div>}
  </div>
);

const style = {
  backgroundColor: 'var(--color-bg)',
  color: 'var(--color-white)',
  borderRadius: '1rem',
};

const SignupForm = () => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    const user = {
      name,
      rollNo,
      email,
      password,
    };

    try {
      const res = await signup(user);
      toast.success(<ToastContent res="Signup Successful!!" message={res.data.message} />, {
        style: style,
      });
      console.log(res.data);
    } catch (err) {
      toast.error(<ToastContent res="Signup Failed!!" message={err.response.data.message} />, {
        style: style,
      });
      console.log(err);
    }
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
      <ToastContainer />
    </div>
  );
};

export default SignupForm;
