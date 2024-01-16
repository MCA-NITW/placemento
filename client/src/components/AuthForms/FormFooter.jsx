import React from 'react';
import { Link } from 'react-router-dom';
import classes from './auth.module.css';

export const FormFooter = ({ mode }) => {
	const footer_note =
		mode === 'signin' ? 'Already have an account?' : "Don't have an account?";
	const mode_text = mode === 'signin' ? 'Sign In' : 'Sign Up';

	return (
		<div className={classes['auth-form__footer']}>
			<p>{footer_note}</p>
			<Link to={`/auth?mode=${mode}`}>{mode_text}</Link>
		</div>
	);
};
