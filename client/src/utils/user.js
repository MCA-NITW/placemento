import { jwtDecode } from 'jwt-decode';
import { getAuthToken } from './auth';

const getUser = () => {
	const token = getAuthToken();
	if (token) {
		try {
			const decodedToken = jwtDecode(token);
			return decodedToken;
		} catch (error) {
			console.error('Error decoding token:', error.message);
			return null;
		}
	} else {
		console.error('Token not found.');
		return null;
	}
};

export default getUser;
