import React, { useEffect, useMemo, useState } from 'react';
import { networkApi } from '../../api/networkApi';
import { strApi, STRRecord, STRStatus } from '../../api/strApi';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Download,
    FileText,
    RefreshCw,
    Save,
    ShieldCheck,
    XCircle,
} from 'lucide-react';

const statusOptions = ['all', 'DRAFT', 'UNDER_REVIEW', 'APPROVED', 'READY_TO_FILE', 'REJECTED'] as const;
type StatusFilter = (typeof statusOptions)[number];

const statusStyles: Record<STRStatus | 'all', string> = {
    all: 'bg-slate-800 text-slate-200 border border-slate-700',
    DRAFT: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    UNDER_REVIEW: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    APPROVED: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    READY_TO_FILE: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    REJECTED: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
};

const requiredClass = (value: string | undefined) =>
    value && value.trim() ? 'border-slate-700 bg-slate-950/40' : 'border-amber-500/40 bg-amber-500/5';

export const STRs: React.FC = () => {
    const [strs, setStrs] = useState<STRRecord[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<STRRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const draftCount = useMemo(() => strs.filter((entry) => entry.status === 'DRAFT').length, [strs]);

    const refreshStrs = async (filter: StatusFilter = statusFilter) => {
        try {
            setLoading(true);
            const records = await strApi.list({ status: filter === 'all' ? undefined : filter });
            setStrs(records);
            if (!selectedId && records.length > 0) {
                setSelectedId(records[0].id);
                setSelectedRecord(records[0]);
            }
            if (selectedId) {
                const chosen = records.find((record) => record.id === selectedId) || null;
                setSelectedRecord(chosen ?? records[0] ?? null);
            }
        } catch (err) {
            console.error('Failed to load STR list', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const seedDrafts = async () => {
            try {
                const existing = await strApi.list({ status: 'all' });
                const accountRes = await networkApi.listSuspiciousAccounts({ limit: 4 });
                const accounts: Array<{
                    account_id: string;
                    suspicious_value?: number;
                    risk_score?: number;
                    component_id?: string;
                }> = accountRes?.success && Array.isArray(accountRes.accounts) ? accountRes.accounts : [];
                const existingFlags = new Set(existing.map((entry) => entry.flagId));
                const toGenerate = accounts.filter((account: { account_id: string; suspicious_value?: number; risk_score?: number; component_id?: string }) => !existingFlags.has(`flag-${account.account_id}`)).slice(0, 3);

                await Promise.all(
                    toGenerate.map((account) =>
                        strApi.generate({
                            flagId: `flag-${account.account_id}`,
                            accountId: account.account_id,
                            amount: Number(account.suspicious_value || 0),
                            riskScore: Number(account.risk_score || 0),
                            networkId: account.component_id || '',
                        })
                    )
                );
            } catch (err) {
                console.error('Failed to auto-generate STR drafts', err);
            } finally {
                await refreshStrs();
            }
        };

        void seedDrafts();
    }, []);

    useEffect(() => {
        void refreshStrs(statusFilter);
    }, [statusFilter]);

    const updateRecordField = <T extends keyof STRRecord>(field: T, value: STRRecord[T]) => {
        setSelectedRecord((current) => {
            if (!current) return current;
            return { ...current, [field]: value };
        });
    };

    const updateNestedField = (
        section: 'reportingEntity' | 'reportingBranch' | 'groundsOfSuspicion' | 'actionTaken' | 'approval',
        key: string,
        value: string
    ) => {
        setSelectedRecord((current) => {
            if (!current) return current;
            return {
                ...current,
                [section]: {
                    ...(current[section] as Record<string, string>),
                    [key]: value,
                },
            };
        });
    };

    const handleSelect = async (id: string) => {
        setSelectedId(id);
        try {
            const record = await strApi.getById(id);
            setSelectedRecord(record);
        } catch (err) {
            console.error('Failed to fetch STR details', err);
        }
    };

    const handleSave = async () => {
        if (!selectedRecord) return;
        try {
            const updated = await strApi.update(selectedRecord.id, selectedRecord);
            setSelectedRecord(updated);
            setStrs((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
            setActionMessage('Draft saved successfully.');
            setTimeout(() => setActionMessage(null), 3000);
        } catch (err) {
            console.error('Failed to save STR draft', err);
        }
    };

    const handleRegenerateNarrative = () => {
        if (!selectedRecord) return;
        const narrative = `The flagged activity on account ${selectedRecord.accountId} showed elevated risk (${selectedRecord.riskScore.toFixed(2)}) across network ${selectedRecord.networkId}. Transaction activity was concentrated around an amount of ${selectedRecord.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}, supporting the conclusion of rapid pass-through behaviour and suspicious layering.`;

        setSelectedRecord({
            ...selectedRecord,
            groundsOfSuspicion: {
                ...selectedRecord.groundsOfSuspicion,
                narrative,
            },
        });
    };

    const handleApprove = async () => {
        if (!selectedRecord) return;
        try {
            const approved = await strApi.approve(selectedRecord.id, 'analyst');
            setSelectedRecord(approved);
            setStrs((current) => current.map((entry) => (entry.id === approved.id ? approved : entry)));
            setActionMessage('STR approved for filing.');
            setTimeout(() => setActionMessage(null), 3000);
        } catch (err) {
            console.error('Failed to approve STR', err);
        }
    };

    const handleReject = async () => {
        if (!selectedRecord) return;
        const reason = window.prompt('Provide rejection reason', 'Needs analyst review');
        if (!reason) return;

        try {
            const rejected = await strApi.reject(selectedRecord.id, reason, 'analyst');
            setSelectedRecord(rejected);
            setStrs((current) => current.map((entry) => (entry.id === rejected.id ? rejected : entry)));
            setActionMessage('STR rejected and returned for edits.');
            setTimeout(() => setActionMessage(null), 3000);
        } catch (err) {
            console.error('Failed to reject STR', err);
        }
    };

    const handleExportJson = async () => {
        if (!selectedRecord) return;
        try {
            const exported = await strApi.exportJson(selectedRecord.id);
            const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedRecord.id}.json`;
            link.click();
            URL.revokeObjectURL(url);
            setActionMessage('JSON export generated.');
            setTimeout(() => setActionMessage(null), 2500);
        } catch (err) {
            console.error('Failed to export STR', err);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <FileText className="w-3 h-3" /> STR DRAFT WORKFLOW
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">Auto-filled evidence review</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">Suspicious Transaction Reports</h1>
                </div>

                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-300">
                        <AlertTriangle className="w-3 h-3" /> {draftCount} DRAFT
                    </span>
                </div>
            </div>

            {actionMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionMessage}</span>
                </div>
            )}

            <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3 overflow-hidden">
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${statusFilter === status ? statusStyles[status] : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'}`}
                        >
                            {status === 'all' ? 'All statuses' : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6">
                <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">STR queue</div>
                        <button type="button" onClick={() => void refreshStrs()} className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white">
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950/70 text-[10px] uppercase text-slate-400">
                                <tr>
                                    <th className="py-2.5 px-3">STR ID</th>
                                    <th className="py-2.5 px-3">Account</th>
                                    <th className="py-2.5 px-3">Amount</th>
                                    <th className="py-2.5 px-3">Risk</th>
                                    <th className="py-2.5 px-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/70">
                                {strs.map((entry) => (
                                    <tr
                                        key={entry.id}
                                        onClick={() => void handleSelect(entry.id)}
                                        className={`cursor-pointer transition-colors ${selectedId === entry.id ? 'bg-cyan-500/8' : 'hover:bg-slate-800/40'}`}
                                    >
                                        <td className="py-2.5 px-3 font-mono text-cyan-400">{entry.id}</td>
                                        <td className="py-2.5 px-3 font-mono text-slate-200">{entry.accountId}</td>
                                        <td className="py-2.5 px-3 font-mono text-amber-300">${Number(entry.amount || 0).toLocaleString()}</td>
                                        <td className="py-2.5 px-3 font-mono text-rose-400">{(Number(entry.riskScore || 0) * 100).toFixed(0)}%</td>
                                        <td className="py-2.5 px-3">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[entry.status]}`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedRecord ? (
                    <div className="space-y-6">
                        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-4 shadow-xl">
                            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 pb-1">Selected STR</div>
                                    <div className="text-lg font-bold text-slate-100 font-mono">{selectedRecord.id}</div>
                                </div>
                                <div className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[selectedRecord.status]}`}>
                                    {selectedRecord.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 2xl:grid-cols-[1.15fr_0.95fr] gap-6 pt-4">
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-2">Report Details</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Report type</span>
                                                <select
                                                    value={selectedRecord.reportType}
                                                    onChange={(e) => updateRecordField('reportType', e.target.value as 'new' | 'replacement')}
                                                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40"
                                                >
                                                    <option value="new">new</option>
                                                    <option value="replacement">replacement</option>
                                                </select>
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Report date</span>
                                                <input
                                                    value={selectedRecord.reportDate}
                                                    onChange={(e) => updateRecordField('reportDate', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.reportDate)}`}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-2">Reporting entity</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                            <label className="space-y-1 md:col-span-2">
                                                <span className="text-slate-400">Bank name</span>
                                                <input
                                                    value={selectedRecord.reportingEntity.bankName}
                                                    onChange={(e) => updateNestedField('reportingEntity', 'bankName', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.reportingEntity.bankName)}`}
                                                />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Regulator category</span>
                                                <input
                                                    value={selectedRecord.reportingEntity.regulatorCategory}
                                                    onChange={(e) => updateNestedField('reportingEntity', 'regulatorCategory', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.reportingEntity.regulatorCategory)}`}
                                                />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Principal officer</span>
                                                <input
                                                    value={selectedRecord.reportingEntity.principalOfficerName}
                                                    onChange={(e) => updateNestedField('reportingEntity', 'principalOfficerName', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.reportingEntity.principalOfficerName)}`}
                                                />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Designation</span>
                                                <input
                                                    value={selectedRecord.reportingEntity.designation}
                                                    onChange={(e) => updateNestedField('reportingEntity', 'designation', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.reportingEntity.designation)}`}
                                                />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Contact</span>
                                                <input
                                                    value={selectedRecord.reportingEntity.contact}
                                                    onChange={(e) => updateNestedField('reportingEntity', 'contact', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.reportingEntity.contact)}`}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-2">Reporting branch</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Branch name</span>
                                                <input
                                                    value={selectedRecord.reportingBranch.branchName}
                                                    onChange={(e) => updateNestedField('reportingBranch', 'branchName', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.reportingBranch.branchName)}`}
                                                />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Branch ID</span>
                                                <input
                                                    value={selectedRecord.reportingBranch.branchId}
                                                    onChange={(e) => updateNestedField('reportingBranch', 'branchId', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.reportingBranch.branchId)}`}
                                                />
                                            </label>
                                            <label className="space-y-1 md:col-span-2">
                                                <span className="text-slate-400">Branch address</span>
                                                <input
                                                    value={selectedRecord.reportingBranch.address}
                                                    onChange={(e) => updateNestedField('reportingBranch', 'address', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.reportingBranch.address)}`}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-2">Linked accounts</div>
                                        {selectedRecord.linkedAccounts.map((account, index) => (
                                            <div key={`${account.accountNumber}-${index}`} className="mb-3 rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <label className="space-y-1">
                                                        <span className="text-slate-400">Account number</span>
                                                        <input
                                                            value={account.accountNumber}
                                                            onChange={(e) => {
                                                                const next = [...selectedRecord.linkedAccounts];
                                                                next[index] = { ...next[index], accountNumber: e.target.value };
                                                                updateRecordField('linkedAccounts', next);
                                                            }}
                                                            className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(account.accountNumber)}`}
                                                        />
                                                    </label>
                                                    <label className="space-y-1">
                                                        <span className="text-slate-400">Risk score</span>
                                                        <input
                                                            value={account.riskScore}
                                                            onChange={(e) => {
                                                                const next = [...selectedRecord.linkedAccounts];
                                                                next[index] = { ...next[index], riskScore: Number(e.target.value) };
                                                                updateRecordField('linkedAccounts', next);
                                                            }}
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-2">Suspicious transactions</div>
                                        {selectedRecord.suspiciousTransactions.map((transaction, index) => (
                                            <div key={`${transaction.transactionId}-${index}`} className="mb-3 rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <label className="space-y-1">
                                                        <span className="text-slate-400">Transaction ID</span>
                                                        <input
                                                            value={transaction.transactionId}
                                                            onChange={(e) => {
                                                                const next = [...selectedRecord.suspiciousTransactions];
                                                                next[index] = { ...next[index], transactionId: e.target.value };
                                                                updateRecordField('suspiciousTransactions', next);
                                                            }}
                                                            className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(transaction.transactionId)}`}
                                                        />
                                                    </label>
                                                    <label className="space-y-1">
                                                        <span className="text-slate-400">Amount</span>
                                                        <input
                                                            value={transaction.amount}
                                                            onChange={(e) => {
                                                                const next = [...selectedRecord.suspiciousTransactions];
                                                                next[index] = { ...next[index], amount: Number(e.target.value) };
                                                                updateRecordField('suspiciousTransactions', next);
                                                            }}
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">Grounds of suspicion</div>
                                            <button
                                                type="button"
                                                onClick={handleRegenerateNarrative}
                                                className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold text-cyan-300"
                                            >
                                                Regenerate
                                            </button>
                                        </div>
                                        <div className="mt-3 space-y-3 text-xs">
                                            <label className="space-y-1 block">
                                                <span className="text-slate-400">Reason category</span>
                                                <input
                                                    value={selectedRecord.groundsOfSuspicion.reasonCategory}
                                                    onChange={(e) => updateNestedField('groundsOfSuspicion', 'reasonCategory', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.groundsOfSuspicion.reasonCategory)}`}
                                                />
                                            </label>
                                            <label className="space-y-1 block">
                                                <span className="text-slate-400">Narrative</span>
                                                <textarea
                                                    value={selectedRecord.groundsOfSuspicion.narrative}
                                                    onChange={(e) => updateNestedField('groundsOfSuspicion', 'narrative', e.target.value)}
                                                    rows={6}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.groundsOfSuspicion.narrative)}`}
                                                />
                                            </label>
                                            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                                                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Supporting signals</div>
                                                {selectedRecord.groundsOfSuspicion.supportingSignals.map((signal, index) => (
                                                    <div key={`${signal.label}-${index}`} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/50 px-2 py-1.5 text-[11px] text-slate-300">
                                                        <span>{signal.label}</span>
                                                        <span className="font-mono text-cyan-300">{signal.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-2">Action taken</div>
                                        <div className="space-y-3 text-xs">
                                            <label className="space-y-1 block">
                                                <span className="text-slate-400">Account frozen</span>
                                                <input
                                                    value={selectedRecord.actionTaken.accountFrozen}
                                                    onChange={(e) => updateNestedField('actionTaken', 'accountFrozen', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.actionTaken.accountFrozen)}`}
                                                />
                                            </label>
                                            <label className="space-y-1 block">
                                                <span className="text-slate-400">Law enforcement informed</span>
                                                <input
                                                    value={selectedRecord.actionTaken.lawEnforcementInformed}
                                                    onChange={(e) => updateNestedField('actionTaken', 'lawEnforcementInformed', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.actionTaken.lawEnforcementInformed)}`}
                                                />
                                            </label>
                                            <label className="space-y-1 block">
                                                <span className="text-slate-400">Further steps</span>
                                                <textarea
                                                    value={selectedRecord.actionTaken.furtherSteps}
                                                    onChange={(e) => updateNestedField('actionTaken', 'furtherSteps', e.target.value)}
                                                    rows={3}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.actionTaken.furtherSteps)}`}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-2">Approval</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Prepared by</span>
                                                <input
                                                    value={selectedRecord.approval.preparedBy}
                                                    onChange={(e) => updateNestedField('approval', 'preparedBy', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.approval.preparedBy)}`}
                                                />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Reviewed by</span>
                                                <input
                                                    value={selectedRecord.approval.reviewedBy}
                                                    onChange={(e) => updateNestedField('approval', 'reviewedBy', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.approval.reviewedBy)}`}
                                                />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Approved by</span>
                                                <input
                                                    value={selectedRecord.approval.approvedBy}
                                                    onChange={(e) => updateNestedField('approval', 'approvedBy', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.approval.approvedBy)}`}
                                                />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-slate-400">Status</span>
                                                <input
                                                    value={selectedRecord.approval.status}
                                                    onChange={(e) => updateNestedField('approval', 'status', e.target.value)}
                                                    className={`w-full rounded-lg border px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/40 ${requiredClass(selectedRecord.approval.status)}`}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                <span>Evidence cross-check ready</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-xs font-semibold text-white">
                                    <Save className="w-3.5 h-3.5" /> Save draft
                                </button>
                                <button type="button" onClick={handleReject} className="inline-flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300">
                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                                <button type="button" onClick={handleApprove} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve for filing
                                </button>
                                <button type="button" onClick={handleExportJson} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-200">
                                    <Download className="w-3.5 h-3.5" /> JSON
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-8 text-center text-sm text-slate-400">
                        <ArrowRight className="w-5 h-5 mx-auto text-cyan-400" />
                        Select an STR to review the draft.
                    </div>
                )}
            </div>
        </div>
    );
};
