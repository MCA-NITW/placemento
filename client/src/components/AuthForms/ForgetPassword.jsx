import propTypes from 'prop-types';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword, verifyOTP } from '../../api/authApi';
import Modal from '../Modal/Modal';
import ToastContent from '../ToastContent/ToastContent';
import classes from './auth.module.css';

const ForgetPassword = ({ isFormOpen, onCloseAction }) => {
	const [counter, setCounter] = useState(0);
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const onConfirmAction = async () => {
		if (counter === 0) {
			try {
				const res = await forgotPassword({ email });
				toast.success(<ToastContent res="Email Sent" messages={res.data.messages} />, {
					autoClose: 4000,
					closeOnClick: true,
					pauseOnHover: true
				});
				setCounter(counter + 1);
			} catch (err) {
				toast.error(<ToastContent res="Email Sent" messages={err.response.data.errors} />, {
					autoClose: 4000,
					closeOnClick: true,
					pauseOnHover: true
				});
			}
		} else if (counter === 1) {
			try {
				const res = await verifyOTP({ email, otp });
				toast.success(<ToastContent res="OTP Verified" messages={res.data.messages} />, {
					autoClose: 4000,
					closeOnClick: true,
					pauseOnHover: true
				});
				setCounter(counter + 1);
			} catch (err) {
				toast.error(<ToastContent res="OTP Verification Failed" messages={err.response.data.errors} />, {
					autoClose: 4000,
					closeOnClick: true,
					pauseOnHover: true
				});
			}
		} else {
			try {
				const res = await resetPassword({ email, otp, newPassword });
				toast.success(<ToastContent res="Password Reset Successful" messages={res.data.messages} />, {
					autoClose: 4000,
					closeOnClick: true,
					pauseOnHover: true
				});
				onCloseAction();
			} catch (err) {
				toast.error(<ToastContent res="Password Reset Failed" messages={err.response.data.errors} />, {
					autoClose: 4000,
					closeOnClick: true,
					pauseOnHover: true
				});
			}
		}
	};

	const handleEmailChange = (e) => {
		const enteredEmail = e.target.value.trim().toLowerCase();
		const domain = '@student.nitw.ac.in';

		let formattedEmail = enteredEmail;
		if (!enteredEmail.startsWith(domain)) {
			formattedEmail = domain ? `${enteredEmail}${domain}` : enteredEmail;
		}
		setEmail(formattedEmail);
	};

	if (!isFormOpen) return null;

	return (
		<Modal
			isOpen={isFormOpen}
			onClose={() => {
				setCounter(0);
				onCloseAction();
			}}
			onConfirm={() => onConfirmAction()}
			message={counter === 0 ? 'Enter your College Email ID!!' : counter === 1 ? 'Check your email for OTP' : 'Enter your new password'}
			buttonTitle={counter === 0 ? 'Send Email' : counter === 1 ? 'Verify OTP' : 'Reset Password'}
			HasInput={() => (
				<div className={classes['modal__input-container']}>
					<input
						type={counter === 0 ? 'email' : counter === 1 ? 'number' : showPassword ? 'text' : 'password'}
						placeholder={counter === 0 ? 'Enter your email' : counter === 1 ? 'Enter OTP' : 'Enter new password'}
						onChange={(e) => {
							if (counter === 0) handleEmailChange(e);
							else if (counter === 1) setOtp(e.target.value);
							else setNewPassword(e.target.value);
						}}
						value={counter === 0 ? email.trim().replace('@student.nitw.ac.in', '') : counter === 1 ? otp : newPassword}
						id="input"
						autoFocus
					/>
					{counter === 2 && (
						<button className={classes['password-toggle']} onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					)}
					{counter === 0 && <div className={classes['email-domain']}>@student.nitw.ac.in</div>}
				</div>
			)}
		/>
	);
};

ForgetPassword.propTypes = {
	isFormOpen: propTypes.bool.isRequired,
	onCloseAction: propTypes.func.isRequired
};

export default ForgetPassword;
