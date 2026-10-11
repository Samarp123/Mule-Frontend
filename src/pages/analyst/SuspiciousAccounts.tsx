import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { networkApi } from '../../api/networkApi';
import {
    AlertOctagon,
    Search,
    Download,
    Lock,
    ExternalLink,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Share2,
    CheckCircle2
} from 'lucide-react';

export const SuspiciousAccounts: React.FC = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [alertBin, setAlertBin] = useState<'all' | 'red' | 'yellow'>('all');
    const [page, setPage] = useState(0);
    const limit = 25;
    const [actionMsg, setActionMsg] = useState<string | null>(null);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const res = await networkApi.listSuspiciousAccounts({
                limit,
                offset: page * limit,
                search: search.trim() || undefined,
                alert_bin: alertBin === 'all' ? undefined : alertBin,
            });
            if (res.success) {
                setAccounts(res.accounts || []);
                setTotal(res.total || 0);
            }
        } catch (err) {
            console.error('Failed to fetch suspicious accounts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [page, alertBin]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchAccounts();
    };

    const handleAction = async (accountId: string, actionType: 'freeze' | 'escalate') => {
        try {
            await networkApi.submitAccountAction(accountId, actionType);
            setActionMsg(`Account ${accountId} marked as ${actionType === 'freeze' ? 'Frozen' : 'Escalated'}`);
            setTimeout(() => setActionMsg(null), 3500);
        } catch (err) {
            console.error('Action failed', err);
        }
    };

    const handleExport = () => {
        if (!accounts.length) return;
        const csv = [
            'account_id,risk_score,alert_bin,component_id,network_score',
            ...accounts.map(a => `"${a.account_id}",${a.risk_score},"${a.alert_bin}","${a.component_id}",${a.network_score || ''}`)
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `suspicious_accounts_page_${page + 1}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                            <AlertOctagon className="w-3 h-3" /> FLAGGED MULE REGISTRY
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">50,000 High-Risk Entities</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                        Suspicious Mule Accounts Directory
                    </h1>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all shadow-sm"
                    >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={fetchAccounts}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Reload"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Notification alert */}
            {actionMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{actionMsg}</span>
                </div>
            )}

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Alert Bin Tabs */}
                <div className="flex items-center gap-2 self-start md:self-center">
                    <button
                        onClick={() => { setAlertBin('all'); setPage(0); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            alertBin === 'all'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
                        }`}
                    >
                        All Categories ({total > 0 && alertBin === 'all' ? total.toLocaleString() : '50,000'})
                    </button>
                    <button
                        onClick={() => { setAlertBin('red'); setPage(0); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            alertBin === 'red'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
                        }`}
                    >
                        Red Flag (≥ 0.80)
                    </button>
                    <button
                        onClick={() => { setAlertBin('yellow'); setPage(0); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            alertBin === 'yellow'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
                        }`}
                    >
                        Yellow Watch (0.55 - 0.79)
                    </button>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Account ID or Network..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                </form>
            </div>

            {/* Table */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-800">
                            <tr>
                                <th className="py-3 px-4">Account ID</th>
                                <th className="py-3 px-4">Mule Risk Score</th>
                                <th className="py-3 px-4">Risk Category</th>
                                <th className="py-3 px-4">Associated Network</th>
                                <th className="py-3 px-4">Cluster Size</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                                        Retrieving flagged accounts from database...
                                    </td>
                                </tr>
                            ) : accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                                        No flagged accounts match your search filters.
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((acc) => {
                                    const scorePct = (acc.risk_score * 100).toFixed(1);
                                    const isRed = acc.alert_bin === 'red' || acc.risk_score >= 0.80;

                                    return (
                                        <tr key={acc.account_id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3 px-4 font-mono font-medium text-slate-200">
                                                {acc.account_id}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={`h-full ${isRed ? 'bg-rose-500' : 'bg-amber-400'}`}
                                                            style={{ width: `${scorePct}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-mono font-bold text-slate-200">{scorePct}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                                        isRed
                                                            ? 'text-rose-400 bg-rose-500/15 border-rose-500/30'
                                                            : 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                                                    }`}
                                                >
                                                    {isRed ? 'RED TIER' : 'YELLOW TIER'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-cyan-400 hover:underline cursor-pointer"
                                                onClick={() => navigate('/analyst/dashboard')}
                                            >
                                                {acc.component_id}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-400">
                                                {acc.account_count ? `${acc.account_count} accounts` : '—'}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => navigate('/analyst/dashboard')}
                                                        className="p-1.5 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300"
                                                        title="Investigate in Network Graph"
                                                    >
                                                        <Share2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(acc.account_id, 'freeze')}
                                                        className="px-2 py-1 rounded bg-rose-600/80 hover:bg-rose-500 text-white text-[10px] font-medium flex items-center gap-1 shadow-sm"
                                                    >
                                                        <Lock className="w-2.5 h-2.5" /> Freeze
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(acc.account_id, 'escalate')}
                                                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium flex items-center gap-1"
                                                    >
                                                        <ExternalLink className="w-2.5 h-2.5" /> SAR
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
                    <div>
                        Showing <strong className="text-slate-200">{accounts.length ? page * limit + 1 : 0}</strong> -{' '}
                        <strong className="text-slate-200">{Math.min((page + 1) * limit, total)}</strong> of{' '}
                        <strong className="text-slate-200">{total.toLocaleString()}</strong> flagged accounts
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled={page === 0 || loading}
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-2 text-xs font-mono">
                            Page {page + 1} of {Math.max(1, totalPages)}
                        </span>
                        <button
                            disabled={page >= totalPages - 1 || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};