import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormFooter } from './FormFooter';
import { useNavigate } from 'react-router-dom';
import { signin, signup } from '../../api/authApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './auth.module.css';

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

const AuthenticationForm = () => {
	const [name, setName] = useState('');
	const [rollNo, setRollNo] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const isSignIn = params.get('mode') === 'signin';

	const handleSubmit = async e => {
		e.preventDefault();

		const user = isSignIn
			? {
					email,
					password,
				}
			: {
					name,
					rollNo,
					email,
					password,
				};

		try {
			const res = await (isSignIn ? signin(user) : signup(user));
			toast.success(
				<ToastContent
					res={isSignIn ? 'Sign In successful' : 'Sign Up successful'}
					message={res.data.message}
				/>,
				{
					style: style,
				},
			);
			if (isSignIn) {
				localStorage.setItem('token', res.data.data.token);
				navigate('/');
			}
			console.log(res.data);
		} catch (err) {
			toast.error(
				<ToastContent
					res={!isSignIn ? 'Sign In Failed!!' : 'Sign Up Failed '}
					message={err.response.data.message}
				/>,
				{
					style: style,
				},
			);
			console.log(err);
		}
	};

	return (
		<div className={classes['auth-form']}>
			<h1>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
			<form onSubmit={handleSubmit}>
				{!isSignIn && (
					<input
						type="text"
						placeholder="Name"
						onChange={e => setName(e.target.value)}
					/>
				)}
				{!isSignIn && (
					<input
						type="text"
						placeholder="Roll No"
						onChange={e => setRollNo(e.target.value)}
					/>
				)}
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
				<button type="submit" className={classes.btn}>
					{isSignIn ? 'Sign In' : 'Sign Up'}
				</button>
				<FormFooter mode={isSignIn ? 'signup' : 'signin'} />
				<ToastContainer />
			</form>
		</div>
	);
};

export default AuthenticationForm;
