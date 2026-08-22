export type UserRole = string;

export type UserStatus = 'Active' | 'Suspended';

export interface User {
    id: string;
    username?: string;
    email: string;
    name: string;
    role: UserRole;
    roleIds?: string[];
    avatarUrl?: string;
    department: string;
    lastLogin: string;
    status?: UserStatus;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    username?: string;
    email?: string;
    password?: string;
    rememberMe?: boolean;
}