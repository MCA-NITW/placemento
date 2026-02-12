// SECURITY NOTE: JWT tokens are stored in localStorage for simplicity.
// localStorage is vulnerable to XSS attacks — any script on the page can read it.
// For production use, consider httpOnly cookies set by the server, which are
// not accessible to JavaScript and provide better protection against token theft.
import { redirect } from 'react-router-dom';
import { checkToken } from '../api/tokenCheckApi';

const verifyToken = async (token: string) => {
	try {
		const response = await checkToken();
		if (!response.data.isAuthenticated) return false;
		const exp = JSON.parse(atob(token.split('.')[1])).exp;
		return exp > Date.now() / 1000;
	} catch (error) {
		return false;
	}
};

export const getAuthToken = async () => {
	const token = localStorage.getItem('token');
	if (!token) return null;
	const isAuthenticated = await verifyToken(token);
	if (!isAuthenticated) {
		localStorage.removeItem('token');
		return null;
	}
	return token;
};

export const checkAuthAction = async () => {
	const token = await getAuthToken();
	if (!token) return redirect('/auth?mode=signin');
	return null;
};
