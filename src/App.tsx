import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/auth/Login';
import { RoleProtectedRoute } from './components/common/RoleProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { RoleManagement } from './pages/admin/RoleManagement';
import { ModelApproval } from './pages/admin/ModelApproval';
import { SecurityMonitoring } from './pages/admin/SecurityMonitoring';
import { AuditLogs } from './pages/admin/AuditLogs';

// ML Pages
import { MLDashboard } from './pages/ml/MLDashboard';
import { Datasets } from './pages/ml/Datasets';
import { GraphStatistics } from './pages/ml/GraphStatistics';
import { Training } from './pages/ml/Training';
import { ModelPerformance } from './pages/ml/ModelPerformance';
import { ModelRegistry } from './pages/ml/ModelRegistry';
import { ExperimentHistory } from './pages/ml/ExperimentHistory';

// AML Analyst Pages
import { AnalystDashboard } from './pages/analyst/AnalystDashboard';
import { UploadDataset } from './pages/analyst/UploadDataset';
import { DetectionJobs } from './pages/analyst/DetectionJobs';
import { SuspiciousAccounts } from './pages/analyst/SuspiciousAccounts';
import { Investigation } from './pages/analyst/Investigation';
import { NetworkVisualization } from './pages/analyst/NetworkVisualization';
import { Reports } from './pages/analyst/Reports';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Admin Protected Hierarchy */}
                    <Route
                        path="/admin"
                        element={
                            <RoleProtectedRoute allowedRoles={['Admin']}>
                                <DashboardLayout />
                            </RoleProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="roles" element={<RoleManagement />} />
                        <Route path="model-approval" element={<ModelApproval />} />
                        <Route path="security" element={<SecurityMonitoring />} />
                        <Route path="audit-logs" element={<AuditLogs />} />
                    </Route>

                    {/* ML Engineer Protected Hierarchy */}
                    <Route
                        path="/ml"
                        element={
                            <RoleProtectedRoute allowedRoles={['ML Engineer']}>
                                <DashboardLayout />
                            </RoleProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<MLDashboard />} />
                        <Route path="datasets" element={<Datasets />} />
                        <Route path="graph-stats" element={<GraphStatistics />} />
                        <Route path="training" element={<Training />} />
                        <Route path="performance" element={<ModelPerformance />} />
                        <Route path="registry" element={<ModelRegistry />} />
                        <Route path="experiments" element={<ExperimentHistory />} />
                    </Route>

                    {/* AML Analyst Protected Hierarchy */}
                    <Route
                        path="/analyst"
                        element={
                            <RoleProtectedRoute allowedRoles={['AML Analyst']}>
                                <DashboardLayout />
                            </RoleProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<AnalystDashboard />} />
                        <Route path="upload" element={<UploadDataset />} />
                        <Route path="jobs" element={<DetectionJobs />} />
                        <Route path="accounts" element={<SuspiciousAccounts />} />
                        <Route path="investigation" element={<Investigation />} />
                        <Route path="network" element={<NetworkVisualization />} />
                        <Route path="reports" element={<Reports />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}