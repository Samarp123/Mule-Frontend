import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    CheckSquare,
    Lock,
    FileSpreadsheet,
    Database,
    Network,
    Cpu,
    BarChart3,
    Archive,
    History,
    UploadCloud,
    ListFilter,
    AlertOctagon,
    Search,
    Share2,
    FileText,
    ChevronLeft,
    ChevronRight,
    Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

const ROLE_NAV: Record<UserRole, NavItem[]> = {
    'Admin': [
        { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'User Management', path: '/admin/users', icon: Users },
        { label: 'Role Management', path: '/admin/roles', icon: ShieldCheck },
        { label: 'Model Approval', path: '/admin/model-approval', icon: CheckSquare },
        { label: 'Security Monitoring', path: '/admin/security', icon: Lock },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileSpreadsheet },
    ],
    'ML Engineer': [
        { label: 'Overview', path: '/ml/dashboard', icon: LayoutDashboard },
        { label: 'Datasets', path: '/ml/datasets', icon: Database },
        { label: 'Graph Statistics', path: '/ml/graph-stats', icon: Network },
        { label: 'Training', path: '/ml/training', icon: Cpu },
        { label: 'Model Performance', path: '/ml/performance', icon: BarChart3 },
        { label: 'Model Registry', path: '/ml/registry', icon: Archive },
        { label: 'Experiment History', path: '/ml/experiments', icon: History },
    ],
    'AML Analyst': [
        { label: 'Overview', path: '/analyst/dashboard', icon: LayoutDashboard },
        { label: 'Upload Dataset', path: '/analyst/upload', icon: UploadCloud },
        { label: 'Detection Jobs', path: '/analyst/jobs', icon: ListFilter },
        { label: 'Suspicious Accounts', path: '/analyst/accounts', icon: AlertOctagon },
        { label: 'Investigation', path: '/analyst/investigation', icon: Search },
        { label: 'Network Graph', path: '/analyst/network', icon: Share2 },
        { label: 'Reports', path: '/analyst/reports', icon: FileText },
    ],
};

export const Sidebar: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    if (!user) return null;

    const navItems = ROLE_NAV[user.role] || [];

    return (
        <aside
            className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col fixed left-0 top-0 bottom-0 z-40 ${collapsed ? 'w-16' : 'w-64'
                }`}
        >
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                {!collapsed && (
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-100 text-sm tracking-wide">MuleDetector</div>
                            <div className="text-[10px] text-slate-500 font-mono">AML R-GCN v2.4</div>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="mx-auto p-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400">
                        <Shield className="w-5 h-5" />
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                <div className={`text-[10px] font-mono text-slate-500 uppercase tracking-wider px-3 mb-2 ${collapsed ? 'hidden' : 'block'}`}>
                    {user.role} Portal
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </NavLink>
                    );
                })}
            </div>

            <div className="p-3 border-t border-slate-800 flex justify-end">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors w-full flex items-center justify-center gap-2 text-xs"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {!collapsed && <span className="text-[11px]">Collapse Navigation</span>}
                </button>
            </div>
        </aside>
    );
};