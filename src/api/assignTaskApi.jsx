import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/admin/assign/tasks';

export const createAssignTask = async (taskData) => {
    try {
        const response = await axios.post(`${BASE_URL}/create`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error assigning task:', error);
        throw error;
    }
};
export const deleteAssignTask = async (id, taskData = null) => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
            data: taskData
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting assigned task:', error);
        throw error;
    }
};
