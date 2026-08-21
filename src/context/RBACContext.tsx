import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getUserPermissions, hasAllPermissions, hasAnyPermission, hasPermission, canAccessRoute } from '../utils/rbac';

interface RBACContextType {
    permissions: string[];
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    canAccessRoute: (route: string) => boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const value = useMemo(() => {
        const permissions = getUserPermissions(user);

        return {
            permissions,
            hasPermission: (permission: string) => hasPermission(user, permission),
            hasAnyPermission: (permissionList: string[]) => hasAnyPermission(user, permissionList),
            hasAllPermissions: (permissionList: string[]) => hasAllPermissions(user, permissionList),
            canAccessRoute: (route: string) => canAccessRoute(user, route),
        };
    }, [user]);

    return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};

export const useRBAC = () => {
    const context = useContext(RBACContext);
    if (!context) {
        throw new Error('useRBAC must be used within an RBACProvider');
    }
    return context;
};
