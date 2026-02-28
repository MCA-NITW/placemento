import { useState } from 'react';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword, verifyOTP } from '../api/authApi';
import type { ApiError } from '../types';
import Modal from './Modal';
import ToastContent from './ToastContent';

const inp: React.CSSProperties = {
	width: '100%',
	padding: '.65rem',
	background: 'var(--bg1)',
	border: '1px solid transparent',
	borderRadius: 'var(--r1)',
	color: 'var(--text)',
	fontSize: '.9rem',
	outline: 'none'
};

const ForgetPassword = () => {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(1);
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [pw, setPw] = useState('');

	const handleConfirm = async () => {
		try {
			const fullEmail = email.trim().toLowerCase() + '@student.nitw.ac.in';
			if (step === 1) {
				await forgotPassword({ email: fullEmail });
				toast.success(<ToastContent res="OTP Sent" messages={['Check your email']} />);
				setStep(2);
			} else if (step === 2) {
				await verifyOTP({ email: fullEmail, otp });
				toast.success(<ToastContent res="Verified" messages={['Enter new password']} />);
				setStep(3);
			} else {
				await resetPassword({ email: fullEmail, otp, newPassword: pw });
				toast.success(<ToastContent res="Done" messages={['Password reset']} />);
				setOpen(false);
				setStep(1);
			}
		} catch (err) {
			toast.error(<ToastContent res="Error" messages={(err as ApiError).response?.data?.errors || ['Failed']} />);
		}
	};

	const msgs = ['Enter your email', 'Enter the OTP sent to your email', 'Enter your new password'];
	const btns = ['Send OTP', 'Verify OTP', 'Reset Password'];

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '.82rem' }}
			>
				Forgot Password?
			</button>
			<Modal
				open={open}
				onClose={() => {
					setOpen(false);
					setStep(1);
				}}
				onConfirm={handleConfirm}
				message={msgs[step - 1]}
				confirmText={btns[step - 1]}
			>
				{step === 1 && <input style={inp} placeholder="Email (without domain)" value={email} onChange={(e) => setEmail(e.target.value)} />}
				{step === 2 && <input style={inp} placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />}
				{step === 3 && <input style={inp} type="password" placeholder="New Password" value={pw} onChange={(e) => setPw(e.target.value)} />}
			</Modal>
		</>
	);
};

export default ForgetPassword;
