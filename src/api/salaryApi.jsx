import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

export const postSalary = async (salaryData) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/salary-management`, salaryData);
        return response.data;
    } catch (error) {
        console.error('Error posting salary data:', error);
        throw error;
    }
};

export const fetchSalaries = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/salary-management`);
        return response.data;
    } catch (error) {
        console.error('Error fetching salaries:', error);
        throw error;
    }
};

export const fetchSalaryById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/salary-management/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary record with ID ${id}:`, error);
        throw error;
    }
};

export const fetchSalariesByDepartment = async (department) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/salary-management/department/${department}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary records for department ${department}:`, error);
        throw error;
    }
};

export const searchSalariesByName = async (name) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/salary-management/search?name=${name}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching salary records for name ${name}:`, error);
        throw error;
    }
};

export const fetchSalariesByStatus = async (status) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/salary-management/status/${status}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary records for status ${status}:`, error);
        throw error;
    }
};

export const updateSalary = async (id, salaryData) => {
    try {
        const response = await axios.put(`${BASE_URL}/admin/salary-management/${id}`, salaryData);
        return response.data;
    } catch (error) {
        console.error(`Error updating salary record with ID ${id}:`, error);
        throw error;
    }
};

export const deleteSalary = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/admin/salary-management/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting salary record with ID ${id}:`, error);
        throw error;
    }
};









