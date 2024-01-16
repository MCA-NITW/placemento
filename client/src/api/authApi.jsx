//  Auth Apis from backend

import axios from 'axios';

export const signup = user => {
	return axios.post('http://localhost:5000/auth/signup', user);
};

export const signin = user => {
	return axios.post('http://localhost:5000/auth/login', user);
};
