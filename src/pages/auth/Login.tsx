import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password123');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const redirectUrl = await login({ email, password, rememberMe });
            navigate(redirectUrl, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please verify credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const setDemoAccount = (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('password123');
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            {/* Background Subtle Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Header Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 mb-3 shadow-inner">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">MuleDetector AML</h1>
                    <p className="text-xs text-slate-400 mt-1">Enterprise Mule Account & Heterogeneous Graph Detection</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
                        <KeyRound className="w-4 h-4 text-blue-400" />
                        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">System Access Portal</h2>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email / Username</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@financial-institution.com"
                                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                                />
                                Remember session
                            </label>
                            <span className="text-slate-500 hover:text-slate-400 cursor-pointer">Security Notice</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Authenticate & Login</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Role Selectors for Demo */}
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3 text-center">
                            Quick Select Demo Accounts
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setDemoAccount('admin@example.com')}
                                className="p-2 text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs transition-colors"
                            >
                                <div className="font-semibold text-blue-400">Admin</div>
                                <div className="text-[10px] text-slate-500 truncate">admin@...</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDemoAccount('mlengineer@example.com')}
                                className="p-2 text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs transition-colors"
                            >
                                <div className="font-semibold text-purple-400">ML Engineer</div>
                                <div className="text-[10px] text-slate-500 truncate">mlengineer@...</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDemoAccount('analyst@example.com')}
                                className="p-2 text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs transition-colors"
                            >
                                <div className="font-semibold text-emerald-400">AML Analyst</div>
                                <div className="text-[10px] text-slate-500 truncate">analyst@...</div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6 text-[11px] text-slate-600 font-mono">
                    MuleDetector Platform v2.4.0 • FastAPI / R-GCN Backed
                </div>
            </div>
        </div>
    );
};