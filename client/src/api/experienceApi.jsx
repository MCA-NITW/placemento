import axiosInstance from './axiosInstance';

export const addExperience = async (experienceData) => axiosInstance.post('/experiences/add', experienceData);

export const getAllExperience = async () => axiosInstance.get('/experiences/view');

export const getExperienceByTag = async (tag) => axiosInstance.get(`/experiences/view/${tag}`);

export const getExperienceByUser = async (id) => axiosInstance.get(`/experiences/user/${id}`);

export const addComment = async (commentData) => axiosInstance.post('/experiences/comment/add', commentData);

export const updateExperience = async (id, experienceData) => axiosInstance.put(`/experiences/update/${id}`, experienceData);

export const deleteExperience = async (id) => axiosInstance.delete(`/experiences/delete/${id}`);

export const deleteComment = async (id, commentId) => axiosInstance.delete(`/experiences/comment/delete/${id}/${commentId}`);
