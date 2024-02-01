import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signin, signup } from '../../api/authApi';
import ToastContent from '../ToastContent/ToastContent';
import ForgetPassword from './ForgetPassword';
import FormFooter from './FormFooter';
import classes from './auth.module.css';

const AuthenticationForm = () => {
	const [name, setName] = useState('');
	const [rollNo, setRollNo] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [pgCgpa, setPgCgpa] = useState('');
	const [pgPercentage, setPgPercentage] = useState('');
	const [ugCgpa, setUgCgpa] = useState('');
	const [ugPercentage, setUgPercentage] = useState('');
	const [hscCgpa, setHscCgpa] = useState('');
	const [hscPercentage, setHscPercentage] = useState('');
	const [sscCgpa, setSscCgpa] = useState('');
	const [sscPercentage, setSscPercentage] = useState('');
	const [totalGapInAcademics, setTotalGapInAcademics] = useState(0);
	const [backlogs, setBacklogs] = useState(0);
	const [currentStep, setCurrentStep] = useState(1);
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const isSignIn = params.get('mode') === 'signin';

	const handleSubmit = async (e) => {
		e.preventDefault();

		setName(
			name
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ')
		);

		const newEmail = email.trim().toLowerCase() + '@student.nitw.ac.in';

		const user = isSignIn
			? { email: newEmail, password }
			: {
					name,
					rollNo,
					email: newEmail,
					password,
					pg: { cgpa: pgCgpa, percentage: pgPercentage },
					ug: { cgpa: ugCgpa, percentage: ugPercentage },
					hsc: { cgpa: hscCgpa, percentage: hscPercentage },
					ssc: { cgpa: sscCgpa, percentage: sscPercentage },
					totalGapInAcademics,
					backlogs: 0
				};

		try {
			const res = await (isSignIn ? signin(user) : signup(user));
			toast.success(<ToastContent res={isSignIn ? 'Sign In successful' : 'Sign Up successful'} messages={res.data.messages} />);
			if (isSignIn) {
				localStorage.setItem('token', res.data.data.token);
				navigate('/');
			} else navigate('/auth?mode=signin');
		} catch (err) {
			toast.error(<ToastContent res={isSignIn ? 'Sign In failed' : 'Sign Up failed'} messages={err.response.data.errors} />);
		}
	};

	const [showPassword, setShowPassword] = useState(false);

	const getEmailPassInput = () => {
		return (
			<>
				<div className={classes['auth-form__item']}>
					<label htmlFor="email">Email</label>
					<div className={classes['input-container']}>
						<input type="text" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} value={email} />
						<div className={classes['email-domain']}>@student.nitw.ac.in</div>
					</div>
				</div>
				<div className={classes['auth-form__item']}>
					<label htmlFor="password">Password</label>
					<div className={classes['input-container']}>
						<input type={showPassword ? 'text' : 'password'} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
						<div type="button" className={classes['password-toggle']} onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</div>
					</div>
				</div>
			</>
		);
	};

	const signIn = () => {
		return (
			<>
				{getEmailPassInput()}
				<button type="submit" className={classes.btn}>
					Sign In
				</button>
				<ForgetPassword />
			</>
		);
	};

	const signUp = () => {
		return (
			<>
				{currentStep === 1 && (
					<>
						<div className={classes['auth-form__head2']}>
							<h2>Enter your personal details</h2>
						</div>
						{getEmailPassInput()}
						<div className={classes['auth-form__item']}>
							<label htmlFor="name">Name</label>
							<input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
						</div>
						<div className={classes['auth-form__item']}>
							<label htmlFor="rollNo">Roll No</label>
							<input type="text" placeholder="Roll No" onChange={(e) => setRollNo(e.target.value)} value={rollNo} />
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
								type="text"
								placeholder="PG CGPA"
								value={pgCgpa}
								onChange={(e) => {
									const pgCgpaValue = e.target.value;
									setPgCgpa(pgCgpaValue);
									setPgPercentage((pgCgpaValue * 9.5).toFixed(2));
								}}
								step="0.01"
							/>
							<input type="text" placeholder="PG Percentage" value={pgPercentage} onChange={(e) => setPgPercentage(e.target.value)} disabled />
						</div>
						<div className={classes['auth-form__item']}>
							<label htmlFor="ug">UG</label>
							<input type="text" placeholder="UG CGPA" onChange={(e) => setUgCgpa(e.target.value)} value={ugCgpa} step="0.01" />
							<input type="text" placeholder="UG Percentage" onChange={(e) => setUgPercentage(e.target.value)} value={ugPercentage} step="0.01" />
						</div>
						<div className={classes['auth-form__item']}>
							<label htmlFor="hsc">12th</label>
							<input type="text" placeholder="HSC CGPA" onChange={(e) => setHscCgpa(e.target.value)} value={hscCgpa} step="0.01" />
							<input type="text" placeholder="HSC Percentage" onChange={(e) => setHscPercentage(e.target.value)} value={hscPercentage} step="0.01" />
						</div>
						<div className={classes['auth-form__item']}>
							<label htmlFor="ssc">10th</label>
							<input type="text" placeholder="SSC CGPA" onChange={(e) => setSscCgpa(e.target.value)} value={sscCgpa} step="0.01" />
							<input type="text" placeholder="SSC Percentage" onChange={(e) => setSscPercentage(e.target.value)} value={sscPercentage} step="0.01" />
						</div>
						<div className={classes['auth-form__item']}>
							<label htmlFor="totalGapInAcademics">Gap</label>
							<input
								type="number"
								placeholder="Total Gap in Academics"
								value={totalGapInAcademics}
								onChange={(e) => setTotalGapInAcademics(e.target.value)}
							/>
							<label htmlFor="backlogs">Backlogs</label>
							<input type="number" placeholder="Backlogs" value={backlogs} onChange={(e) => setBacklogs(e.target.value)} />
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
		);
	};

	return (
		<div className={classes['auth-form']}>
			<h1>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
			<form onSubmit={handleSubmit}>
				{isSignIn ? signIn() : signUp()}
				<FormFooter mode={isSignIn ? 'signup' : 'signin'} />
			</form>
		</div>
	);
};

export default AuthenticationForm;
