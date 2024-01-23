// role.js
import { jwtDecode } from 'jwt-decode';

const getUserRole = () => {
	const token = localStorage.getItem('token');
	if (token) {
		try {
			const decodedToken = jwtDecode(token);
			return decodedToken.role;
		} catch (error) {
			console.error('Error decoding token:', error.message);
			return null;
		}
	} else {
		console.error('Token not found.');
		return null;
	}
};

export default getUserRole;
