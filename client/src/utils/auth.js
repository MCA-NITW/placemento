import { redirect } from 'react-router-dom';

export const getAuthToken = () => {
	const token = localStorage.getItem('token');
	return token;
};

export const checkAuthAction = () => {
	if (!getAuthToken()) {
		return redirect('/auth?mode=signin');
	}
	return null;
};
