/**
 * Custom Hook: useUsers
 * Fetches and caches user data to reduce redundant API calls
 * Implements client-side caching with 5-minute expiry
 *
 * Usage:
 * const { users, loading, error, refetch, clearCache } = useUsers();
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

// Simple in-memory cache
let cachedUsers = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUsers = () => {
	const [users, setUsers] = useState(cachedUsers || []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const mountedRef = useRef(true);

	useEffect(() => {
		let isSubscribed = true;

		const fetchUsers = async () => {
			const now = Date.now();

			// Check cache first
			if (cachedUsers && cacheTime && now - cacheTime < CACHE_DURATION) {
				return; // Cache is valid
			}

			try {
				if (!isSubscribed) return;
				setLoading(true);

				const response = await axiosInstance.get('/users/view');
				if (!isSubscribed) return;

				const userData = response.data.users || response.data;
				cachedUsers = userData;
				cacheTime = now;
				setUsers(userData);
				setError(null);
			} catch (err) {
				if (!isSubscribed) return;
				console.error('Error fetching users:', err);
				setError(err.response?.data?.message || 'Failed to fetch users');
			} finally {
				if (isSubscribed) {
					setLoading(false);
				}
			}
		};

		fetchUsers();

		return () => {
			isSubscribed = false;
			mountedRef.current = false;
		};
	}, []); // Empty deps - run ONCE on mount

	// Manual refetch function
	const refetch = useCallback(async () => {
		if (!mountedRef.current) return;

		try {
			setLoading(true);
			const response = await axiosInstance.get('/users/view');
			const userData = response.data.users || response.data;

			cachedUsers = userData;
			cacheTime = Date.now();
			setUsers(userData);
			setError(null);
		} catch (err) {
			console.error('Error fetching users:', err);
			setError(err.response?.data?.message || 'Failed to fetch users');
		} finally {
			setLoading(false);
		}
	}, []);

	// Clear cache manually
	const clearCache = useCallback(() => {
		cachedUsers = null;
		cacheTime = null;
		setUsers([]);
	}, []);

	return { users, loading, error, refetch, clearCache };
};

export default useUsers;
