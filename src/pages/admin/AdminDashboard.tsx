import React, { useState } from 'react';
import { Users, ShieldAlert, Cpu, Activity, Clock, CheckCircle, Database } from 'lucide-react';

interface ModelApprovalItem {
    id: string;
    name: string;
    version: string;
    submittedBy: string;
    auc: number;
}

interface AuditItem {
    id: string;
    action: string;
    details: string;
    time: string;
}

export const AdminDashboard: React.FC = () => {
    // State variables default to empty/null states prior to backend integration
    const [activeUsersCount] = useState<number | null>(null);
    const [activeModel] = useState<{ name: string; auc: number; f1: number } | null>(null);
    const [pendingApprovals] = useState<ModelApprovalItem[]>([]);
    const [securityThreatsCount] = useState<number | null>(null);
    const [auditLogs] = useState<AuditItem[]>([]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-100">System Administration Overview</h1>
                    <p className="text-xs text-slate-400">Real-time governance, security telemetry, and model governance metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        Waiting for API Integration
                    </span>
                </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">Active System Users</span>
                        <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">
                        {activeUsersCount !== null ? activeUsersCount : '—'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                        {activeUsersCount !== null ? 'Registered accounts' : 'Unbound metric'}
                    </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">Active Production Model</span>
                        <Cpu className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">
                        {activeModel ? activeModel.name : 'No Active Model'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">
                        {activeModel ? `AUC: ${activeModel.auc} | F1: ${activeModel.f1}` : 'Pending deployment'}
                    </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">Pending Approvals</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">
                        {pendingApprovals.length}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                        Awaiting admin sign-off
                    </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">Security Threats (24h)</span>
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">
                        {securityThreatsCount !== null ? securityThreatsCount : '—'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                        {securityThreatsCount !== null ? 'Monitored events' : 'Gateway unmonitored'}
                    </div>
                </div>
            </div>

            {/* Main Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Approvals Widget */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                            Pending Model Deployment Approvals
                        </h2>
                    </div>

                    {pendingApprovals.length === 0 ? (
                        <div className="p-8 border border-dashed border-slate-800 rounded-lg text-center">
                            <Database className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                            <p className="text-xs text-slate-400 font-medium">No pending candidate models</p>
                            <p className="text-[11px] text-slate-600 mt-1">Submitted models from ML Engineers will appear here for review.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingApprovals.map((item) => (
                                <div key={item.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">{item.version}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-1">Submitted by: <span className="text-slate-300">{item.submittedBy}</span></div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-sans font-medium transition-colors">
                                        Review
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Live System Activity Feed */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        System Audit Feed
                    </h2>

                    {auditLogs.length === 0 ? (
                        <div className="p-8 border border-dashed border-slate-800 rounded-lg text-center">
                            <p className="text-xs text-slate-400 font-medium">No recent audit activity</p>
                            <p className="text-[11px] text-slate-600 mt-1">System events will stream here automatically upon backend integration.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 text-xs">
                            {auditLogs.map((log) => (
                                <div key={log.id} className="border-l-2 border-blue-500 pl-3 py-0.5">
                                    <p className="text-slate-200 font-medium">{log.action}</p>
                                    <p className="text-[11px] text-slate-400">{log.details}</p>
                                    <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};