import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

/**
 * Create a new task/daily report
 * @param {Object} taskData - The task data object
 * @returns {Promise<Object>} The API response
 */
export const createTask = async (taskData) => {
    try {
        const response = await axios.post(`${BASE_URL}/tasks/create`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

/**
 * Fetch all tasks/reports
 * @returns {Promise<Array>} The list of tasks
 */
export const getTasks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/tasks/get_task`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};
