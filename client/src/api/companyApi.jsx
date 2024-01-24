import axios from 'axios';

// Create an Axios instance with a default configuration
const axiosInstance = axios.create({
	baseURL: 'http://localhost:5000',
});

// Add a request interceptor to update the Authorization header with the latest token
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export const getCompanies = () => axiosInstance.get('/companies/view');

export const getCompany = (id) => axiosInstance.get(`/companies/view/${id}`);

export const addCompany = (company) => axiosInstance.post('/companies/add', company);

export const updateCompany = (id, company) => axiosInstance.put(`/companies/update/${id}`, company);

export const deleteCompany = (id) => axiosInstance.delete(`/companies/delete/${id}`);
