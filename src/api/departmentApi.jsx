import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/admin/departments';

export const fetchDepartments = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/fetch`);
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

export const createDepartment = async (name) => {
    try {
        const response = await axios.post(`${BASE_URL}/create`, { name });
        return response.data;
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

export const deleteDepartment = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
};
