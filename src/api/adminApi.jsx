import axios from 'axios';

const BASE_URL = '/api';

export const resetAdminPassword = async (resetData) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/reset-password`, resetData);
        return response.data;
    } catch (error) {
        console.error('Error resetting admin password:', error);
        throw error;
    }
};