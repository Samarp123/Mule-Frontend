import React, { useState } from 'react';
import { networkApi } from '../../api/networkApi';
import {
    Search,
    Lock,
    ExternalLink,
    CheckCircle2,
    ArrowRight,
    FileText,
    History,
    RefreshCw
} from 'lucide-react';

export const Investigation: React.FC = () => {
    const [searchId, setSearchId] = useState('173481::81C5B3690');
    const [dossier, setDossier] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState('');
    const [actionMsg, setActionMsg] = useState<string | null>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchId.trim()) return;

        try {
            setLoading(true);
            const res = await networkApi.getAccountDossier(searchId.trim());
            if (res.success) {
                setDossier(res);
            }
        } catch (err) {
            console.error('Failed to find account dossier', err);
            setDossier(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (actionType: 'freeze' | 'escalate' | 'false_positive' | 'add_to_case') => {
        if (!dossier?.account) return;
        try {
            const res = await networkApi.submitAccountAction(dossier.account.account_id, actionType, note);
            if (res.success) {
                setActionMsg(`Applied action '${actionType}' to account.`);
                setNote('');
                // reload dossier
                handleSearch();
                setTimeout(() => setActionMsg(null), 3500);
            }
        } catch (err) {
            console.error('Action submission failed', err);
        }
    };

    const formatMoney = (v: number) =>
        new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <FileText className="w-3 h-3" /> DOSSIER CASE WORKSTATION
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">Deep-Dive AML Account Analysis</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                        Account Investigation & Evidence File
                    </h1>
                </div>
            </div>

            {/* Account Search Bar */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-md">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Enter target Account ID (e.g. 173481::81C5B3690)..."
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm w-full sm:w-auto"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        <span>Pull Account Dossier</span>
                    </button>
                </form>
            </div>

            {/* Notification alert */}
            {actionMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{actionMsg}</span>
                </div>
            )}

            {/* Dossier Body */}
            {dossier ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Account Summary & Metrics */}
                    <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Target Entity</span>
                                    <h3 className="text-base font-bold font-mono text-slate-100 break-all">
                                        {dossier.account.account_id}
                                    </h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                                    dossier.account.alert_bin === 'red'
                                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                                        : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                }`}>
                                    {(dossier.account.risk_score * 100).toFixed(1)}% Risk
                                </span>
                            </div>

                            {/* Key Stats */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                    <span className="text-[10px] text-slate-400">Network Cluster</span>
                                    <div className="font-mono font-bold text-cyan-400 mt-0.5">
                                        {dossier.account.component_id}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                    <span className="text-[10px] text-slate-400">Topology Role</span>
                                    <div className="font-mono font-bold text-amber-400 mt-0.5">
                                        {dossier.account.role}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                    <span className="text-[10px] text-slate-400">Total Inflow</span>
                                    <div className="font-mono font-bold text-emerald-400 mt-0.5">
                                        {formatMoney(dossier.account.incoming)}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                    <span className="text-[10px] text-slate-400">Total Outflow</span>
                                    <div className="font-mono font-bold text-rose-400 mt-0.5">
                                        {formatMoney(dossier.account.outgoing)}
                                    </div>
                                </div>
                            </div>

                            {/* Investigation Actions Box */}
                            <div className="pt-3 border-t border-slate-800/80 space-y-3">
                                <span className="text-xs font-bold text-slate-200">Enforcement Decisions</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleAction('freeze')}
                                        className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                    >
                                        <Lock className="w-3.5 h-3.5" /> Freeze Account
                                    </button>
                                    <button
                                        onClick={() => handleAction('escalate')}
                                        className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> Escalate SAR
                                    </button>
                                </div>

                                <div className="space-y-1.5">
                                    <input
                                        type="text"
                                        placeholder="Add investigator note..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                                    />
                                    <button
                                        onClick={() => handleAction('add_to_case')}
                                        disabled={!note.trim()}
                                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium transition-colors"
                                    >
                                        Log Case Note
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Audit Log for this account */}
                        {dossier.actions?.length > 0 && (
                            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-lg text-xs space-y-2">
                                <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-2">
                                    <History className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Case Audit Trail</span>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {dossier.actions.map((act: any) => (
                                        <div key={act.id} className="p-2 rounded bg-slate-950/60 border border-slate-800/60 text-[11px] space-y-0.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-cyan-400">{act.status}</span>
                                                <span className="text-[10px] text-slate-500 font-mono">{act.created_at}</span>
                                            </div>
                                            {act.note && <div className="text-slate-400">{act.note}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Direct Evidence & Money Flow Relay Hops */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Direct Edge Transactions */}
                        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md">
                            <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center justify-between">
                                <span>Direct Transaction Counterparties</span>
                                <span className="text-xs text-slate-400 font-mono">{dossier.edges?.length || 0} transfer paths</span>
                            </h3>

                            <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-lg border border-slate-800/60">
                                <table className="w-full text-left text-xs text-slate-300">
                                    <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-800 sticky top-0">
                                        <tr>
                                            <th className="py-2.5 px-3">Flow Direction</th>
                                            <th className="py-2.5 px-3">Transfers</th>
                                            <th className="py-2.5 px-3">Total Amount</th>
                                            <th className="py-2.5 px-3 text-right">Edge Risk</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {dossier.edges?.map((edge: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-800/40">
                                                <td className="py-2.5 px-3 font-mono">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-slate-200">{edge.source_account_id}</span>
                                                        <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                                                        <span className="text-slate-200">{edge.target_account_id}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-3 font-mono text-slate-400">
                                                    {edge.transaction_count} txns
                                                </td>
                                                <td className="py-2.5 px-3 font-mono text-amber-400 font-semibold">
                                                    {formatMoney(edge.amount_paid_total)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-rose-400">
                                                    {(edge.edge_risk_score * 100).toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Relay Flow Paths */}
                        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md">
                            <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center justify-between">
                                <span>Multi-Hop Laundering Relay Paths</span>
                                <span className="text-xs text-slate-400 font-mono">{dossier.paths?.length || 0} matched patterns</span>
                            </h3>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {dossier.paths?.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-slate-500">
                                        No multi-hop relay flows involving this account.
                                    </div>
                                ) : (
                                    dossier.paths?.map((path: any, idx: number) => (
                                        <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 font-mono text-slate-200">
                                                    <span className="text-blue-400">{path.source_account_id}</span>
                                                    <ArrowRight className="w-3 h-3 text-slate-500" />
                                                    <span className="text-amber-400 font-bold">{path.intermediary_account_id}</span>
                                                    <ArrowRight className="w-3 h-3 text-slate-500" />
                                                    <span className="text-purple-400">{path.target_account_id}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-500">
                                                    Gap: {path.gap_hours.toFixed(1)}h · Ratio: {path.amount_ratio.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-amber-400 font-bold">
                                                    {formatMoney(path.out_amount)}
                                                </div>
                                                <div className="text-[10px] text-rose-400 font-mono">
                                                    {(path.path_risk_score * 100).toFixed(1)}% Risk
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-16 text-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-500 text-xs">
                    Search for any account ID to load its comprehensive transaction file and enforcement tools.
                </div>
            )}
        </div>
    );
};