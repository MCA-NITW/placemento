import axiosInstance from './axiosInstance';

export const getCtcStats = () => axiosInstance.get('/stats/ctc');

export const getCompanyStats = () => axiosInstance.get('/stats/company');

export const getStudentStats = () => axiosInstance.get('/stats/student');
