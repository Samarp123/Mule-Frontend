import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LoginCredentials } from '../types/auth';
import { DEMO_USERS, createMockJwt, ROLE_DEFAULT_ROUTES } from '../data/mockAuth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<string>;
    logout: () => void;
    hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('mule_auth_token');
        const savedUser = localStorage.getItem('mule_auth_user');

        if (savedToken && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
            } catch {
                localStorage.removeItem('mule_auth_token');
                localStorage.removeItem('mule_auth_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials): Promise<string> => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        const normalizedEmail = credentials.email.trim().toLowerCase();
        const matchedUser = DEMO_USERS[normalizedEmail];

        if (!matchedUser) {
            setIsLoading(false);
            throw new Error('Invalid credentials. Use demo accounts provided.');
        }

        const mockToken = createMockJwt(matchedUser);

        setUser(matchedUser);
        setToken(mockToken);

        localStorage.setItem('mule_auth_token', mockToken);
        localStorage.setItem('mule_auth_user', JSON.stringify(matchedUser));

        setIsLoading(false);
        return ROLE_DEFAULT_ROUTES[matchedUser.role];
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('mule_auth_token');
        localStorage.removeItem('mule_auth_user');
    };

    const hasRole = (roles: UserRole[]): boolean => {
        return !!user && roles.includes(user.role);
    };

    return (
        <AuthContext.Provider
      value= {{
        user,
            token,
            isAuthenticated: !!user && !!token,
                isLoading,
                login,
                logout,
                hasRole,
      }
}
    >
    { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};