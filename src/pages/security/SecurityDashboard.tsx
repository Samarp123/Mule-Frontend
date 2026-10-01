import React, { useState, useEffect } from 'react';
import {
    Shield, Activity, AlertTriangle, Users, Clock, Zap,
    TrendingUp, Eye, ShieldAlert, LogIn
} from 'lucide-react';
import { securityApi } from '../../api/securityApi';

interface DashboardStats {
    totalLoginAttempts24h: number;
    failedLogins24h: number;
    activeAlerts: number;
    activeSessions: number;
    rateLimitViolations24h: number;
    totalUsers: number;
}

interface RecentAlert {
    _id: string;
    type: string;
    severity: string;
    description: string;
    status: string;
    createdAt: string;
}

interface AuditEvent {
    _id: string;
    action: string;
    category: string;
    actor: { username: string; role: string };
    description: string;
    timestamp: string;
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
};

const TYPE_LABELS: Record<string, string> = {
    brute_force: 'Brute Force',
    rate_limit: 'Rate Limit',
    suspicious_session: 'Suspicious Session',
    account_locked: 'Account Locked',
};

export const SecurityDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalLoginAttempts24h: 0, failedLogins24h: 0, activeAlerts: 0,
        activeSessions: 0, rateLimitViolations24h: 0, totalUsers: 0,
    });
    const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
    const [recentAudit, setRecentAudit] = useState<AuditEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const data = await securityApi.getDashboardStats();
            setStats(data.stats);
            setRecentAlerts(data.recentAlerts || []);
            setRecentAudit(data.recentAuditEvents || []);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (ts: string) => {
        const d = new Date(ts);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffH = Math.floor(diffMin / 60);
        if (diffH < 24) return `${diffH}h ago`;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: 'Login Attempts (24h)', value: stats.totalLoginAttempts24h, icon: LogIn, color: 'text-blue-400' },
        { label: 'Failed Logins (24h)', value: stats.failedLogins24h, icon: ShieldAlert, color: 'text-red-400' },
        { label: 'Active Alerts', value: stats.activeAlerts, icon: AlertTriangle, color: 'text-amber-400' },
        { label: 'Active Sessions', value: stats.activeSessions, icon: Users, color: 'text-emerald-400' },
        { label: 'Rate Limit Violations', value: stats.rateLimitViolations24h, icon: Zap, color: 'text-orange-400' },
        { label: 'Total Users', value: stats.totalUsers, icon: TrendingUp, color: 'text-purple-400' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-teal-400" />
                        Security Operations Center
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Real-time security monitoring, threat detection, and audit intelligence.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                        SOC Active
                    </span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between text-slate-400 mb-2">
                                <span className="text-[11px] font-medium">{card.label}</span>
                                <Icon className={`w-4 h-4 ${card.color}`} />
                            </div>
                            <div className="text-2xl font-bold text-slate-100 font-mono">{card.value}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Alerts */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Recent Security Alerts
                    </h2>
                    {recentAlerts.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs font-mono">
                            <Shield className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            No active alerts — all systems nominal.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentAlerts.map((alert) => {
                                const sev = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.medium;
                                return (
                                    <div key={alert._id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${sev.bg} ${sev.text} border ${sev.border}`}>
                                                    {alert.severity.toUpperCase()}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    {TYPE_LABELS[alert.type] || alert.type}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-300 truncate">{alert.description}</p>
                                            <span className="text-[10px] text-slate-500 font-mono">{formatTime(alert.createdAt)}</span>
                                        </div>
                                        <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono ${alert.status === 'active' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                                                alert.status === 'acknowledged' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                                                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                            }`}>
                                            {alert.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Audit Feed */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-teal-400" />
                        Audit Activity Feed
                    </h2>
                    {recentAudit.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs font-mono">
                            <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            No audit events recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-4 text-xs">
                            {recentAudit.map((event) => (
                                <div key={event._id} className="border-l-2 border-teal-500 pl-3 py-0.5">
                                    <p className="text-slate-200 font-medium">{event.action.replace(/_/g, ' ')}</p>
                                    <p className="text-[11px] text-slate-400 truncate">{event.description || `By ${event.actor?.username}`}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-slate-500 font-mono">{formatTime(event.timestamp)}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* System Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    Security Posture Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-slate-500">Login Success Rate</p>
                        <p className="mt-2 text-lg font-semibold text-emerald-400 font-mono">
                            {stats.totalLoginAttempts24h > 0
                                ? `${(((stats.totalLoginAttempts24h - stats.failedLogins24h) / stats.totalLoginAttempts24h) * 100).toFixed(1)}%`
                                : 'N/A'}
                        </p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-slate-500">Threat Level</p>
                        <p className={`mt-2 text-lg font-semibold font-mono ${stats.activeAlerts > 5 ? 'text-red-400' : stats.activeAlerts > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {stats.activeAlerts > 5 ? 'HIGH' : stats.activeAlerts > 0 ? 'MODERATE' : 'LOW'}
                        </p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-slate-500">Active Sessions</p>
                        <p className="mt-2 text-lg font-semibold text-blue-400 font-mono">{stats.activeSessions}</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-slate-500">Rate Limit Events</p>
                        <p className="mt-2 text-lg font-semibold text-orange-400 font-mono">{stats.rateLimitViolations24h}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
