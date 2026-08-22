import axios from 'axios';
import { User, LoginCredentials } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('mule_auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post('/auth/login', {
            username: credentials.username || credentials.email,
            email: credentials.email,
            password: credentials.password,
        });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data.user;
    },

    getUsers: async (): Promise<User[]> => {
        const response = await apiClient.get('/users');
        return response.data.users;
    },

    createUser: async (userData: {
        username: string;
        password?: string;
        role: string;
        name?: string;
        email?: string;
        department?: string;
    }) => {
        const response = await apiClient.post('/users', userData);
        return response.data;
    },

    updateUserStatus: async (id: string, status: 'Active' | 'Suspended') => {
        const response = await apiClient.patch(`/users/${id}/status`, { status });
        return response.data;
    },

    updateUserRole: async (id: string, role: string) => {
        const response = await apiClient.patch(`/users/${id}/role`, { role });
        return response.data;
    },
};
