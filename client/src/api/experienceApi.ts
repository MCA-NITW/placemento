import axiosInstance from './axiosInstance';

export const addExperience = async (experienceData: Record<string, unknown>) => axiosInstance.post('/experiences/add', experienceData);

export const getAllExperience = async () => axiosInstance.get('/experiences/view');

export const getExperienceByTag = async (tag: string) => axiosInstance.get(`/experiences/view/${tag}`);

export const getExperienceByUser = async (id: string) => axiosInstance.get(`/experiences/user/${id}`);

export const addComment = async (id: string, commentData: Record<string, unknown>) => axiosInstance.post(`/experiences/comment/add/${id}`, commentData);

export const updateExperience = async (id: string, experienceData: Record<string, unknown>) => axiosInstance.put(`/experiences/update/${id}`, experienceData);

export const deleteExperience = async (id: string) => axiosInstance.delete(`/experiences/delete/${id}`);

export const deleteComment = async (id: string, commentId: string) => axiosInstance.delete(`/experiences/comment/delete/${id}/${commentId}`);
