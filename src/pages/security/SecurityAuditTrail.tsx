import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, ChevronDown, ChevronRight, RefreshCw, Shield } from 'lucide-react';
import { securityApi } from '../../api/securityApi';

interface AuditLogEntry {
    _id: string;
    action: string;
    category: string;
    actor: { username: string; role: string; ip: string };
    target: { type: string; id: string; name: string };
    changes: { before: Record<string, unknown> | null; after: Record<string, unknown> | null };
    description: string;
    timestamp: string;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    auth: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    rbac: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    security: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    session: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
    model: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    config: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
};

export const SecurityAuditTrail: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        fetchLogs();
    }, [page, categoryFilter]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const filters: Record<string, string> = { page: String(page), limit: '40' };
            if (categoryFilter) filters.category = categoryFilter;
            if (search) filters.actor = search;
            const data = await securityApi.getAuditLogs(filters);
            setLogs(data.logs || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (err) {
            console.error('Failed to fetch audit logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchLogs();
    };

    const exportCsv = () => {
        const headers = ['Timestamp', 'Action', 'Category', 'Actor', 'Role', 'Target', 'IP', 'Description'];
        const rows = logs.map((l) => [
            new Date(l.timestamp).toISOString(),
            l.action,
            l.category,
            l.actor?.username || '',
            l.actor?.role || '',
            l.target?.name || '',
            l.actor?.ip || '',
            l.description,
        ]);
        const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatTimestamp = (ts: string) => {
        return new Date(ts).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-400" />
                        Immutable Audit Trail
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Tamper-proof security event record. Logs cannot be modified or deleted.</p>
                </div>
                <button
                    onClick={exportCsv}
                    className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                >
                    <Download className="w-4 h-4 text-teal-400" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search by actor or action..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                >
                    <option value="">All Categories</option>
                    <option value="auth">Authentication</option>
                    <option value="rbac">RBAC</option>
                    <option value="security">Security</option>
                    <option value="session">Session</option>
                    <option value="model">Model</option>
                    <option value="config">Config</option>
                </select>
                <button
                    onClick={handleSearch}
                    className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Audit Log Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                                    <th className="py-3 px-4 w-8"></th>
                                    <th className="py-3 px-4">Timestamp</th>
                                    <th className="py-3 px-4">Action</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Actor</th>
                                    <th className="py-3 px-4">Target</th>
                                    <th className="py-3 px-4">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                                            <Shield className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                            No audit logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => {
                                        const catStyle = CATEGORY_STYLES[log.category] || CATEGORY_STYLES.auth;
                                        const isExpanded = expandedRow === log._id;
                                        const hasChanges = log.changes?.before || log.changes?.after;

                                        return (
                                            <React.Fragment key={log._id}>
                                                <tr
                                                    className={`hover:bg-slate-800/30 transition-colors ${hasChanges ? 'cursor-pointer' : ''}`}
                                                    onClick={() => hasChanges && setExpandedRow(isExpanded ? null : log._id)}
                                                >
                                                    <td className="py-3 px-4 text-slate-500">
                                                        {hasChanges ? (
                                                            isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
                                                        ) : null}
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{formatTimestamp(log.timestamp)}</td>
                                                    <td className="py-3 px-4 text-blue-400 font-mono">{log.action}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${catStyle.bg} ${catStyle.text} border ${catStyle.border}`}>
                                                            {log.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-200 font-medium">{log.actor?.username || 'system'}</td>
                                                    <td className="py-3 px-4 text-slate-300">{log.target?.name || '—'}</td>
                                                    <td className="py-3 px-4 text-slate-500 font-mono">{log.actor?.ip || '—'}</td>
                                                </tr>
                                                {isExpanded && hasChanges && (
                                                    <tr className="bg-slate-950/60">
                                                        <td colSpan={7} className="px-8 py-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                                                                {log.changes.before && (
                                                                    <div>
                                                                        <p className="text-red-400 font-mono font-semibold mb-1">Before:</p>
                                                                        <pre className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-300 overflow-auto font-mono">
                                                                            {JSON.stringify(log.changes.before, null, 2)}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                                {log.changes.after && (
                                                                    <div>
                                                                        <p className="text-emerald-400 font-mono font-semibold mb-1">After:</p>
                                                                        <pre className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-300 overflow-auto font-mono">
                                                                            {JSON.stringify(log.changes.after, null, 2)}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {log.description && (
                                                                <p className="mt-2 text-slate-400 text-[11px]">{log.description}</p>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
                        <span>Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-300 transition-colors">Previous</button>
                            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-300 transition-colors">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
