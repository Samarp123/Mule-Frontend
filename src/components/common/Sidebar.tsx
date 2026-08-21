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
    requiredPermissions?: string[];
}

const ROLE_NAV: Record<UserRole, NavItem[]> = {
    'Admin': [
        { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard, requiredPermissions: ['access_overview_view'] },
        { label: 'User Management', path: '/admin/users', icon: Users, requiredPermissions: ['user_view'] },
        { label: 'Role Management', path: '/admin/roles', icon: ShieldCheck, requiredPermissions: ['role_view'] },
        { label: 'Model Approval', path: '/admin/model-approval', icon: CheckSquare, requiredPermissions: ['permission_view'] },
        { label: 'Security Monitoring', path: '/admin/security', icon: Lock, requiredPermissions: ['permission_view'] },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileSpreadsheet, requiredPermissions: ['permission_view'] },
    ],
    'ML Engineer': [
        { label: 'Overview', path: '/ml/dashboard', icon: LayoutDashboard, requiredPermissions: ['model_view'] },
        { label: 'Datasets', path: '/ml/datasets', icon: Database, requiredPermissions: ['model_view'] },
        { label: 'Graph Statistics', path: '/ml/graph-stats', icon: Network, requiredPermissions: ['model_view'] },
        { label: 'Training', path: '/ml/training', icon: Cpu, requiredPermissions: ['model_view'] },
        { label: 'Model Performance', path: '/ml/performance', icon: BarChart3, requiredPermissions: ['model_metrics_view'] },
        { label: 'Model Registry', path: '/ml/registry', icon: Archive, requiredPermissions: ['model_view'] },
        { label: 'Experiment History', path: '/ml/experiments', icon: History, requiredPermissions: ['model_results_view'] },
    ],
    'AML Analyst': [
        { label: 'Overview', path: '/analyst/dashboard', icon: LayoutDashboard, requiredPermissions: ['aml_results_view'] },
        { label: 'Upload Dataset', path: '/analyst/upload', icon: UploadCloud, requiredPermissions: ['account_view'] },
        { label: 'Detection Jobs', path: '/analyst/jobs', icon: ListFilter, requiredPermissions: ['aml_results_view'] },
        { label: 'Suspicious Accounts', path: '/analyst/accounts', icon: AlertOctagon, requiredPermissions: ['account_view'] },
        { label: 'Investigation', path: '/analyst/investigation', icon: Search, requiredPermissions: ['investigation_view'] },
        { label: 'Network Graph', path: '/analyst/network', icon: Share2, requiredPermissions: ['account_view'] },
        { label: 'Reports', path: '/analyst/reports', icon: FileText, requiredPermissions: ['aml_results_view'] },
    ],
};

export const Sidebar: React.FC = () => {
    const { user, hasAnyPermission } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    if (!user) return null;

    const navItems = (ROLE_NAV[user.role] || []).filter((item) => {
        if (!item.requiredPermissions || item.requiredPermissions.length === 0) return true;
        return hasAnyPermission(item.requiredPermissions);
    });

    return (
        <aside
            className={`bg-slate-900/80 border-r border-slate-800/80 backdrop-blur-xl transition-all duration-300 flex flex-col fixed left-0 top-0 bottom-0 z-40 ${collapsed ? 'w-16' : 'w-64'
                }`}
        >
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
                {!collapsed && (
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400 shadow-lg shadow-blue-600/10">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-100 text-sm tracking-wide">MuleDetector</div>
                            <div className="text-[10px] text-slate-400 font-mono">AML R-GCN v2.4</div>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="mx-auto p-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400 shadow-lg shadow-blue-600/10">
                        <Shield className="w-5 h-5" />
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                <div className={`text-[10px] font-mono text-slate-400 uppercase tracking-wider px-3 mb-2 ${collapsed ? 'hidden' : 'block'}`}>
                    {user.role} Portal
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
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

            <div className="p-3 border-t border-slate-800/80 bg-slate-950/30 flex justify-end">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 bg-slate-950/60 border border-slate-700 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors w-full flex items-center justify-center gap-2 text-xs"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {!collapsed && <span className="text-[11px]">Collapse Navigation</span>}
                </button>
            </div>
        </aside>
    );
};