import { jwtDecode } from 'jwt-decode';

function getUserRole() {
	const token = localStorage.getItem('token');

	if (token) {
		try {
			const decodedToken = jwtDecode(token);
			const userRole = decodedToken.role;
			return userRole;
		} catch (error) {
			console.error('Error decoding token:', error.message);
			return null;
		}
	} else {
		console.error('Token not found.');
	}
}

const userRole = getUserRole();
console.log('User Role:', userRole);

export default userRole;
