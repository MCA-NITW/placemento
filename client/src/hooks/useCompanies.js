/**
 * Custom Hook: useCompanies
 * Fetches and caches company data to reduce redundant API calls
 * Implements client-side caching with 5-minute expiry
 *
 * Usage:
 * const { companies, loading, error, refetch, clearCache } = useCompanies();
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

// Simple in-memory cache
let cachedCompanies = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCompanies = () => {
	const [companies, setCompanies] = useState(cachedCompanies || []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const mountedRef = useRef(true);

	useEffect(() => {
		let isSubscribed = true;

		const fetchCompanies = async () => {
			const now = Date.now();

			// Check cache first
			if (cachedCompanies && cacheTime && now - cacheTime < CACHE_DURATION) {
				return; // Cache is valid
			}

			try {
				if (!isSubscribed) return;
				setLoading(true);

				const response = await axiosInstance.get('/companies/view');
				if (!isSubscribed) return;

				const companyData = response.data.companies || response.data;
				cachedCompanies = companyData;
				cacheTime = now;
				setCompanies(companyData);
				setError(null);
			} catch (err) {
				if (!isSubscribed) return;
				console.error('Error fetching companies:', err);
				setError(err.response?.data?.message || 'Failed to fetch companies');
			} finally {
				if (isSubscribed) {
					setLoading(false);
				}
			}
		};

		fetchCompanies();

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
			const response = await axiosInstance.get('/companies/view');
			const companyData = response.data.companies || response.data;

			cachedCompanies = companyData;
			cacheTime = Date.now();
			setCompanies(companyData);
			setError(null);
		} catch (err) {
			console.error('Error fetching companies:', err);
			setError(err.response?.data?.message || 'Failed to fetch companies');
		} finally {
			setLoading(false);
		}
	}, []);

	// Clear cache manually
	const clearCache = useCallback(() => {
		cachedCompanies = null;
		cacheTime = null;
		setCompanies([]);
	}, []);

	return { companies, loading, error, refetch, clearCache };
};

export default useCompanies;
