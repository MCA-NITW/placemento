/**
 * User utility functions
 * Now uses Auth Context for user data
 * Kept for backward compatibility
 */

import { getStudent } from '../api/studentApi';

/**
 * Gets full user data including database details
 * @param {string} userId - User ID from Auth Context
 * @returns {Promise<object>} Full user data
 */
const getUser = async (userId) => {
	try {
		const user = await getStudent(userId);
		user.data.id = userId;
		return user.data;
	} catch (error) {
		console.error('Error fetching user:', error.message);
		return null;
	}
};

export default getUser;
