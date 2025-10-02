/**
 * Auth Context
 * Provides centralized authentication state management
 * Eliminates need for jwt-decode in every component
 * Single source of truth for user data
 * 
 * Usage:
 * import { useAuth } from '@/context/AuthContext';
 * 
 * const { user, login, logout, isAuthenticated, loading } = useAuth();
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for existing token on mount
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const decoded = jwtDecode(token);
				// Check if token is expired
				if (decoded.exp * 1000 > Date.now()) {
					setUser(decoded);
				} else {
					// Token expired, remove it
					localStorage.removeItem('token');
				}
			} catch (error) {
				// Invalid token, remove it
				console.error('Invalid token:', error);
				localStorage.removeItem('token');
			}
		}
		setLoading(false);
	}, []);

	const login = (token) => {
		localStorage.setItem('token', token);
		const decoded = jwtDecode(token);
		setUser(decoded);
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	const updateUser = (updates) => {
		setUser((prev) => ({ ...prev, ...updates }));
	};

	const value = {
		user,
		login,
		logout,
		updateUser,
		isAuthenticated: !!user,
		loading,
		// Helper methods for common checks
		isAdmin: user?.role === 'admin',
		isStudent: user?.role === 'student',
		isCoordinator: user?.role === 'placementCoordinator'
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};

export default AuthContext;
