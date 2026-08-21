import React, { useState } from 'react';
import { Search, Bell, LogOut, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

const ROLE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
    'Admin': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    'ML Engineer': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    'AML Analyst': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    // Connection state defaults to false until API integration
    const [isConnected] = useState(false);

    const roleStyle = user ? ROLE_COLORS[user.role] : ROLE_COLORS['AML Analyst'];

    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search accounts, graph nodes, dataset hashes, or models..."
                        className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className={`hidden md:flex items-center gap-2 px-2.5 py-1 bg-slate-950 border rounded-md text-[11px] font-mono ${isConnected ? 'border-emerald-500/30 text-emerald-400' : 'border-slate-800 text-slate-500'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span>{isConnected ? 'FastAPI Connected' : 'API Disconnected'}</span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                                <span className="font-semibold text-slate-200">System Alerts</span>
                            </div>
                            <div className="p-3 text-center text-slate-500 text-xs font-mono">
                                No active notifications.
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-slate-800" />

                {user && (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs">
                                {user.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div className="hidden sm:block text-left">
                                <div className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</div>
                                <div className={`inline-block text-[10px] px-1.5 py-0.5 rounded border mt-0.5 font-medium ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                                    {user.role}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            title="Logout session"
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-lg transition-colors ml-1"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};