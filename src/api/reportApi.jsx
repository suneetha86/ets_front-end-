import apiClient from './apiClient';

export const postReport = async (reportData) => {
    try {
        const response = await apiClient.post(`/reports`, reportData);
        return response.data;
    } catch (error) {
        console.error('Error posting report:', error);
        throw error;
    }
};

export const fetchReports = async () => {
    try {
        const response = await apiClient.get(`/reports`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
};
export const fetchReportById = async (id) => {
    try {
        const response = await apiClient.get(`/reports/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching report ${id}:`, error);
        throw error;
    }
};
