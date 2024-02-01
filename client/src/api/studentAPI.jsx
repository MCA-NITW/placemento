import axiosInstance from './axiosInstance';

export const getStudents = () => axiosInstance.get('/users/view');

export const getStudent = (id) => axiosInstance.get(`/users/view/${id}`);

export const updateStudent = (id, user) => axiosInstance.put(`/users/update/${id}`, user);

export const updateVerificationStatus = (id) => axiosInstance.put(`/users/verify/${id}`);

export const updateUserRole = (id, role) => axiosInstance.put(`/users/role/${id}`, { role });

export const deleteStudent = (id) => axiosInstance.delete(`/users/delete/${id}`);

export const updateStudentCompany = (id, companyId) => axiosInstance.put(`/users/company/${id}`, { companyId });
