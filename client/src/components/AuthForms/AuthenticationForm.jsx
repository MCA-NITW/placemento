import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormFooter } from './FormFooter';
import { useNavigate } from 'react-router-dom';
import { signin, signup } from '../../api/authApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './auth.module.css';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';

const ToastContent = ({ res, messages }) => (
	<div>
		<h3>{res}</h3>
		<ul>
			{messages.map((message, index) => (
				<li key={index}>{message}</li>
			))}
		</ul>
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

		setName(
			name
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' '),
		);

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
					pg: {
						cgpa: pgCgpa,
						percentage: pgPercentage,
					},
					ug: {
						cgpa: ugCgpa,
						percentage: ugPercentage,
					},
					hsc: {
						cgpa: hscCgpa,
						percentage: hscPercentage,
					},
					ssc: {
						cgpa: sscCgpa,
						percentage: sscPercentage,
					},
					totalGapInAcademics,
				};
		try {
			const res = await (isSignIn ? signin(user) : signup(user));
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
		} catch (err) {
			e.preventDefault();
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
		}
	};
	const handleEmailChange = e => {
		const enteredEmail = e.target.value.trim().toLowerCase();
		const domain = '@student.nitw.ac.in';

		if (!enteredEmail.startsWith(domain)) {
			setEmail(domain ? `${enteredEmail}${domain}` : enteredEmail);
		} else {
			setEmail(enteredEmail);
		}
	};

	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className={classes['auth-form']}>
			<h1>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
			<form onSubmit={handleSubmit}>
				{isSignIn ? (
					<>
						<div className={classes['auth-form__item']}>
							<label>Email</label>
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
							<label>Password</label>
							<div className={classes['password-input-container']}>
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									onChange={e => setPassword(e.target.value)}
									value={password}
								/>
								<button
									type="button"
									className={classes['password-toggle']}
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>
						<button type="submit" className={classes.btn}>
							Sign In
						</button>
					</>
				) : (
					<>
						{currentStep === 1 && (
							<>
								<div className={classes['auth-form__head2']}>
									<h2>Enter your personal details</h2>
								</div>
								<div className={classes['auth-form__item']}>
									<label>Name</label>
									<input type="text" placeholder="Name" onChange={e => setName(e.target.value)} value={name} />
								</div>
								<div className={classes['auth-form__item']}>
									<label>Roll No.</label>
									<input type="text" placeholder="Roll No" onChange={e => setRollNo(e.target.value)} value={rollNo} />
								</div>
								<div className={classes['auth-form__item']}>
									<label>Email</label>
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
									<label>Password</label>
									<div className={classes['password-input-container']}>
										<input
											type={showPassword ? 'text' : 'password'}
											placeholder="Password"
											onChange={e => setPassword(e.target.value)}
											value={password}
										/>
										<button
											type="button"
											className={classes['password-toggle']}
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? <FaEyeSlash /> : <FaEye />}
										</button>
									</div>
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
									<label>PG</label>
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
									<label>UG</label>
									<input type="number" placeholder="UG CGPA" onChange={e => setUgCgpa(e.target.value)} value={ugCgpa} />
									<input
										type="number"
										placeholder="UG Percentage"
										onChange={e => setUgPercentage(e.target.value)}
										value={ugPercentage}
									/>
								</div>
								<div className={classes['auth-form__item']}>
									<label>12th</label>
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
									<label>10th</label>
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
									<label>Gap</label>
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
				<ToastContainer />
			</form>
		</div>
	);
};

export default AuthenticationForm;
