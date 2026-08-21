export type UserRole = 'Admin' | 'ML Engineer' | 'AML Analyst';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
    department: string;
    lastLogin: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password?: string;
    rememberMe?: boolean;
}