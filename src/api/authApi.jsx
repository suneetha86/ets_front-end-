import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

/**
 * Admin Login API
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Response data { message, token }
 */
export const adminLogin = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Admin login error:', error);
        throw error;
    }
};
