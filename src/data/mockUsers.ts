import { User } from '../types/auth';

export const MOCK_USERS: User[] = [
    {
        id: 'usr-001',
        name: 'Sarah Connor',
        email: 'admin@example.com',
        role: 'Admin',
        roleIds: ['admin'],
        status: 'Active',
        department: 'Financial Security & Compliance',
        lastLogin: new Date().toISOString(),
    },
    {
        id: 'usr-002',
        name: 'Alex Rivera',
        email: 'mlengineer@example.com',
        role: 'ML Engineer',
        roleIds: ['ml_engineer'],
        status: 'Active',
        department: 'AI & Heterogeneous Graph Modeling',
        lastLogin: new Date().toISOString(),
    },
    {
        id: 'usr-003',
        name: 'David Chen',
        email: 'analyst@example.com',
        role: 'AML Analyst',
        roleIds: ['aml_analyst'],
        status: 'Active',
        department: 'Mule Account Investigation',
        lastLogin: new Date().toISOString(),
    },
    {
        id: 'usr-004',
        name: 'Elena Rostova',
        email: 'elena.r@example.com',
        role: 'AML Analyst',
        roleIds: ['aml_analyst'],
        status: 'Active',
        department: 'AML Investigations',
        lastLogin: new Date().toISOString(),
    },
    {
        id: 'usr-005',
        name: 'David Kim',
        email: 'd.kim@example.com',
        role: 'ML Engineer',
        roleIds: ['ml_engineer'],
        status: 'Suspended',
        department: 'Model Operations',
        lastLogin: new Date().toISOString(),
    },
];

export const getStoredUsers = (): User[] => {
    if (typeof window === 'undefined') return MOCK_USERS;

    const saved = window.localStorage.getItem('mule_mock_users');
    if (!saved) return [...MOCK_USERS];

    try {
        const parsed = JSON.parse(saved) as User[];
        return Array.isArray(parsed) && parsed.length ? parsed : [...MOCK_USERS];
    } catch {
        return [...MOCK_USERS];
    }
};

export const saveStoredUsers = (users: User[]) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('mule_mock_users', JSON.stringify(users));
    }
    return users;
};

export const MOCK_USERS_BY_EMAIL = Object.fromEntries(MOCK_USERS.map((user) => [user.email.toLowerCase(), user]));

export const DEMO_USERS = MOCK_USERS_BY_EMAIL;
