export interface Role {
    id: string;
    name: string;
    description: string;
    permissionIds: string[];
    isSystemRole: boolean;
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
    admin: [
        'user_view',
        'user_create',
        'user_edit',
        'user_deactivate',
        'role_view',
        'role_create',
        'role_edit',
        'permission_view',
        'permission_assign',
        'model_view',
        'model_version_view',
        'model_metrics_view',
        'model_results_view',
        'aml_results_view',
        'account_view',
        'transaction_view',
        'investigation_view',
        'investigation_update',
        'access_overview_view',
        'role_assign',
        'security_events_view',
        'security_sessions_view',
        'security_sessions_revoke',
        'security_audit_view',
        'security_dashboard_view',
    ],
    ml_engineer: [
        'model_view',
        'model_version_view',
        'model_metrics_view',
        'model_results_view',
        'aml_results_view',
    ],
    aml_analyst: [
        'aml_results_view',
        'account_view',
        'transaction_view',
        'investigation_view',
        'investigation_update',
    ],
    security_analyst: [
        'security_events_view',
        'security_sessions_view',
        'security_sessions_revoke',
        'security_audit_view',
        'security_dashboard_view',
        'user_view',
    ],
};

const baseRoles: Role[] = [
    {
        id: 'admin',
        name: 'Admin',
        description: 'Full administrative access including RBAC governance and model oversight.',
        permissionIds: ROLE_PERMISSIONS.admin,
        isSystemRole: true,
    },
    {
        id: 'ml_engineer',
        name: 'ML Engineer',
        description: 'Responsible for model development, metrics, and ML-side AML workflows.',
        permissionIds: ROLE_PERMISSIONS.ml_engineer,
        isSystemRole: true,
    },
    {
        id: 'aml_analyst',
        name: 'AML Analyst',
        description: 'Analyzes suspicious accounts, mule indicators, and investigator workflows.',
        permissionIds: ROLE_PERMISSIONS.aml_analyst,
        isSystemRole: true,
    },
    {
        id: 'security_analyst',
        name: 'Security Analyst',
        description: 'Monitors security events, investigates alerts, manages sessions, and reviews audit trails.',
        permissionIds: ROLE_PERMISSIONS.security_analyst,
        isSystemRole: true,
    },
];

export const getStoredRoles = (): Role[] => {
    if (typeof window === 'undefined') return [...baseRoles];

    const saved = window.localStorage.getItem('mule_mock_roles');
    if (!saved) return [...baseRoles];

    try {
        const parsed = JSON.parse(saved) as Role[];
        return Array.isArray(parsed) && parsed.length ? parsed : [...baseRoles];
    } catch {
        return [...baseRoles];
    }
};

export const saveStoredRoles = (roles: Role[]) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('mule_mock_roles', JSON.stringify(roles));
    }
    return roles;
};

export let MOCK_ROLES: Role[] = getStoredRoles();

export const normalizeRoleId = (value: string): string => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || `custom_role_${Date.now()}`;
};

export const createCustomRole = (name: string, description: string, permissionIds: string[] = []): Role => {
    const safeName = name.trim();
    if (!safeName) {
        throw new Error('Role name is required.');
    }

    const existing = MOCK_ROLES.find((role) => role.name.toLowerCase() === safeName.toLowerCase());
    if (existing) {
        return existing;
    }

    const newRole: Role = {
        id: normalizeRoleId(safeName),
        name: safeName,
        description: description.trim() || 'Custom role created from the RBAC matrix.',
        permissionIds: Array.from(new Set(permissionIds)),
        isSystemRole: false,
    };

    MOCK_ROLES = [...MOCK_ROLES, newRole];
    saveStoredRoles(MOCK_ROLES);
    return newRole;
};

export const updateRolePermissions = (roleId: string, permissionIds: string[]): Role | null => {
    let updatedRole: Role | null = null;

    MOCK_ROLES = MOCK_ROLES.map((role) => {
        if (role.id !== roleId) return role;

        updatedRole = { ...role, permissionIds: Array.from(new Set(permissionIds)) };
        return updatedRole;
    });

    saveStoredRoles(MOCK_ROLES);
    return updatedRole;
};

export const roleIdFromUserRole = (roleName: string): string => {
    const normalized = roleName.trim();
    if (!normalized) return '';

    const lookup: Record<string, string> = {
        admin: 'admin',
        'ml_engineer': 'ml_engineer',
        'ml engineer': 'ml_engineer',
        'aml_analyst': 'aml_analyst',
        'aml analyst': 'aml_analyst',
        'security_analyst': 'security_analyst',
        'security analyst': 'security_analyst',
    };

    const key = normalized.toLowerCase().replace(/\s+/g, '_');
    const directMatch = MOCK_ROLES.find((role) => role.name.toLowerCase() === normalized.toLowerCase());

    if (lookup[key]) return lookup[key];
    if (directMatch) return directMatch.id;

    return normalizeRoleId(normalized);
};

export const getRoleById = (roleId: string): Role | undefined => MOCK_ROLES.find((role) => role.id === roleId);

export const getPermissionsForRoleIds = (roleIds: string[] = []): string[] => {
    const permissions = new Set<string>();

    roleIds.forEach((roleId) => {
        const role = getRoleById(roleId);
        if (!role) return;

        role.permissionIds.forEach((permissionId) => permissions.add(permissionId));
    });

    return Array.from(permissions);
};

export const getRoleNameFromId = (roleId: string): string => getRoleById(roleId)?.name ?? roleId;
