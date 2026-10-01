import React, { useState, useEffect } from 'react';
import { Users, Monitor, Wifi, LogOut, RefreshCw, Shield } from 'lucide-react';
import { securityApi } from '../../api/securityApi';
import { useAuth } from '../../context/AuthContext';

interface SessionEntry {
    _id: string;
    userId: {
        _id: string;
        username: string;
        name: string;
        email: string;
        role: string;
        department: string;
    } | null;
    ip: string;
    userAgent: string;
    device: string;
    loginAt: string;
    lastActivity: string;
    expiresAt: string;
}

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Admin': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    'ML Engineer': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    'AML Analyst': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'Security Analyst': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
};

export const SessionManagement: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [sessions, setSessions] = useState<SessionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState<string | null>(null);
    const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const data = await securityApi.getActiveSessions();
            setSessions(data.sessions || []);
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (sessionId: string) => {
        setRevoking(sessionId);
        try {
            await securityApi.revokeSession(sessionId);
            setConfirmRevoke(null);
            await fetchSessions();
        } catch (err) {
            console.error('Failed to revoke session:', err);
        } finally {
            setRevoking(null);
        }
    };

    const formatTime = (ts: string) => {
        return new Date(ts).toLocaleString('en-GB', {
            day: '2-digit', month: 'short',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const getTimeAgo = (ts: string) => {
        const diffMs = Date.now() - new Date(ts).getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffH = Math.floor(diffMin / 60);
        if (diffH < 24) return `${diffH}h ago`;
        return `${Math.floor(diffH / 24)}d ago`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <Users className="w-5 h-5 text-teal-400" />
                        Active Session Management
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Monitor currently logged-in users and revoke sessions to force immediate logout.</p>
                </div>
                <button
                    onClick={fetchSessions}
                    className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Session Count */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                    <Wifi className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                    <p className="text-xs text-slate-400">Currently Active Sessions</p>
                    <p className="text-2xl font-bold text-slate-100 font-mono">{sessions.length}</p>
                </div>
            </div>

            {/* Sessions Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : sessions.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <Shield className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="text-sm text-slate-400 font-mono">No active sessions found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {sessions.map((session) => {
                        const user = session.userId;
                        const roleStyle = ROLE_COLORS[user?.role || ''] || ROLE_COLORS['AML Analyst'];
                        const isOwnSession = user?._id === currentUser?.id?.replace('usr-', '');

                        return (
                            <div key={session._id} className={`bg-slate-900 border rounded-xl p-5 transition-colors ${isOwnSession ? 'border-teal-500/40' : 'border-slate-800 hover:border-slate-700'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-semibold text-sm">
                                            {user?.name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-100">{user?.name || 'Unknown'}</span>
                                                {isOwnSession && (
                                                    <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30 text-[9px] font-mono">
                                                        YOU
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[11px] text-slate-400 font-mono">@{user?.username || 'unknown'}</span>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${roleStyle.bg} ${roleStyle.text} border ${roleStyle.border}`}>
                                                    {user?.role || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Active" />
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                                    <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                                        <span className="text-slate-500">IP Address</span>
                                        <p className="text-slate-300 font-mono mt-0.5">{session.ip}</p>
                                    </div>
                                    <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                                        <span className="text-slate-500">Device</span>
                                        <p className="text-slate-300 font-mono mt-0.5 flex items-center gap-1">
                                            <Monitor className="w-3 h-3" />{session.device}
                                        </p>
                                    </div>
                                    <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                                        <span className="text-slate-500">Login Time</span>
                                        <p className="text-slate-300 font-mono mt-0.5">{formatTime(session.loginAt)}</p>
                                    </div>
                                    <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                                        <span className="text-slate-500">Last Activity</span>
                                        <p className="text-slate-300 font-mono mt-0.5">{getTimeAgo(session.lastActivity)}</p>
                                    </div>
                                </div>

                                {confirmRevoke === session._id ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-amber-400">Confirm force logout?</span>
                                        <button
                                            onClick={() => handleRevoke(session._id)}
                                            disabled={revoking === session._id}
                                            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-medium transition-colors disabled:opacity-50"
                                        >
                                            {revoking === session._id ? 'Revoking...' : 'Yes, Revoke'}
                                        </button>
                                        <button
                                            onClick={() => setConfirmRevoke(null)}
                                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmRevoke(session._id)}
                                        className="flex items-center gap-1.5 w-full justify-center py-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 hover:border-red-500/30 text-slate-400 border border-slate-700 rounded-lg text-[11px] font-medium transition-all"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        Revoke Session
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
