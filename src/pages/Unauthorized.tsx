import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
            <div className="max-w-lg rounded-3xl border border-red-500/30 bg-slate-900/80 p-8 text-center shadow-2xl shadow-red-900/20">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                    <ShieldAlert className="h-8 w-8" />
                </div>
                <p className="text-xs uppercase tracking-[0.28em] text-red-300">Access denied</p>
                <h1 className="mt-4 text-3xl font-bold text-white">You do not have permission to access this module.</h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                    This page is protected by the application RBAC system. Your current role and assigned permissions do not allow access.
                </p>
                <div className="mt-8 flex justify-center gap-3">
                    <Link to="/login" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                        Return to login
                    </Link>
                    <Link to="/" className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/30 transition hover:brightness-110">
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
};
