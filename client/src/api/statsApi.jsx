import axios from 'axios';

export const getCtcStats = () => {
	return axios.get('http://localhost:5000/stats/ctc');
};

export const getCompanyStats = () => {
	return axios.get('http://localhost:5000/stats/company');
};

export const getStudentStats = () => {
	return axios.get('http://localhost:5000/stats/student');
};
