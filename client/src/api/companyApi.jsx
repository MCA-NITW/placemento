import axiosInstance from './axiosInstance';

export const getCompanies = () => axiosInstance.get('/companies/view');

export const getCompany = (id) => axiosInstance.get(`/companies/view/${id}`);

export const addCompany = (company) => axiosInstance.post('/companies/add', company);

export const updateCompany = (id, company) => axiosInstance.put(`/companies/update/${id}`, company);

export const deleteCompany = (id) => axiosInstance.delete(`/companies/delete/${id}`);
