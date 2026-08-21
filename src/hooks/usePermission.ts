import { useAuth } from '../context/AuthContext';
import { hasAllPermissions, hasAnyPermission, hasPermission, getUserPermissions, canAccessRoute } from '../utils/rbac';

export const usePermission = () => {
    const { user } = useAuth();

    return {
        permissions: getUserPermissions(user),
        hasPermission: (permission: string) => hasPermission(user, permission),
        hasAnyPermission: (permissions: string[]) => hasAnyPermission(user, permissions),
        hasAllPermissions: (permissions: string[]) => hasAllPermissions(user, permissions),
        canAccessRoute: (route: string) => canAccessRoute(user, route),
    };
};
