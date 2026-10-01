import React, { useEffect, useMemo, useState } from 'react';
import { Search, X, UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { UserRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

interface UserRecord {
    id: string;
    rawId?: string;
    username?: string;
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    status: 'Active' | 'Suspended';
    lastActive: string;
}

export const UserManagement: React.FC = () => {
    const { hasPermission } = useAuth();
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const roleOptions = ['Admin', 'ML Engineer', 'AML Analyst'];
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'ML Engineer' as UserRole,
        department: 'AI & Machine Learning',
    });

    const loadUsers = async () => {
        setLoading(true);
        try {
            const apiUsers = await authApi.getUsers();
            setUsers(apiUsers as any);
            setError(null);
        } catch (err: any) {
            console.warn('API error loading users:', err);
            setError('Could not connect to MongoDB database server. Displaying local cache.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(
        () =>
            users.filter(
                (u) =>
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.role.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [searchTerm, users]
    );

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!newUser.username || !newUser.password || !newUser.role) {
            setError('Username, password, and role are required fields.');
            return;
        }

        try {
            await authApi.createUser({
                username: newUser.username.trim(),
                password: newUser.password,
                role: newUser.role,
                name: newUser.name.trim() || newUser.username.trim(),
                email: newUser.email.trim() || `${newUser.username.trim().toLowerCase()}@mule-detector.local`,
                department: newUser.department,
            });

            setSuccessMessage(`User '${newUser.username}' created successfully in MongoDB database with role '${newUser.role}'.`);
            setShowAddModal(false);
            setNewUser({
                username: '',
                password: '',
                name: '',
                email: '',
                role: 'ML Engineer',
                department: 'AI & Machine Learning',
            });

            await loadUsers();

            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to create user in MongoDB database.');
        }
    };

    const toggleStatus = async (userItem: UserRecord) => {
        const targetId = userItem.rawId || userItem.id;
        const nextStatus = userItem.status === 'Active' ? 'Suspended' : 'Active';
        setError(null);
        setSuccessMessage(null);
        setActionLoadingId(userItem.id);

        try {
            const res = await authApi.updateUserStatus(targetId, nextStatus);
            setUsers((prev) =>
                prev.map((u) => (u.id === userItem.id || u.rawId === userItem.rawId ? { ...u, status: nextStatus } : u))
            );
            setSuccessMessage(res.message || `User '${userItem.username || userItem.name}' status updated to ${nextStatus}.`);
            setTimeout(() => setSuccessMessage(null), 4000);
        } catch (err: any) {
            console.error('Error updating status:', err);
            setError(err.response?.data?.error || err.message || 'Failed to update user status in MongoDB.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleRoleChange = async (userItem: UserRecord, nextRole: UserRole) => {
        const targetId = userItem.rawId || userItem.id;
        setError(null);
        setSuccessMessage(null);
        setActionLoadingId(userItem.id);

        try {
            const res = await authApi.updateUserRole(targetId, nextRole);
            setUsers((prev) =>
                prev.map((u) => (u.id === userItem.id || u.rawId === userItem.rawId ? { ...u, role: nextRole } : u))
            );
            setSuccessMessage(res.message || `User '${userItem.username || userItem.name}' role updated to ${nextRole}.`);
            setTimeout(() => setSuccessMessage(null), 4000);
        } catch (err: any) {
            console.error('Error updating role:', err);
            setError(err.response?.data?.error || err.message || 'Failed to update user role in MongoDB.');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-6" data-aos="fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-100">User Management (MongoDB Backed)</h1>
                    <p className="text-xs text-slate-400">Provision user credentials, assign system roles, and securely manage access.</p>
                </div>
                {hasPermission('user_create') && (
                    <button
                        onClick={() => {
                            setError(null);
                            setShowAddModal(true);
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Provision New User</span>
                    </button>
                )}
            </div>

            {successMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by username, name, email, or role..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    {loading ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                            <span>Loading MongoDB database...</span>
                        </>
                    ) : (
                        `Showing ${filteredUsers.length} of ${users.length} registered accounts`
                    )}
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
                                <th className="py-3 px-4">User ID</th>
                                <th className="py-3 px-4">Username</th>
                                <th className="py-3 px-4">Name & Email</th>
                                <th className="py-3 px-4">Assigned Role</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Last Activity</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {filteredUsers.map((userItem) => (
                                <tr key={userItem.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 px-4 font-mono text-slate-400">{userItem.id}</td>
                                    <td className="py-3 px-4 font-mono text-blue-400 font-semibold">{userItem.username || '—'}</td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-slate-200">{userItem.name}</div>
                                        <div className="text-[11px] text-slate-500 font-mono">{userItem.email}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={userItem.role}
                                            onChange={(e) => handleRoleChange(userItem, e.target.value as UserRole)}
                                            disabled={actionLoadingId === userItem.id || !hasPermission('role_assign')}
                                            className={`rounded border px-2 py-1 text-[10px] font-medium font-mono ${
                                                userItem.role === 'Admin'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                                    : userItem.role === 'ML Engineer'
                                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                            } disabled:cursor-not-allowed disabled:opacity-60`}
                                        >
                                            {roleOptions.map((roleName) => (
                                                <option key={roleName} value={roleName}>
                                                    {roleName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                                userItem.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-red-500/10 text-red-400'
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    userItem.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'
                                                }`}
                                            />
                                            {userItem.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-400 font-mono">{userItem.lastActive}</td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        {hasPermission('user_deactivate') && (
                                            <button
                                                onClick={() => toggleStatus(userItem)}
                                                disabled={actionLoadingId === userItem.id}
                                                className={`px-2.5 py-1 rounded text-[11px] border transition-colors inline-flex items-center gap-1.5 ${
                                                    userItem.status === 'Active'
                                                        ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                                        : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {actionLoadingId === userItem.id ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        <span>Updating...</span>
                                                    </>
                                                ) : userItem.status === 'Active' ? (
                                                    'Suspend'
                                                ) : (
                                                    'Activate'
                                                )}
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
                                Create New User (Stored in MongoDB)
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-300">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block text-slate-300 mb-1 font-medium">
                                    Username <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    placeholder="e.g. jdoe"
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 mb-1 font-medium">
                                    Password <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="Enter initial password"
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    placeholder="e.g. Jane Doe"
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="jdoe@company.com"
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 mb-1 font-medium">Role Assignment</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                                >
                                    {roleOptions.map((roleName) => (
                                        <option key={roleName} value={roleName}>
                                            {roleName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
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
