import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { ROLE_DEFAULT_ROUTES } from '../../data/mockAuth';

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect user to their valid default dashboard if trying to access unauthorized route
        const redirectPath = ROLE_DEFAULT_ROUTES[user.role] || '/login';
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};