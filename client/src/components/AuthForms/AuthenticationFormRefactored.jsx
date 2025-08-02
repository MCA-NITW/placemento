import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signin, signup } from '../../api/authApi';
import { FormField, PrimaryButton } from '../common';
import { VALIDATION, UTILS } from '../../constants/options';
import ToastContent from '../ToastContent/ToastContent';
import ForgetPassword from './ForgetPassword';
import FormFooter from './FormFooter';
import classes from './auth.module.css';

const AuthenticationForm = () => {
	// Form state
	const [formData, setFormData] = useState({
		name: '',
		rollNo: '',
		email: '',
		password: '',
		pgCgpa: '0',
		pgPercentage: '0',
		ugCgpa: '0',
		ugPercentage: '0',
		hscCgpa: '0',
		hscPercentage: '0',
		sscCgpa: '0',
		sscPercentage: '0',
		totalGapInAcademics: '0',
		backlogs: '0'
	});

	const [currentStep, setCurrentStep] = useState(1);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const isSignIn = searchParams.get('mode') === 'signin';

	// Handle form field changes
	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		
		// Auto-calculate percentage for CGPA fields
		if (field === 'pgCgpa') {
			setFormData(prev => ({ ...prev, pgPercentage: (value * 9.5).toFixed(2) }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		const user = isSignIn 
			? { email: formData.email, password: formData.password }
			: {
				name: formData.name,
				rollNo: formData.rollNo,
				email: formData.email,
				password: formData.password,
				pg: { cgpa: formData.pgCgpa, percentage: formData.pgPercentage },
				ug: { cgpa: formData.ugCgpa, percentage: formData.ugPercentage },
				hsc: { cgpa: formData.hscCgpa, percentage: formData.hscPercentage },
				ssc: { cgpa: formData.sscCgpa, percentage: formData.sscPercentage },
				totalGapInAcademics: formData.totalGapInAcademics,
				backlogs: 0
			};

		try {
			const res = await (isSignIn ? signin(user) : signup(user));
			toast.success(<ToastContent res={isSignIn ? 'Sign In successful' : 'Sign Up successful'} messages={res.data.messages} />);
			if (isSignIn) {
				localStorage.setItem('token', res.data.data.token);
				navigate('/');
			} else {
				navigate('/auth?mode=signin');
			}
		} catch (err) {
			toast.error(<ToastContent res={isSignIn ? 'Sign In failed' : 'Sign Up failed'} messages={err.response.data.errors} />);
		}
	};

	const renderEmailPasswordFields = () => (
		<>
			<FormField
				label="Email"
				name="email"
				value={formData.email}
				onChange={(e) => handleChange('email', e.target.value)}
				suffix={VALIDATION.EMAIL_DOMAIN}
				required
			/>
			<FormField
				label="Password"
				name="password"
				type="password"
				value={formData.password}
				onChange={(e) => handleChange('password', e.target.value)}
				showPasswordToggle={true}
				required
			/>
		</>
	);

	const renderPersonalDetails = () => (
		<>
			<div className={classes['auth-form__head2']}>
				<h2>Enter your personal details</h2>
			</div>
			{renderEmailPasswordFields()}
			<FormField
				label="Name"
				name="name"
				value={formData.name}
				onChange={(e) => handleChange('name', e.target.value)}
				required
			/>
			<FormField
				label="Roll No"
				name="rollNo"
				value={formData.rollNo}
				onChange={(e) => handleChange('rollNo', e.target.value)}
				required
			/>
		</>
	);

	const renderAcademicDetails = () => (
		<>
			<div className={classes['auth-form__head2']}>
				<h2>Enter your academic details</h2>
				<p>(Please Do Conversion According to your Institute)</p>
			</div>
			
			{/* PG Details */}
			<div className="form-group">
				<FormField
					label="PG CGPA"
					name="pgCgpa"
					type="number"
					value={formData.pgCgpa}
					onChange={(e) => handleChange('pgCgpa', e.target.value)}
					step="0.01"
					min="0"
					max="10"
				/>
				<FormField
					label="PG Percentage"
					name="pgPercentage"
					type="number"
					value={formData.pgPercentage}
					onChange={(e) => handleChange('pgPercentage', e.target.value)}
					disabled
				/>
			</div>

			{/* UG Details */}
			<div className="form-group">
				<FormField
					label="UG CGPA"
					name="ugCgpa"
					type="number"
					value={formData.ugCgpa}
					onChange={(e) => handleChange('ugCgpa', e.target.value)}
					step="0.01"
					min="0"
					max="10"
				/>
				<FormField
					label="UG Percentage"
					name="ugPercentage"
					type="number"
					value={formData.ugPercentage}
					onChange={(e) => handleChange('ugPercentage', e.target.value)}
					step="0.01"
				/>
			</div>

			{/* 12th Details */}
			<div className="form-group">
				<FormField
					label="12th CGPA"
					name="hscCgpa"
					type="number"
					value={formData.hscCgpa}
					onChange={(e) => handleChange('hscCgpa', e.target.value)}
					step="0.01"
					min="0"
					max="10"
				/>
				<FormField
					label="12th Percentage"
					name="hscPercentage"
					type="number"
					value={formData.hscPercentage}
					onChange={(e) => handleChange('hscPercentage', e.target.value)}
					step="0.01"
				/>
			</div>

			{/* 10th Details */}
			<div className="form-group">
				<FormField
					label="10th CGPA"
					name="sscCgpa"
					type="number"
					value={formData.sscCgpa}
					onChange={(e) => handleChange('sscCgpa', e.target.value)}
					step="0.01"
					min="0"
					max="10"
				/>
				<FormField
					label="10th Percentage"
					name="sscPercentage"
					type="number"
					value={formData.sscPercentage}
					onChange={(e) => handleChange('sscPercentage', e.target.value)}
					step="0.01"
				/>
			</div>

			{/* Gap and Backlogs */}
			<div className="form-group">
				<FormField
					label="Gap in Academics"
					name="totalGapInAcademics"
					type="number"
					value={formData.totalGapInAcademics}
					onChange={(e) => handleChange('totalGapInAcademics', e.target.value)}
					suffix="Years"
					min="0"
				/>
				<FormField
					label="Backlogs"
					name="backlogs"
					type="number"
					value={formData.backlogs}
					onChange={(e) => handleChange('backlogs', e.target.value)}
					suffix="Subjects"
					min="0"
				/>
			</div>
		</>
	);

	const renderSignIn = () => (
		<>
			{renderEmailPasswordFields()}
			<PrimaryButton type="submit" fullWidth>
				Sign In
			</PrimaryButton>
			<ForgetPassword />
		</>
	);

	const renderSignUp = () => (
		<>
			{currentStep === 1 && (
				<>
					{renderPersonalDetails()}
					<PrimaryButton type="button" onClick={() => setCurrentStep(2)} fullWidth>
						Next
					</PrimaryButton>
				</>
			)}
			{currentStep === 2 && (
				<>
					{renderAcademicDetails()}
					<div className="btn-group">
						<PrimaryButton type="button" onClick={() => setCurrentStep(1)}>
							Previous
						</PrimaryButton>
						<PrimaryButton type="submit">
							Sign Up
						</PrimaryButton>
					</div>
				</>
			)}
		</>
	);

	return (
		<div className={classes['auth-form']}>
			<div className={classes['auth-form__head']}>
				<h1>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
			</div>

			<form onSubmit={handleSubmit}>
				{isSignIn ? renderSignIn() : renderSignUp()}
			</form>

			<FormFooter />
		</div>
	);
};

export default AuthenticationForm;
