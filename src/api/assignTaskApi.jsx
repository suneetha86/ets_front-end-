import apiClient from './apiClient';

export const createAssignTask = async (taskData) => {
    try {
        const response = await apiClient.post(`/admin/assign/tasks/create`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error assigning task:', error);
        throw error;
    }
};
export const deleteAssignTask = async (id, taskData = null) => {
    try {
        const response = await apiClient.delete(`/admin/assign/tasks/delete/${id}`, {
            data: taskData
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting assigned task:', error);
        throw error;
    }
};
