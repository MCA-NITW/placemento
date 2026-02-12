import axiosInstance from './axiosInstance';

export const getCompanies = () => axiosInstance.get('/companies/view');

export const getCompany = (id: string) => axiosInstance.get(`/companies/view/${id}`);

export const addCompany = (company: Record<string, unknown>) => axiosInstance.post('/companies/add', company);

export const updateCompany = (id: string, company: Record<string, unknown>) => axiosInstance.put(`/companies/update/${id}`, company);

export const deleteCompany = (id: string) => axiosInstance.delete(`/companies/delete/${id}`);
