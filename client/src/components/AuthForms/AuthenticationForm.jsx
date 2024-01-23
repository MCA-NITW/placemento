import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FormFooter } from './FormFooter';
import { signin, signup } from '../../api/authApi';
import { toast } from 'react-toastify';
import classes from './auth.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ToastContent = ({ res, messages }) => (
	<div>
		<h3>{res}</h3>
		<div>
			{messages.map(message => (
				<div key={message} style={{ margin: '0.5rem 0' }}>
					{message}
				</div>
			))}
		</div>
	</div>
);

ToastContent.propTypes = {
	res: PropTypes.string.isRequired,
	messages: PropTypes.array.isRequired,
};

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
	const [pgCgpa, setPgCgpa] = useState();
	const [pgPercentage, setPgPercentage] = useState();
	const [ugCgpa, setUgCgpa] = useState();
	const [ugPercentage, setUgPercentage] = useState();
	const [hscCgpa, setHscCgpa] = useState();
	const [hscPercentage, setHscPercentage] = useState();
	const [sscCgpa, setSscCgpa] = useState();
	const [sscPercentage, setSscPercentage] = useState();
	const [totalGapInAcademics, setTotalGapInAcademics] = useState(0);
	const [currentStep, setCurrentStep] = useState(1);
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const isSignIn = params.get('mode') === 'signin';

	const handleSubmit = async e => {
		e.preventDefault();

		setName(formatName(name));

		const user = isSignIn
			? { email, password }
			: {
					name,
					rollNo,
					email,
					password,
					pg: { cgpa: pgCgpa, percentage: pgPercentage },
					ug: { cgpa: ugCgpa, percentage: ugPercentage },
					hsc: { cgpa: hscCgpa, percentage: hscPercentage },
					ssc: { cgpa: sscCgpa, percentage: sscPercentage },
					totalGapInAcademics,
				};

		try {
			const res = await (isSignIn ? signin(user) : signup(user));
			handleSuccess(isSignIn, res);
		} catch (err) {
			handleError(isSignIn, err);
		}
	};

	const handleSuccess = (isSignIn, res) => {
		toast.success(
			<ToastContent res={isSignIn ? 'Sign In successful' : 'Sign Up successful'} messages={res.data.messages} />,
			{
				style: style,
				autoClose: 4000,
				closeOnClick: true,
				pauseOnHover: true,
			},
		);
		if (isSignIn) {
			localStorage.setItem('token', res.data.data.token);
			navigate('/');
		}
		console.log(res.data);
	};

	const handleError = (isSignIn, err) => {
		toast.error(
			<ToastContent res={isSignIn ? 'Sign In failed' : 'Sign Up failed'} messages={err.response.data.errors} />,
			{
				style: style,
				autoClose: 4000,
				closeOnClick: true,
				pauseOnHover: true,
			},
		);
		console.log(err);
	};

	const handleEmailChange = e => {
		const enteredEmail = e.target.value.trim().toLowerCase();
		const domain = '@student.nitw.ac.in';

		let formattedEmail = enteredEmail;
		if (!enteredEmail.startsWith(domain)) {
			formattedEmail = domain ? `${enteredEmail}${domain}` : enteredEmail;
		}
		setEmail(formattedEmail);
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const formatName = name => {
		return name
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	};

	const [showPassword, setShowPassword] = useState(false);

	const getEmailPassInput = () => {
		return (
			<>
				<div className={classes['auth-form__item']}>
					<label htmlFor="email">Email</label>
					<div className={classes['email-input-container']}>
						<input
							type="text"
							placeholder="Enter your email"
							onChange={handleEmailChange}
							value={email.trim().replace('@student.nitw.ac.in', '')}
						/>
						<span className={classes['email-domain']}>@student.nitw.ac.in</span>
					</div>
				</div>
				<div className={classes['auth-form__item']}>
					<label htmlFor="password">Password</label>
					<div className={classes['password-input-container']}>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder="Password"
							onChange={e => setPassword(e.target.value)}
							value={password}
						/>
						<button type="button" className={classes['password-toggle']} onClick={toggleShowPassword}>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>
				</div>
			</>
		);
	};

	return (
		<div className={classes['auth-form']}>
			<h1>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
			<form onSubmit={handleSubmit}>
				{!isSignIn && currentStep === 1 && (
					<div className={classes['auth-form__head2']}>
						<h2>Enter your personal details</h2>
					</div>
				)}
				{isSignIn || currentStep === 1 ? getEmailPassInput() : null}
				{isSignIn ? (
					<button type="submit" className={classes.btn}>
						Sign In
					</button>
				) : (
					<>
						{currentStep === 1 && (
							<>
								<div className={classes['auth-form__item']}>
									<label htmlFor="name">Name</label>
									<input type="text" placeholder="Name" onChange={e => setName(e.target.value)} value={name} />
								</div>
								<div className={classes['auth-form__item']}>
									<label htmlFor="rollNo">Roll No</label>
									<input type="text" placeholder="Roll No" onChange={e => setRollNo(e.target.value)} value={rollNo} />
								</div>
								<button className={classes.btn} onClick={() => setCurrentStep(2)}>
									Next
								</button>
							</>
						)}
						{currentStep === 2 && (
							<>
								<div className={classes['auth-form__head2']}>
									<h2>Enter your academic details</h2>
									<p>(Please Do Conversion According to your Institute)</p>
								</div>
								<div className={classes['auth-form__item']}>
									<label htmlFor="pg">PG</label>
									<input
										type="number"
										placeholder="PG CGPA"
										value={pgCgpa}
										onChange={e => {
											const pgCgpaValue = e.target.value;
											setPgCgpa(pgCgpaValue);
											setPgPercentage((pgCgpaValue * 9.5).toFixed(2));
										}}
									/>
									<input
										type="number"
										placeholder="PG Percentage"
										value={pgPercentage}
										onChange={e => setPgPercentage(e.target.value)}
										disabled
									/>
								</div>
								<div className={classes['auth-form__item']}>
									<label htmlFor="ug">UG</label>
									<input type="number" placeholder="UG CGPA" onChange={e => setUgCgpa(e.target.value)} value={ugCgpa} />
									<input
										type="number"
										placeholder="UG Percentage"
										onChange={e => setUgPercentage(e.target.value)}
										value={ugPercentage}
									/>
								</div>
								<div className={classes['auth-form__item']}>
									<label htmlFor="hsc">12th</label>
									<input
										type="number"
										placeholder="HSC CGPA"
										onChange={e => setHscCgpa(e.target.value)}
										value={hscCgpa}
									/>
									<input
										type="number"
										placeholder="HSC Percentage"
										onChange={e => setHscPercentage(e.target.value)}
										value={hscPercentage}
									/>
								</div>
								<div className={classes['auth-form__item']}>
									<label htmlFor="ssc">10th</label>
									<input
										type="number"
										placeholder="SSC CGPA"
										onChange={e => setSscCgpa(e.target.value)}
										value={sscCgpa}
									/>
									<input
										type="number"
										placeholder="SSC Percentage"
										onChange={e => setSscPercentage(e.target.value)}
										value={sscPercentage}
									/>
								</div>
								<div className={classes['auth-form__item']}>
									<label htmlFor="totalGapInAcademics">Gap</label>
									<input
										type="number"
										placeholder="Total Gap in Academics"
										value={totalGapInAcademics}
										onChange={e => setTotalGapInAcademics(e.target.value)}
									/>
								</div>

								<div className={classes['auth-form__item_btn']}>
									<button className={classes.btn} onClick={() => setCurrentStep(1)}>
										Previous
									</button>
									<button type="submit" className={classes.btn}>
										Sign Up
									</button>
								</div>
							</>
						)}
					</>
				)}
				<FormFooter mode={isSignIn ? 'signup' : 'signin'} />
			</form>
		</div>
	);
};

export default AuthenticationForm;
