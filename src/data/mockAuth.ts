import { User } from '../types/auth';
import { getStoredUsers } from './mockUsers';

export const DEMO_USERS: Record<string, User> = Object.fromEntries(
    getStoredUsers().map((user) => [user.email.toLowerCase(), user])
);

export const ROLE_DEFAULT_ROUTES: Record<string, string> = {
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