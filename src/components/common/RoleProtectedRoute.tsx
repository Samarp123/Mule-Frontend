import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    requiredPermissions?: string[];
    requireAnyPermission?: boolean;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
    children,
    allowedRoles,
    requiredPermissions = [],
    requireAnyPermission = true,
}) => {
    const { user, isAuthenticated, isLoading, hasAnyPermission, hasAllPermissions } = useAuth();

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

    const roleMatches = allowedRoles.includes(user.role);

    if (!roleMatches && requiredPermissions.length > 0) {
        const hasAccess = requireAnyPermission
            ? hasAnyPermission(requiredPermissions)
            : hasAllPermissions(requiredPermissions);

        if (!hasAccess) {
            return <Navigate to="/unauthorized" replace />;
        }
    } else if (!roleMatches) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (requiredPermissions.length > 0) {
        const hasAccess = requireAnyPermission
            ? hasAnyPermission(requiredPermissions)
            : hasAllPermissions(requiredPermissions);

        if (!hasAccess) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};