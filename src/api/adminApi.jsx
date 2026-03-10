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