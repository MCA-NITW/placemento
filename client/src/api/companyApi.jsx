import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getCompanies = () => {
  return api.get('/companies/view');
};

export const getCompany = id => {
  return api.get(`/companies/view/${id}`);
};

export const addCompany = company => {
  return api.post('/companies/add', company);
};

export const updateCompany = (id, company) => {
  return api.put(`/companies/update/${id}`, company);
};

export const deleteCompany = id => {
  return api.delete(`/companies/delete/${id}`);
};
