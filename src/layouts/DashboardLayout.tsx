import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';

export const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col pl-64 transition-all duration-300">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};