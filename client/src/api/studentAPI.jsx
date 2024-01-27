import axiosInstance from './axiosInstance';

export const getStudents = () => axiosInstance.get('/users/view');

export const getStudent = (id) => axiosInstance.get(`/users/view/${id}`);

export const updateStudent = (id, user) => axiosInstance.put(`/users/update/${id}`, user);

export const updateVerificationStatus = (id, isVerified) => axiosInstance.put(`/users/verify/${id}`, { isVerified });

export const updateUserRole = (id, role) => axiosInstance.put(`/users/role/${id}`, { role });
