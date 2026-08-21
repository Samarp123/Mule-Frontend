import React, { useState } from 'react';
import { FileSpreadsheet, Search, Download, Filter } from 'lucide-react';

interface AuditLogEntry {
    id: string;
    timestamp: string;
    actor: string;
    role: string;
    action: string;
    resource: string;
    ip: string;
    status: 'Success' | 'Denied';
}

const LOGS: AuditLogEntry[] = [
    { id: 'LOG-8801', timestamp: '21-08-2026 20:14:02', actor: 'admin@example.com', role: 'Admin', action: 'ROLE_UPDATE', resource: 'User: m.johnson', ip: '10.0.0.12', status: 'Success' },
    { id: 'LOG-8800', timestamp: '21-08-2026 19:55:10', actor: 'ml@example.com', role: 'ML Engineer', action: 'MODEL_SUBMIT', resource: 'Model: R-GCN v2.5-rc1', ip: '10.0.0.45', status: 'Success' },
    { id: 'LOG-8799', timestamp: '21-08-2026 19:12:44', actor: 'analyst@example.com', role: 'AML Analyst', action: 'SAR_REPORT_EXPORT', resource: 'Account: ACC-001245', ip: '10.0.0.88', status: 'Success' },
    { id: 'LOG-8798', timestamp: '21-08-2026 18:04:19', actor: 'unknown_ip', role: 'Guest', action: 'UNAUTHORIZED_API_ACCESS', resource: '/api/v1/ml/train', ip: '192.168.1.104', status: 'Denied' },
];

export const AuditLogs: React.FC = () => {
    const [filter, setFilter] = useState('');

    const filtered = LOGS.filter(l =>
        l.actor.toLowerCase().includes(filter.toLowerCase()) ||
        l.action.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-100">Immutable Audit Logs</h1>
                    <p className="text-xs text-slate-400">Cryptographically verifiable event record for compliance and auditing.</p>
                </div>
                <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-medium transition-colors">
                    <Download className="w-4 h-4 text-blue-400" />
                    <span>Export Audit CSV</span>
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search log by actor or action..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead>
                            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                                <th className="py-3 px-4">Event ID</th>
                                <th className="py-3 px-4">Timestamp</th>
                                <th className="py-3 px-4">Actor</th>
                                <th className="py-3 px-4">Action</th>
                                <th className="py-3 px-4">Resource Target</th>
                                <th className="py-3 px-4">IP</th>
                                <th className="py-3 px-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {filtered.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 px-4 text-slate-500">{log.id}</td>
                                    <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                                    <td className="py-3 px-4 text-slate-200 font-sans font-medium">{log.actor}</td>
                                    <td className="py-3 px-4 text-blue-400">{log.action}</td>
                                    <td className="py-3 px-4 text-slate-300">{log.resource}</td>
                                    <td className="py-3 px-4 text-slate-500">{log.ip}</td>
                                    <td className="py-3 px-4 text-right">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                            }`}>
                                            {log.status}
                                        </span>
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