import { User } from '../types/auth';
import { getStoredUsers } from './mockUsers';

export const DEMO_USERS: Record<string, User> = Object.fromEntries(
    getStoredUsers().flatMap((user) => {
        const identifiers = [user.email, user.username].filter(Boolean) as string[];
        return identifiers.map((identifier) => [identifier.toLowerCase(), user]);
    })
);

export const DEMO_PASSWORDS: Record<string, string> = {
    admin: 'admin123',
    'admin@example.com': 'admin123',
    mlengineer: 'password123',
    'mlengineer@example.com': 'password123',
    analyst: 'password123',
    'analyst@example.com': 'password123',
    securityanalyst: 'password123',
    'securityanalyst@example.com': 'password123',
};

export const ROLE_DEFAULT_ROUTES: Record<string, string> = {
    'Admin': '/admin/dashboard',
    'ML Engineer': '/ml/dashboard',
    'AML Analyst': '/analyst/dashboard',
    'Security Analyst': '/security/dashboard',
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
