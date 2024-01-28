import { useState } from 'react';
import Modal from '../Modal/Modal';

const ForgotPassword = ({ isFormOpen }) => {
	const [counter, setCounter] = useState(0);

	if (!isFormOpen) return null;
	return (
		<div className="overlay">
			<Modal
				isOpen={isFormOpen}
				onClose={() => setCounter(counter + 1)}
				onConfirm={() => setCounter(counter + 1)}
				message="Reset Password"
				buttonTitle={counter === 0 ? 'Send Email' : counter === 1 ? 'Verify OTP' : 'Reset Password'}
				hasInput={{
					label: counter === 0 ? 'Email' : counter === 1 ? 'OTP' : 'New Password',
					placeholder: counter === 0 ? 'Enter your email' : counter === 1 ? 'Enter OTP' : 'Enter new password',
				}}
			/>
		</div>
	);
};

export default ForgotPassword;
