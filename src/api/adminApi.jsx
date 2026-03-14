import apiClient from './apiClient';

export const resetAdminPassword = async (resetData) => {
    try {
        const response = await apiClient.post(`/admin/reset-password`, resetData);
        return response.data;
    } catch (error) {
        console.error('Error resetting admin password:', error);
        throw error;
    }
};

export const fetchDashboardSummary = async () => {
    try {
        const response = await apiClient.get(`/admin/dashboard/summary`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        throw error;
    }
};