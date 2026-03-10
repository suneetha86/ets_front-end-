import apiClient from './apiClient';

export const fetchNotifications = async () => {
    try {
        const response = await apiClient.get(`/notifications`);
        return response.data;
    } catch (error) {
        if (error?.message !== 'Network Error') {
            console.error('Error fetching notifications:', error);
        }
        throw error;
    }
};

export const fetchEmployeeNotifications = async (email) => {
    try {
        const response = await apiClient.get(`/employee/notifications`, {
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employee notifications:', error);
        throw error;
    }
};


export const postNotification = async (notificationData) => {
    try {
        const response = await apiClient.post(`/notifications`, notificationData);
        return response.data;
    } catch (error) {
        console.error('Error posting notification:', error);
        throw error;
    }
};

export const markAsRead = async (id) => {
    try {
        const response = await apiClient.put(`/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        console.error(`Error marking notification ${id} as read:`, error);
        throw error;
    }
};
export const fetchNotificationById = async (id) => {
    try {
        const response = await apiClient.get(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching notification ${id}:`, error);
        throw error;
    }
};
export const fetchUnreadNotifications = async () => {
    try {
        const response = await apiClient.get(`/notifications/unread`);
        return response.data;
    } catch (error) {
        if (error?.message !== 'Network Error') {
            console.error('Error fetching unread notifications:', error);
        }
        throw error;
    }
};

export const fetchEmployeeUnreadNotifications = async (email) => {
    try {
        const response = await apiClient.get(`/employee/notifications/unread`, {
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employee unread notifications:', error);
        throw error;
    }
};

export const fetchEmployeeUnreadCount = async (email) => {
    try {
        const response = await apiClient.get(`/employee/notifications/unread-count`, {
            params: { email }
        });
        return response.data; // Expected: { unreadCount: X }
    } catch (error) {
        console.error('Error fetching employee unread count:', error);
        throw error;
    }
};

export const updateNotification = async (id, notificationData) => {
    try {
        const response = await apiClient.put(`/notifications/${id}`, notificationData);
        return response.data;
    } catch (error) {
        console.error(`Error updating notification ${id}:`, error);
        throw error;
    }
};
export const deleteNotification = async (id) => {
    try {
        const response = await apiClient.delete(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting notification ${id}:`, error);
        throw error;
    }
};
