import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

export const fetchNotifications = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/notifications`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const postNotification = async (notificationData) => {
    try {
        const response = await axios.post(`${BASE_URL}/notifications`, notificationData);
        return response.data;
    } catch (error) {
        console.error('Error posting notification:', error);
        throw error;
    }
};

export const markAsRead = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        console.error(`Error marking notification ${id} as read:`, error);
        throw error;
    }
};
export const fetchNotificationById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/notifications/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching notification ${id}:`, error);
        throw error;
    }
};
export const fetchUnreadNotifications = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/notifications/unread`);
        return response.data;
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        throw error;
    }
};
export const updateNotification = async (id, notificationData) => {
    try {
        const response = await axios.put(`${BASE_URL}/notifications/${id}`, notificationData);
        return response.data;
    } catch (error) {
        console.error(`Error updating notification ${id}:`, error);
        throw error;
    }
};
export const deleteNotification = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/notifications/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting notification ${id}:`, error);
        throw error;
    }
};
