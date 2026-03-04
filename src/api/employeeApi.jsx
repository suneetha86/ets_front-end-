import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

export const createProfile = async (profileData) => {
    try {
        const response = await axios.post(`${BASE_URL}/profiles/create`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
};

export const fetchEmployeeProfile = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/profiles/employee`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile from compound API:', error);
        throw error;
    }
};

export const updateProfile = async (id, profileData) => {
    try {
        const response = await axios.put(`${BASE_URL}/profiles/${id}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const getEmployeeProfile = async (employeeId) => {
    try {
        const response = await axios.get(`${BASE_URL}/profiles/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
export const createEmployee = async (employeeData) => {
    try {
        const response = await axios.post(`${BASE_URL}/employees`, employeeData);
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};
export const fetchAllEmployees = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/employees`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all employees:', error);
        throw error;
    }
};
export const fetchAdminEmployees = async () => {
    try {
        const response = await axios.get(`http://localhost:8081/admin/employees`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin employees:', error);
        throw error;
    }
};

export const fetchAdminEmployeeById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8081/admin/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching admin employee with ID ${id}:`, error);
        throw error;
    }
};

export const createAdminEmployee = async (employeeData) => {
    try {
        const response = await axios.post(`http://localhost:8081/admin/employees`, employeeData);
        return response.data;
    } catch (error) {
        console.error('Error creating admin employee:', error);
        throw error;
    }
};

export const deactivateEmployee = async (id) => {
    try {
        const response = await axios.put(`http://localhost:8081/admin/employees/${id}/deactivate`);
        return response.data;
    } catch (error) {
        console.error(`Error deactivating employee with ID ${id}:`, error);
        throw error;
    }
};

export const fetchActiveEmployeeCount = async () => {
    try {
        const response = await axios.get(`http://localhost:8081/admin/employees/active/count`);
        return response.data;
    } catch (error) {
        console.error('Error fetching active employee count:', error);
        throw error;
    }
};
