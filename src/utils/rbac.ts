import { User, UserRole } from '../types/auth';
import { getPermissionsForRoleIds, roleIdFromUserRole } from '../data/mockRoles';

export const getUserPermissions = (user?: Partial<User> | null): string[] => {
    if (!user) return [];

    const roleIds = Array.isArray(user.roleIds) && user.roleIds.length > 0
        ? user.roleIds
        : [roleIdFromUserRole(user.role ?? '')].filter(Boolean);

    return getPermissionsForRoleIds(roleIds);
};

export const hasPermission = (user: Partial<User> | null | undefined, permission: string): boolean => {
    return getUserPermissions(user).includes(permission);
};

export const hasAnyPermission = (user: Partial<User> | null | undefined, permissions: string[] = []): boolean => {
    if (!permissions.length) return true;
    const userPermissions = getUserPermissions(user);
    return permissions.some((permission) => userPermissions.includes(permission));
};

export const hasAllPermissions = (user: Partial<User> | null | undefined, permissions: string[] = []): boolean => {
    if (!permissions.length) return true;
    const userPermissions = getUserPermissions(user);
    return permissions.every((permission) => userPermissions.includes(permission));
};

export const ROUTE_PERMISSION_MAP: Record<string, string[]> = {
    '/admin/dashboard': ['access_overview_view'],
    '/admin/users': ['user_view'],
    '/admin/roles': ['role_view'],
    '/admin/permissions': ['permission_view'],
    '/admin/access': ['access_overview_view'],
    '/ml/dashboard': ['model_view'],
    '/ml/datasets': ['model_view'],
    '/ml/graph-stats': ['model_view'],
    '/ml/training': ['model_view'],
    '/ml/performance': ['model_metrics_view'],
    '/ml/registry': ['model_view'],
    '/ml/experiments': ['model_results_view'],
    '/analyst/dashboard': ['aml_results_view'],
    '/analyst/upload': ['account_view'],
    '/analyst/jobs': ['aml_results_view'],
    '/analyst/accounts': ['account_view'],
    '/analyst/investigation': ['investigation_view'],
    '/analyst/network': ['account_view'],
    '/analyst/reports': ['aml_results_view'],
};

export const canAccessRoute = (user: Partial<User> | null | undefined, route: string): boolean => {
    const permissions = ROUTE_PERMISSION_MAP[route];
    if (!permissions) return true;
    return hasAnyPermission(user, permissions);
};

export const isUserRole = (user: Partial<User> | null | undefined, roles: UserRole[]): boolean => {
    if (!user?.role) return false;
    return roles.includes(user.role as UserRole);
};
