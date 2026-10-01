import React, { useState, useEffect } from 'react';
import { Zap, Search, RefreshCw, Shield, Globe } from 'lucide-react';
import { securityApi } from '../../api/securityApi';

interface RateLimitEntry {
    _id: string;
    ip: string;
    userId: string | null;
    username: string | null;
    endpoint: string;
    requestCount: number;
    windowMs: number;
    timestamp: string;
}

export const RateLimitMonitor: React.FC = () => {
    const [violations, setViolations] = useState<RateLimitEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchViolations();
    }, [page]);

    const fetchViolations = async () => {
        setLoading(true);
        try {
            const filters: Record<string, string> = { page: String(page), limit: '40' };
            if (search) filters.ip = search;
            const data = await securityApi.getRateLimitViolations(filters);
            setViolations(data.violations || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (err) {
            console.error('Failed to fetch violations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchViolations();
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
                    <Zap className="w-5 h-5 text-orange-400" />
                    API Rate Limit Monitor
                </h1>
                <p className="text-xs text-slate-400 mt-1">Track rate-limit violations and throttle enforcement across all API endpoints.</p>
            </div>

            {/* Rate Limit Config Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <Globe className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Global Rate Limit</p>
                        <p className="text-sm font-bold text-slate-100 font-mono">100 req/min per IP</p>
                    </div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                    <p className="text-xs text-slate-400">Login Rate Limit</p>
                    <p className="text-sm font-bold text-slate-100 font-mono">15 req/min per IP</p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                    <p className="text-xs text-slate-400">Response Code</p>
                    <p className="text-sm font-bold text-orange-400 font-mono">HTTP 429</p>
                </div>
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
                        placeholder="Search by IP address..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Violations Table */}
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
                                    <th className="py-3 px-4">IP Address</th>
                                    <th className="py-3 px-4">User</th>
                                    <th className="py-3 px-4">Endpoint</th>
                                    <th className="py-3 px-4">Limit</th>
                                    <th className="py-3 px-4">Window</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {violations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                                            <Shield className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                            No rate-limit violations recorded.
                                        </td>
                                    </tr>
                                ) : (
                                    violations.map((v) => (
                                        <tr key={v._id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="py-3 px-4 text-slate-400">{formatTimestamp(v.timestamp)}</td>
                                            <td className="py-3 px-4 text-orange-400">{v.ip}</td>
                                            <td className="py-3 px-4 text-slate-300 font-sans">{v.username || 'Anonymous'}</td>
                                            <td className="py-3 px-4 text-slate-200">{v.endpoint}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px]">
                                                    {v.requestCount}/min
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-500">{v.windowMs / 1000}s</td>
                                        </tr>
                                    ))
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
