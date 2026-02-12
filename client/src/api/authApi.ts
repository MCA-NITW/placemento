import axiosInstance from './axiosInstance';

export const signup = (user: Record<string, unknown>) => {
	return axiosInstance.post('/auth/signup', user);
};

export const signin = (user: { email: string; password: string }) => {
	return axiosInstance.post('/auth/login', user);
};

export const forgotPassword = (email: { email: string }) => {
	return axiosInstance.post('/auth/verify-email', email);
};

export const verifyOTP = (data: { email: string; otp: string }) => {
	return axiosInstance.post('/auth/verify-otp', data);
};

export const resetPassword = (data: { email: string; otp: string; newPassword: string }) => {
	return axiosInstance.post('/auth/reset-password', data);
};
