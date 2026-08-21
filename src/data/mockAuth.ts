import { User, UserRole } from '../types/auth';

export const DEMO_USERS: Record<string, User> = {
    'admin@example.com': {
        id: 'usr-001',
        email: 'admin@example.com',
        name: 'Sarah Connor',
        role: 'Admin',
        department: 'Financial Security & Compliance',
        lastLogin: new Date().toISOString(),
    },
    'mlengineer@example.com': {
        id: 'usr-002',
        email: 'mlengineer@example.com',
        name: 'Alex Rivera',
        role: 'ML Engineer',
        department: 'AI & Heterogeneous Graph Modeling',
        lastLogin: new Date().toISOString(),
    },
    'analyst@example.com': {
        id: 'usr-003',
        email: 'analyst@example.com',
        name: 'David Chen',
        role: 'AML Analyst',
        department: 'Mule Account Investigation',
        lastLogin: new Date().toISOString(),
    },
};

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
    'Admin': '/admin/dashboard',
    'ML Engineer': '/ml/dashboard',
    'AML Analyst': '/analyst/dashboard',
};

// Generates a mock JWT token string encoding basic role data
export function createMockJwt(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
        JSON.stringify({
            sub: user.id,
            email: user.email,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8 hours
        })
    );
    const signature = btoa('mule_detector_secret_sig');
    return `${header}.${payload}.${signature}`;
}