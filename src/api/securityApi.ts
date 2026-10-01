import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('mule_auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const securityApi = {
    getDashboardStats: async () => {
        const response = await apiClient.get('/security/dashboard-stats');
        return response.data;
    },

    getLoginAttempts: async (filters: Record<string, string> = {}) => {
        const params = new URLSearchParams(filters);
        const response = await apiClient.get(`/security/login-attempts?${params}`);
        return response.data;
    },

    getAlerts: async (filters: Record<string, string> = {}) => {
        const params = new URLSearchParams(filters);
        const response = await apiClient.get(`/security/alerts?${params}`);
        return response.data;
    },

    acknowledgeAlert: async (id: string, status: 'acknowledged' | 'resolved') => {
        const response = await apiClient.patch(`/security/alerts/${id}/acknowledge`, { status });
        return response.data;
    },

    getActiveSessions: async () => {
        const response = await apiClient.get('/security/sessions');
        return response.data;
    },

    revokeSession: async (id: string) => {
        const response = await apiClient.post(`/security/sessions/${id}/revoke`);
        return response.data;
    },

    getAuditLogs: async (filters: Record<string, string> = {}) => {
        const params = new URLSearchParams(filters);
        const response = await apiClient.get(`/security/audit-logs?${params}`);
        return response.data;
    },

    getRateLimitViolations: async (filters: Record<string, string> = {}) => {
        const params = new URLSearchParams(filters);
        const response = await apiClient.get(`/security/rate-limit-violations?${params}`);
        return response.data;
    },
};
