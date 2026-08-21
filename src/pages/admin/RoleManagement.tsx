import React, { useMemo, useState } from 'react';
import { Shield, Check, Lock, Plus } from 'lucide-react';
import { MOCK_ROLES, createCustomRole, updateRolePermissions } from '../../data/mockRoles';
import { MOCK_PERMISSIONS } from '../../data/mockPermissions';
import { useAuth } from '../../context/AuthContext';

export const RoleManagement: React.FC = () => {
    const { hasPermission } = useAuth();
    const [roles, setRoles] = useState(MOCK_ROLES);
    const [selectedRoleId, setSelectedRoleId] = useState('admin');
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(MOCK_ROLES[0].permissionIds);

    const activeRole = useMemo(
        () => roles.find((role) => role.id === selectedRoleId) ?? roles[0],
        [roles, selectedRoleId]
    );

    React.useEffect(() => {
        const current = roles.find((role) => role.id === selectedRoleId);
        setSelectedPermissions(current?.permissionIds ?? []);
    }, [roles, selectedRoleId]);

    const togglePermissionForRole = (permissionId: string) => {
        setSelectedPermissions((current) =>
            current.includes(permissionId)
                ? current.filter((value) => value !== permissionId)
                : [...current, permissionId]
        );
    };

    const saveRoleChanges = () => {
        if (!activeRole) return;
        const updated = updateRolePermissions(activeRole.id, selectedPermissions) ?? activeRole;
        setRoles((current) => current.map((role) => (role.id === updated.id ? updated : role)));
    };

    const handleCreateCustomRole = () => {
        if (!newRoleName.trim()) return;
        const created = createCustomRole(newRoleName, newRoleDescription, selectedPermissions);
        setRoles(MOCK_ROLES);
        setSelectedRoleId(created.id);
        setNewRoleName('');
        setNewRoleDescription('');
        setSelectedPermissions(created.permissionIds);
    };

    const permissionTable = useMemo(
        () =>
            MOCK_PERMISSIONS.map((permission) => ({
                ...permission,
                isAssigned: selectedPermissions.includes(permission.id),
            })),
        [selectedPermissions]
    );

    return (
        <div className="space-y-6" data-aos="fade-up">
            <div>
                <h1 className="text-xl font-bold text-slate-100">Role & Access Control Matrix</h1>
                <p className="text-xs text-slate-400">Strict Role-Based Access Control (RBAC) governance configuration across system domains.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-aos="fade-up" data-aos-delay="50">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`rounded-xl border p-4 text-left transition-all ${
                            selectedRoleId === role.id
                                ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                                : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                        }`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-slate-100">{role.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">{role.permissionIds.length} perms</span>
                        </div>
                        <p className="mt-2 text-[11px] leading-5 text-slate-400">{role.description}</p>
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl" data-aos="fade-up" data-aos-delay="100">
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-slate-200">System Permission Matrix</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">Policy Version 2.4.0 (Enforced)</span>
                        {hasPermission('role_create') && (
                            <button type="button" className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-300">
                                <Plus className="w-3 h-3" />
                                New Role
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 font-mono">
                                <th className="py-3 px-4">System Module / Domain Privilege</th>
                                <th className="py-3 px-4 text-center">Admin</th>
                                <th className="py-3 px-4 text-center">ML Engineer</th>
                                <th className="py-3 px-4 text-center">AML Analyst</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {permissionTable.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 px-4 text-slate-200 font-medium">
                                        <div>{row.name}</div>
                                        <div className="text-[10px] text-slate-500">{row.module}</div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button type="button" onClick={() => togglePermissionForRole(row.id)} className={`inline-flex p-1 rounded ${row.isAssigned ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-600'}`}>
                                            {row.isAssigned ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4" data-aos="fade-up" data-aos-delay="150">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Selected role</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-100">{activeRole.name}</h3>
                    </div>
                    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[10px] font-mono text-blue-300">
                        {selectedPermissions.length} assigned permissions
                    </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {selectedPermissions.map((permissionId) => (
                        <span key={permissionId} className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] text-slate-300">
                            {permissionId}
                        </span>
                    ))}
                </div>

                {hasPermission('role_edit') && (
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={saveRoleChanges}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                        >
                            Save role permissions
                        </button>
                    </div>
                )}
            </div>

            {hasPermission('role_create') && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4" data-aos="fade-up" data-aos-delay="200">
                    <h3 className="text-sm font-semibold text-slate-100">Create custom role</h3>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <input
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="Role name"
                            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
                        />
                        <input
                            value={newRoleDescription}
                            onChange={(e) => setNewRoleDescription(e.target.value)}
                            placeholder="Description"
                            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleCreateCustomRole}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-500"
                        >
                            Add custom role
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};