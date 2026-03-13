import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333',
});

// Interceptador: Antes de qualquer requisição sair do React, ele anexa o Token de segurança
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@TaxTrade:token');

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});