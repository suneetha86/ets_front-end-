import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

export const postSalary = async (salaryData) => {
    try {
        const response = await axios.post(`${BASE_URL}/salaries`, salaryData);
        return response.data;
    } catch (error) {
        console.error('Error posting salary data:', error);
        throw error;
    }
};

export const fetchSalaries = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/salaries`);
        return response.data;
    } catch (error) {
        console.error('Error fetching salaries:', error);
        throw error;
    }
};
