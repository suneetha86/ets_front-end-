import apiClient from './apiClient';

export const fetchDepartments = async () => {
    try {
        const response = await apiClient.get(`/admin/departments/fetch`);
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

export const createDepartment = async (name) => {
    try {
        const response = await apiClient.post(`/admin/departments/create`, { name });
        return response.data;
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

export const deleteDepartment = async (id) => {
    try {
        const response = await apiClient.delete(`/admin/departments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
};

export const updateDepartment = async (id, name) => {
    try {
        const response = await apiClient.put(`/admin/departments/${id}`, { name });
        return response.data;
    } catch (error) {
        console.error('Error updating department:', error);
        throw error;
    }
};
