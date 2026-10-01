import React, { useState, useEffect } from 'react';
import { Search, LogIn, CheckCircle, XCircle, Monitor, RefreshCw } from 'lucide-react';
import { securityApi } from '../../api/securityApi';

interface LoginAttemptEntry {
    _id: string;
    username: string;
    ip: string;
    userAgent: string;
    location: string;
    success: boolean;
    failureReason: string | null;
    timestamp: string;
}

export const LoginActivity: React.FC = () => {
    const [attempts, setAttempts] = useState<LoginAttemptEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchAttempts();
    }, [page, statusFilter]);

    const fetchAttempts = async () => {
        setLoading(true);
        try {
            const filters: Record<string, string> = { page: String(page), limit: '30' };
            if (statusFilter) filters.status = statusFilter;
            if (search) filters.username = search;
            const data = await securityApi.getLoginAttempts(filters);
            setAttempts(data.attempts || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (err) {
            console.error('Failed to fetch login attempts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchAttempts();
    };

    const formatTimestamp = (ts: string) => {
        return new Date(ts).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <LogIn className="w-5 h-5 text-teal-400" />
                    Login Activity Monitor
                </h1>
                <p className="text-xs text-slate-400 mt-1">Complete audit trail of every authentication attempt across the platform.</p>
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
                        placeholder="Search by username or IP..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                >
                    <option value="">All Status</option>
                    <option value="success">Success</option>
                    <option value="failure">Failure</option>
                </select>
                <button
                    onClick={handleSearch}
                    className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-mono">
                            <thead>
                                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                                    <th className="py-3 px-4">Timestamp</th>
                                    <th className="py-3 px-4">Username</th>
                                    <th className="py-3 px-4">IP Address</th>
                                    <th className="py-3 px-4">Device</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Failure Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {attempts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                                            No login attempts recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    attempts.map((attempt) => (
                                        <tr key={attempt._id} className={`hover:bg-slate-800/30 transition-colors ${!attempt.success ? 'bg-red-950/10' : ''}`}>
                                            <td className="py-3 px-4 text-slate-400">{formatTimestamp(attempt.timestamp)}</td>
                                            <td className="py-3 px-4 text-slate-200 font-sans font-medium">{attempt.username}</td>
                                            <td className="py-3 px-4 text-slate-400">{attempt.ip}</td>
                                            <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                                                <Monitor className="w-3 h-3" />
                                                {attempt.location || 'Unknown'}
                                            </td>
                                            <td className="py-3 px-4">
                                                {attempt.success ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                                                        <CheckCircle className="w-3 h-3" /> Success
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 text-[10px]">
                                                        <XCircle className="w-3 h-3" /> Failed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-slate-500 font-sans">{attempt.failureReason || '—'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
                        <span>Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-300 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-300 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
