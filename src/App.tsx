import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RBACProvider } from './context/RBACContext';
import { Login } from './pages/auth/Login';
import { RoleProtectedRoute } from './components/common/RoleProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { UnauthorizedPage } from './pages/Unauthorized';

// Public marketing pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { ContactPage } from './pages/public/ContactPage';

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

// Security Analyst Pages
import { SecurityDashboard } from './pages/security/SecurityDashboard';
import { LoginActivity } from './pages/security/LoginActivity';
import { SecurityAlerts } from './pages/security/SecurityAlerts';
import { SessionManagement } from './pages/security/SessionManagement';
import { SecurityAuditTrail } from './pages/security/SecurityAuditTrail';
import { RateLimitMonitor } from './pages/security/RateLimitMonitor';

export default function App() {
    return (
        <AuthProvider>
            <RBACProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/features" element={<FeaturesPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                        {/* Admin Protected Hierarchy */}
                        <Route
                            path="/admin"
                            element={
                                <RoleProtectedRoute allowedRoles={['Admin']} requiredPermissions={['access_overview_view']}>
                                    <DashboardLayout />
                                </RoleProtectedRoute>
                            }
                        >
                            <Route path="dashboard" element={<RoleProtectedRoute allowedRoles={['Admin']} requiredPermissions={['access_overview_view']}><AdminDashboard /></RoleProtectedRoute>} />
                            <Route path="users" element={<RoleProtectedRoute allowedRoles={['Admin']} requiredPermissions={['user_view']}><UserManagement /></RoleProtectedRoute>} />
                            <Route path="roles" element={<RoleProtectedRoute allowedRoles={['Admin']} requiredPermissions={['role_view']}><RoleManagement /></RoleProtectedRoute>} />
                            <Route path="model-approval" element={<RoleProtectedRoute allowedRoles={['Admin']} requiredPermissions={['permission_view']}><ModelApproval /></RoleProtectedRoute>} />
                            <Route path="security" element={<RoleProtectedRoute allowedRoles={['Admin']} requiredPermissions={['permission_view']}><SecurityMonitoring /></RoleProtectedRoute>} />
                            <Route path="audit-logs" element={<RoleProtectedRoute allowedRoles={['Admin']} requiredPermissions={['permission_view']}><AuditLogs /></RoleProtectedRoute>} />
                        </Route>

                        {/* ML Engineer Protected Hierarchy */}
                        <Route
                            path="/ml"
                            element={
                                <RoleProtectedRoute allowedRoles={['ML Engineer']} requiredPermissions={['model_view']}>
                                    <DashboardLayout />
                                </RoleProtectedRoute>
                            }
                        >
                            <Route path="dashboard" element={<RoleProtectedRoute allowedRoles={['ML Engineer']} requiredPermissions={['model_view']}><MLDashboard /></RoleProtectedRoute>} />
                            <Route path="datasets" element={<RoleProtectedRoute allowedRoles={['ML Engineer']} requiredPermissions={['model_view']}><Datasets /></RoleProtectedRoute>} />
                            <Route path="graph-stats" element={<RoleProtectedRoute allowedRoles={['ML Engineer']} requiredPermissions={['model_view']}><GraphStatistics /></RoleProtectedRoute>} />
                            <Route path="training" element={<RoleProtectedRoute allowedRoles={['ML Engineer']} requiredPermissions={['model_view']}><Training /></RoleProtectedRoute>} />
                            <Route path="performance" element={<RoleProtectedRoute allowedRoles={['ML Engineer']} requiredPermissions={['model_metrics_view']}><ModelPerformance /></RoleProtectedRoute>} />
                            <Route path="registry" element={<RoleProtectedRoute allowedRoles={['ML Engineer']} requiredPermissions={['model_view']}><ModelRegistry /></RoleProtectedRoute>} />
                            <Route path="experiments" element={<RoleProtectedRoute allowedRoles={['ML Engineer']} requiredPermissions={['model_results_view']}><ExperimentHistory /></RoleProtectedRoute>} />
                        </Route>

                        {/* AML Analyst Protected Hierarchy */}
                        <Route
                            path="/analyst"
                            element={
                                <RoleProtectedRoute allowedRoles={['AML Analyst']} requiredPermissions={['aml_results_view']}>
                                    <DashboardLayout />
                                </RoleProtectedRoute>
                            }
                        >
                            <Route path="dashboard" element={<RoleProtectedRoute allowedRoles={['AML Analyst']} requiredPermissions={['aml_results_view']}><AnalystDashboard /></RoleProtectedRoute>} />
                            <Route path="upload" element={<RoleProtectedRoute allowedRoles={['AML Analyst']} requiredPermissions={['account_view']}><UploadDataset /></RoleProtectedRoute>} />
                            <Route path="jobs" element={<RoleProtectedRoute allowedRoles={['AML Analyst']} requiredPermissions={['aml_results_view']}><DetectionJobs /></RoleProtectedRoute>} />
                            <Route path="accounts" element={<RoleProtectedRoute allowedRoles={['AML Analyst']} requiredPermissions={['account_view']}><SuspiciousAccounts /></RoleProtectedRoute>} />
                            <Route path="investigation" element={<RoleProtectedRoute allowedRoles={['AML Analyst']} requiredPermissions={['investigation_view']}><Investigation /></RoleProtectedRoute>} />
                            <Route path="network" element={<RoleProtectedRoute allowedRoles={['AML Analyst']} requiredPermissions={['account_view']}><NetworkVisualization /></RoleProtectedRoute>} />
                            <Route path="reports" element={<RoleProtectedRoute allowedRoles={['AML Analyst']} requiredPermissions={['aml_results_view']}><Reports /></RoleProtectedRoute>} />
                        </Route>

                        {/* Security Analyst Protected Hierarchy */}
                        <Route
                            path="/security"
                            element={
                                <RoleProtectedRoute allowedRoles={['Security Analyst']} requiredPermissions={['security_dashboard_view']}>
                                    <DashboardLayout />
                                </RoleProtectedRoute>
                            }
                        >
                            <Route path="dashboard" element={<RoleProtectedRoute allowedRoles={['Security Analyst']} requiredPermissions={['security_dashboard_view']}><SecurityDashboard /></RoleProtectedRoute>} />
                            <Route path="login-activity" element={<RoleProtectedRoute allowedRoles={['Security Analyst']} requiredPermissions={['security_events_view']}><LoginActivity /></RoleProtectedRoute>} />
                            <Route path="alerts" element={<RoleProtectedRoute allowedRoles={['Security Analyst']} requiredPermissions={['security_events_view']}><SecurityAlerts /></RoleProtectedRoute>} />
                            <Route path="sessions" element={<RoleProtectedRoute allowedRoles={['Security Analyst']} requiredPermissions={['security_sessions_view']}><SessionManagement /></RoleProtectedRoute>} />
                            <Route path="audit-trail" element={<RoleProtectedRoute allowedRoles={['Security Analyst']} requiredPermissions={['security_audit_view']}><SecurityAuditTrail /></RoleProtectedRoute>} />
                            <Route path="rate-limits" element={<RoleProtectedRoute allowedRoles={['Security Analyst']} requiredPermissions={['security_events_view']}><RateLimitMonitor /></RoleProtectedRoute>} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </RBACProvider>
        </AuthProvider>
    );
}