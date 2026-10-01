export interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
}

export const MOCK_PERMISSIONS: Permission[] = [
    { id: 'user_view', name: 'USER_VIEW', description: 'View users', module: 'User Management' },
    { id: 'user_create', name: 'USER_CREATE', description: 'Create new users', module: 'User Management' },
    { id: 'user_edit', name: 'USER_EDIT', description: 'Edit user details', module: 'User Management' },
    { id: 'user_deactivate', name: 'USER_DEACTIVATE', description: 'Deactivate or reactivate users', module: 'User Management' },

    { id: 'role_view', name: 'ROLE_VIEW', description: 'View roles and mappings', module: 'Role Management' },
    { id: 'role_create', name: 'ROLE_CREATE', description: 'Create custom roles', module: 'Role Management' },
    { id: 'role_edit', name: 'ROLE_EDIT', description: 'Edit role settings and permissions', module: 'Role Management' },

    { id: 'permission_view', name: 'PERMISSION_VIEW', description: 'View available permissions', module: 'Permission Management' },
    { id: 'permission_assign', name: 'PERMISSION_ASSIGN', description: 'Assign or remove permissions', module: 'Permission Management' },

    { id: 'model_view', name: 'MODEL_VIEW', description: 'View models and model metadata', module: 'Model / ML' },
    { id: 'model_version_view', name: 'MODEL_VERSION_VIEW', description: 'View model versions', module: 'Model / ML' },
    { id: 'model_metrics_view', name: 'MODEL_METRICS_VIEW', description: 'View model performance metrics', module: 'Model / ML' },
    { id: 'model_results_view', name: 'MODEL_RESULTS_VIEW', description: 'View prediction and model results', module: 'Model / ML' },

    { id: 'aml_results_view', name: 'AML_RESULTS_VIEW', description: 'View AML monitoring results', module: 'AML Analysis' },
    { id: 'account_view', name: 'ACCOUNT_VIEW', description: 'View suspicious and mule account details', module: 'AML Analysis' },
    { id: 'transaction_view', name: 'TRANSACTION_VIEW', description: 'View transaction data for investigation', module: 'AML Analysis' },
    { id: 'investigation_view', name: 'INVESTIGATION_VIEW', description: 'View investigation cases and analytics', module: 'AML Analysis' },
    { id: 'investigation_update', name: 'INVESTIGATION_UPDATE', description: 'Update investigation status and notes', module: 'AML Analysis' },

    { id: 'access_overview_view', name: 'ACCESS_OVERVIEW_VIEW', description: 'View RBAC access overview and mappings', module: 'RBAC / Access' },
    { id: 'role_assign', name: 'ROLE_ASSIGN', description: 'Assign or change roles for users', module: 'RBAC / Access' },

    { id: 'security_events_view', name: 'SECURITY_EVENTS_VIEW', description: 'View login attempts and security alerts', module: 'Security' },
    { id: 'security_sessions_view', name: 'SECURITY_SESSIONS_VIEW', description: 'View active user sessions', module: 'Security' },
    { id: 'security_sessions_revoke', name: 'SECURITY_SESSIONS_REVOKE', description: 'Revoke active sessions / force logout', module: 'Security' },
    { id: 'security_audit_view', name: 'SECURITY_AUDIT_VIEW', description: 'View immutable security audit logs', module: 'Security' },
    { id: 'security_dashboard_view', name: 'SECURITY_DASHBOARD_VIEW', description: 'View security dashboard overview', module: 'Security' },
];

export const PERMISSION_MAP = Object.fromEntries(MOCK_PERMISSIONS.map((permission) => [permission.id, permission]));

export const ALL_PERMISSION_IDS = MOCK_PERMISSIONS.map((permission) => permission.id);
