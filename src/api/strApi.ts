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

export type STRStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'READY_TO_FILE' | 'REJECTED';

export interface STRSupportingSignal {
    label: string;
    value: string;
}

export interface STRLinkedAccount {
    accountNumber: string;
    accountType: string;
    holder: string;
    bank: string;
    branch: string;
    openedDate: string;
    status: string;
    balance: string;
    riskScore: number;
}

export interface STRTransaction {
    transactionId: string;
    date: string;
    mode: string;
    amount: number;
    currency: string;
    debitOrCredit: string;
    counterpartyAccount: string;
    counterpartyBank: string;
    remarks: string;
}

export interface STRRecord {
    id: string;
    flagId: string;
    accountId: string;
    amount: number;
    riskScore: number;
    networkId: string;
    status: STRStatus;
    reportType: 'new' | 'replacement';
    reportDate: string;
    reportingEntity: {
        bankName: string;
        regulatorCategory: string;
        principalOfficerName: string;
        designation: string;
        contact: string;
    };
    reportingBranch: {
        branchName: string;
        branchId: string;
        address: string;
    };
    linkedIndividuals: Array<Record<string, string>>;
    linkedLegalEntities: Array<Record<string, string>>;
    linkedAccounts: STRLinkedAccount[];
    suspiciousTransactions: STRTransaction[];
    groundsOfSuspicion: {
        reasonCategory: string;
        narrative: string;
        supportingSignals: STRSupportingSignal[];
    };
    actionTaken: {
        accountFrozen: string;
        lawEnforcementInformed: string;
        furtherSteps: string;
    };
    approval: {
        preparedBy: string;
        reviewedBy: string;
        approvedBy: string;
        preparedAt: string;
        reviewedAt: string;
        approvedAt: string;
        status: STRStatus;
    };
    createdAt?: string;
    updatedAt?: string;
    rejectionReason?: string;
}

export const strApi = {
    list: async (params?: { status?: string }) => {
        const res = await apiClient.get('/strs', { params });
        return (res.data?.records ?? []) as STRRecord[];
    },

    generate: async (payload: {
        flagId: string;
        accountId?: string;
        amount?: number;
        riskScore?: number;
        networkId?: string;
    }) => {
        const res = await apiClient.post(`/str/generate/${encodeURIComponent(payload.flagId)}`, payload);
        return res.data.record as STRRecord;
    },

    getById: async (id: string) => {
        const res = await apiClient.get(`/strs/${encodeURIComponent(id)}`);
        return res.data.record as STRRecord;
    },

    update: async (id: string, data: Partial<STRRecord>) => {
        const res = await apiClient.patch(`/strs/${encodeURIComponent(id)}`, data);
        return res.data.record as STRRecord;
    },

    approve: async (id: string, reviewerId = 'analyst') => {
        const res = await apiClient.post(`/strs/${encodeURIComponent(id)}/approve`, { reviewerId });
        return res.data.record as STRRecord;
    },

    reject: async (id: string, reason: string, reviewerId = 'analyst') => {
        const res = await apiClient.post(`/strs/${encodeURIComponent(id)}/reject`, { reason, reviewerId });
        return res.data.record as STRRecord;
    },

    exportJson: async (id: string) => {
        const res = await apiClient.get(`/strs/${encodeURIComponent(id)}/export`, { params: { format: 'json' } });
        return res.data.record as STRRecord;
    },
};
