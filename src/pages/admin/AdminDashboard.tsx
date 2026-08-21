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

const MOCK_APPROVALS: ModelApprovalItem[] = [
    { id: 'APP-102', name: 'GraphRNN AML Risk Model', version: 'v2.4.1', submittedBy: 'Alex Rivera', auc: 0.972 },
    { id: 'APP-104', name: 'Mule Account Link Predictor', version: 'v3.0.0', submittedBy: 'Nadia Lopez', auc: 0.961 },
    { id: 'APP-107', name: 'Transaction Anomaly Ensemble', version: 'v1.8.2', submittedBy: 'Priya Shah', auc: 0.948 },
];

const MOCK_AUDIT: AuditItem[] = [
    { id: 'AUD-01', action: 'Role privilege update', details: 'Admin assigned ROLE_ASSIGN to Compliance Ops', time: '2 min ago' },
    { id: 'AUD-02', action: 'Model review requested', details: 'GraphRNN AML Risk Model moved to approval queue', time: '11 min ago' },
    { id: 'AUD-03', action: 'Suspicious transaction flagged', details: '7 accounts moved to investigation queue', time: '31 min ago' },
];

export const AdminDashboard: React.FC = () => {
    const [activeUsersCount] = useState<number>(142);
    const [activeModel] = useState<{ name: string; auc: number; f1: number }>({ name: 'GraphRNN AML Risk Model', auc: 0.972, f1: 0.944 });
    const [pendingApprovals] = useState<ModelApprovalItem[]>(MOCK_APPROVALS);
    const [securityThreatsCount] = useState<number>(9);
    const [auditLogs] = useState<AuditItem[]>(MOCK_AUDIT);

    return (
        <div className="space-y-6" data-aos="fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-100">System Administration Overview</h1>
                    <p className="text-xs text-slate-400">Real-time governance, security telemetry, and model governance metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Monitoring active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl" data-aos="zoom-in" data-aos-delay="50">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">Active System Users</span>
                        <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">{activeUsersCount}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Registered accounts</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl" data-aos="zoom-in" data-aos-delay="75">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">Active Production Model</span>
                        <Cpu className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-lg font-bold text-slate-100 font-mono">{activeModel.name}</div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">AUC: {activeModel.auc} | F1: {activeModel.f1}</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl" data-aos="zoom-in" data-aos-delay="100">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">Pending Approvals</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">{pendingApprovals.length}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Awaiting admin sign-off</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl" data-aos="zoom-in" data-aos-delay="125">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">Security Threats (24h)</span>
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-100 font-mono">{securityThreatsCount}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Monitored events</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5" data-aos="fade-up" data-aos-delay="150">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                            Pending Model Deployment Approvals
                        </h2>
                    </div>

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
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" data-aos="fade-up" data-aos-delay="175">
                    <h2 className="text-sm font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        System Audit Feed
                    </h2>

                    <div className="space-y-4 text-xs">
                        {auditLogs.map((log) => (
                            <div key={log.id} className="border-l-2 border-blue-500 pl-3 py-0.5">
                                <p className="text-slate-200 font-medium">{log.action}</p>
                                <p className="text-[11px] text-slate-400">{log.details}</p>
                                <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                        <Database className="w-4 h-4 text-sky-400" />
                        Governance Summary
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-slate-500">Risk policy health</p>
                        <p className="mt-2 text-lg font-semibold text-emerald-400">98.6%</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-slate-500">Open escalations</p>
                        <p className="mt-2 text-lg font-semibold text-amber-400">14</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-slate-500">False positive reduction</p>
                        <p className="mt-2 text-lg font-semibold text-blue-400">41.2%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};