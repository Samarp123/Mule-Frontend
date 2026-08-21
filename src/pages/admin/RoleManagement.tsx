import React from 'react';
import { Shield, Check, Lock } from 'lucide-react';

interface PermissionRow {
    module: string;
    admin: boolean;
    mlEngineer: boolean;
    amlAnalyst: boolean;
}

const PERMISSIONS: PermissionRow[] = [
    { module: 'User Provisioning & Revocation', admin: true, mlEngineer: false, amlAnalyst: false },
    { module: 'System Audit Logs View', admin: true, mlEngineer: false, amlAnalyst: false },
    { module: 'Model Production Approval & Deployment', admin: true, mlEngineer: false, amlAnalyst: false },
    { module: 'R-GCN Hyperparameter Tuning & Training', admin: false, mlEngineer: true, amlAnalyst: false },
    { module: 'Graph Structure Statistics & Schema Explorer', admin: false, mlEngineer: true, amlAnalyst: false },
    { module: 'Experiment Tracking & Checkpoints', admin: false, mlEngineer: true, amlAnalyst: false },
    { module: 'CSV Dataset Upload & Parsing', admin: false, mlEngineer: false, amlAnalyst: true },
    { module: 'Batch Suspicious Account Detection Jobs', admin: false, mlEngineer: false, amlAnalyst: true },
    { module: 'Heterogeneous Subgraph Investigation', admin: false, mlEngineer: false, amlAnalyst: true },
    { module: 'SAR Report Generation & PDF Export', admin: false, mlEngineer: false, amlAnalyst: true },
];

export const RoleManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-100">Role & Access Control Matrix</h1>
                <p className="text-xs text-slate-400">Strict Role-Based Access Control (RBAC) governance configuration across system domains.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-slate-200">System Permission Matrix</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">Policy Version 2.4.0 (Enforced)</span>
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
                            {PERMISSIONS.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 px-4 text-slate-200 font-medium">{row.module}</td>
                                    <td className="py-3 px-4 text-center">
                                        {row.admin ? (
                                            <span className="inline-flex p-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded">
                                                <Check className="w-3.5 h-3.5" />
                                            </span>
                                        ) : (
                                            <span className="inline-flex p-1 bg-slate-800 text-slate-600 rounded">
                                                <Lock className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {row.mlEngineer ? (
                                            <span className="inline-flex p-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded">
                                                <Check className="w-3.5 h-3.5" />
                                            </span>
                                        ) : (
                                            <span className="inline-flex p-1 bg-slate-800 text-slate-600 rounded">
                                                <Lock className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {row.amlAnalyst ? (
                                            <span className="inline-flex p-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                                                <Check className="w-3.5 h-3.5" />
                                            </span>
                                        ) : (
                                            <span className="inline-flex p-1 bg-slate-800 text-slate-600 rounded">
                                                <Lock className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};