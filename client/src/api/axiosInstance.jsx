import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor for centralized error handling
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle 401 Unauthorized - token expired or invalid
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			if (window.location.pathname !== '/auth') {
				window.location.href = '/auth?mode=signin';
			}
		}
		
		// Handle network errors
		if (!error.response) {
			console.error('Network error: Please check your connection');
		}
		
		return Promise.reject(error);
	}
);

export default axiosInstance;
