import React from 'react';
import { usePermission } from '../../hooks/usePermission';

interface PermissionGateProps {
    permission?: string;
    permissions?: string[];
    any?: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
    permission,
    permissions,
    any = false,
    children,
    fallback = null,
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

    let allowed = true;

    if (permission) {
        allowed = hasPermission(permission);
    }

    if (permissions && permissions.length > 0) {
        allowed = any ? hasAnyPermission(permissions) : hasAllPermissions(permissions);
    }

    return <>{allowed ? children : fallback}</>;
};
