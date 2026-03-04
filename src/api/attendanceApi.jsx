import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

/**
 * Fetch weekly attendance records for an employee by email
 * @param {string} email - The employee email
 * @returns {Promise<Array>} The attendance records
 */
export const fetchWeeklyAttendance = async (email) => {
    try {
        const response = await axios.get(`${BASE_URL}/attendance/weekly`, {
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly attendance:', error);
        throw error;
    }
};

/**
 * Perform check-in for an employee
 * @param {string} email - The employee email
 * @returns {Promise<Object>} The response data
 */
export const checkIn = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/attendance/check-in`, null, {
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error('Error during check-in:', error);
        throw error;
    }
};

/**
 * Perform check-out for an employee
 * @param {string} email - The employee email
 * @returns {Promise<Object>} The response data
 */
export const checkOut = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/attendance/check-out`, null, {
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error('Error during check-out:', error);
        throw error;
    }
};

/**
 * Fetch all attendance records (Admin)
 * @returns {Promise<Array>} The list of all attendance records
 */
export const fetchAllAttendance = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/attendance/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all attendance:', error);
        throw error;
    }
};

/**
 * Fetch admin-specific attendance dashboard data
 * @param {string} date - The date to fetch for (YYYY-MM-DD)
 * @param {number} historyDays - Number of history days to include
 * @returns {Promise<Array>} The attendance dashboard data
 */
export const fetchAdminAttendanceDashboard = async (date, historyDays = 7) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/attendance/dashboard`, {
            params: { date, historyDays }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin attendance dashboard:', error);
        throw error;
    }
};

/**
 * Mark attendance for an employee (Admin)
 * @param {Object} attendanceData - The attendance payload { name, department, date, status, loginTime, logoutTime }
 * @returns {Promise<Object>} The created attendance record
 */
export const markAdminAttendance = async (attendanceData) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/attendance/mark`, attendanceData);
        return response.data;
    } catch (error) {
        console.error('Error marking admin attendance:', error);
        throw error;
    }
};

/**
 * Fetch detailed stats for an employee (Admin Popup)
 */
export const fetchEmployeeDetailedStats = async (name, date) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/attendance/popup`, {
            params: { name, date }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employee detailed stats:', error);
        throw error;
    }
};
