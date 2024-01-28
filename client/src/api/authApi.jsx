import axiosInstance from './axiosInstance';

export const signup = (user) => {
	return axiosInstance.post('/auth/signup', user);
};

export const signin = (user) => {
	return axiosInstance.post('/auth/login', user);
};

export const forgotPassword = (email) => {
	return axiosInstance.post('/auth/forgot-password/email', email);
};

export const verifyOTP = (otp) => {
	return axiosInstance.post('/auth/forgot-password/verify-otp', otp);
};

export const resetPassword = (password) => {
	return axiosInstance.post('/auth/forgot-password/reset-password', password);
};
