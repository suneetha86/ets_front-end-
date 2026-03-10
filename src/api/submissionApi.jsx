import apiClient from './apiClient';

export const fetchSubmissions = async () => {
    try {
        const response = await apiClient.get(`/admin/submissions/fetch`);
        return response.data;
    } catch (error) {
        console.error('Error fetching submissions:', error);
        throw error;
    }
};

export const createSubmission = async (submissionData) => {
    try {
        const response = await apiClient.post(`/admin/submissions/create`, submissionData);
        return response.data;
    } catch (error) {
        console.error('Error creating submission:', error);
        throw error;
    }
};

export const deleteSubmission = async (id) => {
    try {
        const response = await apiClient.delete(`/admin/submissions/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
};
export const approveSubmission = async (id) => {
    try {
        const response = await apiClient.put(`/admin/submissions/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error('Error approving submission:', error);
        throw error;
    }
};
export const rejectSubmission = async (id) => {
    try {
        const response = await apiClient.put(`/admin/submissions/${id}/reject`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting submission:', error);
        throw error;
    }
};
export const getPendingSubmissionsCount = async () => {
    try {
        const response = await apiClient.get(`/admin/submissions/pending/count`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pending submission count:', error);
        throw error;
    }
};
