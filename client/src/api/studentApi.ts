import axiosInstance from './axiosInstance';

export const getStudents = () => axiosInstance.get('/users/view');

export const getStudent = (id: string) => axiosInstance.get(`/users/view/${id}`);

export const updateStudent = (id: string, user: Record<string, unknown>) => axiosInstance.put(`/users/update/${id}`, user);

export const updateVerificationStatus = (id: string) => axiosInstance.put(`/users/verify/${id}`);

export const updateUserRole = (id: string, role: string) => axiosInstance.put(`/users/role/${id}`, { role });

export const deleteStudent = (id: string) => axiosInstance.delete(`/users/delete/${id}`);

export const updateStudentCompany = (id: string, companyId: string) => axiosInstance.put(`/users/company/${id}`, { companyId });

export const updateStudentCompanyLocation = (id: string, location: string) => axiosInstance.put(`/users/companyLocation/${id}`, { location });
