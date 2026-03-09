import axios from 'axios';

const BASE_URL = '/api/admin/submissions';

export const fetchSubmissions = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/fetch`);
        return response.data;
    } catch (error) {
        console.error('Error fetching submissions:', error);
        throw error;
    }
};

export const createSubmission = async (submissionData) => {
    try {
        const response = await axios.post(`${BASE_URL}/create`, submissionData);
        return response.data;
    } catch (error) {
        console.error('Error creating submission:', error);
        throw error;
    }
};

export const deleteSubmission = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
};
export const approveSubmission = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error('Error approving submission:', error);
        throw error;
    }
};
export const rejectSubmission = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}/reject`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting submission:', error);
        throw error;
    }
};
export const getPendingSubmissionsCount = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/pending/count`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pending submission count:', error);
        throw error;
    }
};
