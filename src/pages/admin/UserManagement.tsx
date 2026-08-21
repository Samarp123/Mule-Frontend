import React, { useMemo, useState } from 'react';
import { Search, X, UserPlus } from 'lucide-react';
import { UserRole } from '../../types/auth';
import { getStoredUsers, saveStoredUsers } from '../../data/mockUsers';
import { useAuth } from '../../context/AuthContext';
import { roleIdFromUserRole } from '../../data/mockRoles';

interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'Active' | 'Suspended';
    lastActive: string;
}

const INITIAL_USERS: UserRecord[] = getStoredUsers().map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status ?? 'Active',
    lastActive: user.lastLogin ? 'Recently active' : 'Never',
}));

export const UserManagement: React.FC = () => {
    const { user, hasPermission, updateCurrentUser } = useAuth();
    const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
    const roleOptions = ['Admin', 'ML Engineer', 'AML Analyst'];
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'AML Analyst' as UserRole });

    const filteredUsers = useMemo(
        () =>
            users.filter(
                (u) =>
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.role.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [searchTerm, users]
    );

    const saveUsers = (nextUsers: UserRecord[]) => {
        setUsers(nextUsers);
        const persisted = nextUsers.map((entry) => ({
            id: entry.id,
            name: entry.name,
            email: entry.email,
            role: entry.role,
            roleIds: [roleIdFromUserRole(entry.role)],
            status: entry.status,
            department: 'Security Operations',
            lastLogin: new Date().toISOString(),
        }));

        saveStoredUsers(persisted);

        const currentSession = user ? persisted.find((item) => item.email === user.email) ?? null : null;
        if (currentSession && user) {
            updateCurrentUser({ ...user, role: currentSession.role, roleIds: currentSession.roleIds, lastLogin: new Date().toISOString() });
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        const userToAdd: UserRecord = {
            id: `USR-${String(users.length + 1).padStart(3, '0')}`,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: 'Active',
            lastActive: 'Just now',
        };

        saveUsers([...users, userToAdd]);
        setNewUser({ name: '', email: '', role: 'AML Analyst' });
        setShowAddModal(false);
    };

    const toggleStatus = (id: string) => {
        saveUsers(
            users.map((entry) =>
                entry.id === id ? { ...entry, status: entry.status === 'Active' ? 'Suspended' : 'Active', lastActive: 'Just now' } : entry
            )
        );
    };

    const handleRoleChange = (id: string, nextRole: UserRole) => {
        saveUsers(
            users.map((entry) =>
                entry.id === id ? { ...entry, role: nextRole, lastActive: 'Just now' } : entry
            )
        );
    };

    return (
        <div className="space-y-6" data-aos="fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-100">User Management</h1>
                    <p className="text-xs text-slate-400">Manage user identities, access statuses, and assigned role profiles.</p>
                </div>
                {hasPermission('user_create') && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Provision New User</span>
                    </button>
                )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4" data-aos="fade-up" data-aos-delay="50">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filter users by name or email..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                </div>
                <div className="text-xs text-slate-400 font-mono">
                    Showing {filteredUsers.length} of {users.length} registered accounts
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl" data-aos="fade-up" data-aos-delay="100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
                                <th className="py-3 px-4">User ID</th>
                                <th className="py-3 px-4">Name & Email</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Last Activity</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 px-4 font-mono text-slate-400">{user.id}</td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-slate-200">{user.name}</div>
                                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                            disabled={!hasPermission('role_assign')}
                                            className={`rounded border px-2 py-1 text-[10px] font-medium font-mono ${user.role === 'Admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : user.role === 'ML Engineer' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'} disabled:cursor-not-allowed disabled:opacity-60`}
                                        >
                                            {roleOptions.map((roleName) => (
                                                <option key={roleName} value={roleName}>{roleName}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-400 font-mono">{user.lastActive}</td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        {hasPermission('user_deactivate') && (
                                            <button
                                                onClick={() => toggleStatus(user.id)}
                                                className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${user.status === 'Active' ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}
                                            >
                                                {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-blue-400" />
                                Provision New User Account
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-300">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-400 mb-1 font-medium">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    placeholder="e.g. Dr. Alex Morgan"
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-1 font-medium">Corporate Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="alex.m@bank.com"
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-1 font-medium">Assigned Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                                >
                                    {roleOptions.map((roleName) => (
                                        <option key={roleName} value={roleName}>{roleName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};