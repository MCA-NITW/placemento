import axiosInstance from './axiosInstance';

export const signup = (user) => {
	return axiosInstance.post('/auth/signup', user);
};

export const signin = (user) => {
	return axiosInstance.post('/auth/login', user);
};

export const forgotPassword = (email) => {
	return axiosInstance.post('/auth/forgot-password', email);
};
