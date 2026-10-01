import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, CheckCircle, RefreshCw } from 'lucide-react';
import { securityApi } from '../../api/securityApi';

interface SecurityAlertEntry {
    _id: string;
    type: string;
    severity: string;
    description: string;
    status: string;
    targetIp: string | null;
    targetUser: { username?: string; name?: string } | null;
    details: Record<string, unknown>;
    resolvedBy: { username?: string } | null;
    resolvedAt: string | null;
    createdAt: string;
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
};

const TYPE_LABELS: Record<string, string> = {
    brute_force: 'Brute Force Attack',
    rate_limit: 'Rate Limit Exceeded',
    suspicious_session: 'Suspicious Session',
    account_locked: 'Account Locked',
};

export const SecurityAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<SecurityAlertEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchAlerts();
    }, [statusFilter, typeFilter]);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const filters: Record<string, string> = { limit: '50' };
            if (statusFilter) filters.status = statusFilter;
            if (typeFilter) filters.type = typeFilter;
            const data = await securityApi.getAlerts(filters);
            setAlerts(data.alerts || []);
        } catch (err) {
            console.error('Failed to fetch alerts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcknowledge = async (id: string, newStatus: 'acknowledged' | 'resolved') => {
        setActionLoading(id);
        try {
            await securityApi.acknowledgeAlert(id, newStatus);
            await fetchAlerts();
        } catch (err) {
            console.error('Failed to update alert:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const formatTime = (ts: string) => {
        return new Date(ts).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Security Alerts
                </h1>
                <p className="text-xs text-slate-400 mt-1">Brute-force detections, rate-limit violations, and suspicious activity alerts.</p>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="resolved">Resolved</option>
                </select>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                >
                    <option value="">All Types</option>
                    <option value="brute_force">Brute Force</option>
                    <option value="rate_limit">Rate Limit</option>
                    <option value="suspicious_session">Suspicious Session</option>
                </select>
                <button
                    onClick={fetchAlerts}
                    className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Alerts List */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : alerts.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <Shield className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="text-sm text-slate-400 font-mono">No security alerts found.</p>
                    <p className="text-xs text-slate-500 mt-1">All systems operating normally.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {alerts.map((alert) => {
                        const sev = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.medium;
                        return (
                            <div key={alert._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${sev.bg} ${sev.text} border ${sev.border}`}>
                                                {alert.severity.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-slate-300 font-medium">
                                                {TYPE_LABELS[alert.type] || alert.type}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                                alert.status === 'active' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                                                alert.status === 'acknowledged' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                            }`}>
                                                {alert.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-300 mb-2">{alert.description}</p>
                                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 font-mono">
                                            <span>Time: {formatTime(alert.createdAt)}</span>
                                            {alert.targetIp && <span>IP: {alert.targetIp}</span>}
                                            {alert.targetUser?.username && <span>User: {alert.targetUser.username}</span>}
                                            {alert.resolvedBy?.username && <span>Resolved by: {alert.resolvedBy.username}</span>}
                                        </div>
                                    </div>

                                    {alert.status !== 'resolved' && (
                                        <div className="flex gap-2 shrink-0">
                                            {alert.status === 'active' && (
                                                <button
                                                    onClick={() => handleAcknowledge(alert._id, 'acknowledged')}
                                                    disabled={actionLoading === alert._id}
                                                    className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-50"
                                                >
                                                    Acknowledge
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleAcknowledge(alert._id, 'resolved')}
                                                disabled={actionLoading === alert._id}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-50"
                                            >
                                                <CheckCircle className="w-3 h-3" />
                                                Resolve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
