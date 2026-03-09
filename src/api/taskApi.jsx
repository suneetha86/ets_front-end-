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

/**
 * Fetch all tasks from admin repository
 * @returns {Promise<Array>} The list of admin tasks
 */
export const fetchAdminTasks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/tasks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin tasks:', error);
        throw error;
    }
};
/**
 * Add a new task from administrative terminal
 * @param {Object} taskData - The admin task data object
 * @returns {Promise<Object>} The API response
 */
export const addAdminTask = async (taskData) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/tasks/add`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error adding admin task:', error);
        throw error;
    }
};

/**
 * Delete a task from administrative repository
 * @param {number|string} id - The task ID
 * @returns {Promise<Object>} The API response
 */
export const deleteAdminTask = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/admin/tasks/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting admin task ${id}:`, error);
        throw error;
    }
};
