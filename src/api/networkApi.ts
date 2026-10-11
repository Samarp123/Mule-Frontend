import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('mule_auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface NetworkSummary {
    component_id: string;
    account_count: number;
    risk_score_max: number;
    risk_score_mean: number;
    red_accounts: number;
    yellow_accounts: number;
    edge_count: number;
    transaction_count: number;
    suspicious_value: number;
    flow_path_count: number;
    network_score: number;
    network_bin: string;
}

export interface NetworkNode {
    account_id: string;
    risk_score: number;
    alert_bin: string;
    component_id: string;
    role?: 'Source' | 'Sink' | 'Relay';
    incoming?: number;
    outgoing?: number;
    transferCount?: number;
}

export interface NetworkEdge {
    source_account_id: string;
    target_account_id: string;
    transaction_count: number;
    first_timestamp_unix: number;
    last_timestamp_unix: number;
    amount_paid_total: number;
    amount_received_total: number;
    source_risk_score: number;
    target_risk_score: number;
    edge_risk_score: number;
    component_id: string;
}

export interface FlowPath {
    source_account_id: string;
    intermediary_account_id: string;
    target_account_id: string;
    in_event_id: number;
    out_event_id: number;
    in_timestamp_unix: number;
    out_timestamp_unix: number;
    gap_hours: number;
    in_amount: number;
    out_amount: number;
    amount_ratio: number;
    path_risk_score: number;
    component_id: string;
}

export interface CaseAction {
    id: number;
    account_id: string;
    action_type: 'freeze' | 'escalate' | 'false_positive' | 'add_to_case';
    status: string;
    note?: string;
    created_at: string;
}

export interface NetworkDetailResponse {
    success: boolean;
    network: NetworkSummary;
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    paths: FlowPath[];
    roles: Record<string, { incoming: number; outgoing: number; inCount: number; outCount: number; label: string; net: number }>;
    actions: CaseAction[];
}

export interface NetworkStatsOverview {
    totalNetworks: number;
    totalNodes: number;
    totalEdges: number;
    totalFlowPaths: number;
    totalFundsAtRisk: number;
    totalMuleAccounts: number;
    activeInvestigations: number;
    newAlerts24h?: number;
    criticalAlerts: number;
    redNetworks: number;
    yellowNetworks: number;
}

export const networkApi = {
    getOverviewStats: async (): Promise<NetworkStatsOverview> => {
        const res = await apiClient.get('/networks/stats/overview');
        return res.data.data;
    },

    listNetworks: async (params?: { limit?: number; offset?: number; search?: string; minScore?: number }) => {
        const res = await apiClient.get('/networks', { params });
        return res.data;
    },

    getNetworkDetail: async (networkId: string): Promise<NetworkDetailResponse> => {
        const res = await apiClient.get(`/networks/${encodeURIComponent(networkId)}`);
        return res.data;
    },

    listSuspiciousAccounts: async (params?: { limit?: number; offset?: number; search?: string; alert_bin?: string }) => {
        const res = await apiClient.get('/networks/accounts/suspicious', { params });
        return res.data;
    },

    getAccountDossier: async (accountId: string) => {
        const res = await apiClient.get(`/networks/accounts/${encodeURIComponent(accountId)}/dossier`);
        return res.data;
    },

    submitAccountAction: async (accountId: string, action_type: 'freeze' | 'escalate' | 'false_positive' | 'add_to_case', note?: string) => {
        const res = await apiClient.post(`/networks/accounts/${encodeURIComponent(accountId)}/action`, { action_type, note });
        return res.data;
    },
};
