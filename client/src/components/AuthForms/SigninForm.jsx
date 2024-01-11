import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormFooter from './FormFooter';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import { signin } from '../../api/authApi';

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

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    signin(user)
      .then(res => {
        toast.success(<ToastContent res="Login Successful!!" message={res.data.message} />, {
          style: style,
        });
        localStorage.setItem('token', res.data.data.token);
        navigate('/');
        console.log(res.data);
      })
      .catch(err => {
        toast.error(<ToastContent res="Login Failed!!" message={err.response.data.message} />, {
          style: style,
        });
        console.log(err);
      });
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
      <ToastContainer />
    </div>
  );
};

export default SigninForm;
