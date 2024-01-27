import { redirect } from 'react-router-dom';

const tokenValid = (token) => {
	if (!token) return false;
	const exp = JSON.parse(atob(token.split('.')[1])).exp;
	return exp > Date.now() / 1000;
};

export const getAuthToken = () => {
	const token = localStorage.getItem('token');
	if (!tokenValid(token)) {
		localStorage.removeItem('token');
		return null;
	}
	if (!token) return null;
	return token;
};

export const checkAuthAction = () => {
	if (!getAuthToken()) {
		return redirect('/auth?mode=signin');
	}
	return null;
};
