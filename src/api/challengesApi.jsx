import apiClient from './apiClient';

export const fetchChallenges = async () => {
    try {
        const response = await apiClient.get(`/challenges`);
        return response.data;
    } catch (error) {
        console.error('Error fetching coding challenges:', error);
        throw error;
    }
};

export const fetchChallengeById = async (id) => {
    try {
        const response = await apiClient.get(`/challenges/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching challenge ${id}:`, error);
        throw error;
    }
};

export const fetchSolveUrl = async (id) => {
    try {
        const response = await apiClient.get(`/challenges/${id}/solve-url`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching solve URL for challenge ${id}:`, error);
        throw error;
    }
};

export const fetchChallengeSolution = async (id) => {
    try {
        const response = await apiClient.get(`/challenges/${id}/solve`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching solution for challenge ${id}:`, error);
        throw error;
    }
};

export const postChallenge = async (challengeData) => {
    try {
        const response = await apiClient.post(`/challenges`, challengeData);
        return response.data;
    } catch (error) {
        console.error('Error posting coding challenge:', error);
        throw error;
    }
};
