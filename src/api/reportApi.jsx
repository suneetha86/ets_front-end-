import axios from 'axios';

const BASE_URL = '/api';

export const postReport = async (reportData) => {
    try {
        const response = await axios.post(`${BASE_URL}/reports`, reportData);
        return response.data;
    } catch (error) {
        console.error('Error posting report:', error);
        throw error;
    }
};

export const fetchReports = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/reports`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
};
export const fetchReportById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/reports/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching report ${id}:`, error);
        throw error;
    }
};
