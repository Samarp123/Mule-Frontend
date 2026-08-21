import React from 'react';
import { Lock, ShieldAlert, KeyRound, Server, RefreshCw } from 'lucide-react';

export const SecurityMonitoring: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-100">Security Telemetry & API Rate Limits</h1>
                <p className="text-xs text-slate-400">Live API gateway health, JWT token expirations, and IP filtering rules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-xs font-medium">API Gateway Health</span>
                        <Server className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-emerald-400 font-mono">100.0% Uptime</div>
                    <div className="text-[11px] text-slate-500 mt-1">FastAPI Backend (Port 8000)</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-xs font-medium">Active JWT Sessions</span>
                        <KeyRound className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xl font-bold text-slate-100 font-mono">4 Sessions</div>
                    <div className="text-[11px] text-slate-500 mt-1">HS256 Standard Signature</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-xs font-medium">Failed Logins (24h)</span>
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl font-bold text-slate-100 font-mono">1 Attempt</div>
                    <div className="text-[11px] text-slate-500 mt-1">Auto IP Throttle Active</div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-slate-100">Blocked IP Rules & Throttle Enforcement</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                                <th className="py-2.5 px-3">IP Address</th>
                                <th className="py-2.5 px-3">Trigger Reason</th>
                                <th className="py-2.5 px-3">Timestamp</th>
                                <th className="py-2.5 px-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <tr>
                                <td className="py-2.5 px-3 font-mono text-slate-300">192.168.1.104</td>
                                <td className="py-2.5 px-3 text-slate-400">Rate Limit Exceeded (100 req/min)</td>
                                <td className="py-2.5 px-3 font-mono text-slate-500">21-08-2026 19:42</td>
                                <td className="py-2.5 px-3 text-right">
                                    <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]">
                                        Unblock IP
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};