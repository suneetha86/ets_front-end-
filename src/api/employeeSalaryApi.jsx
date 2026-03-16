import apiClient from './apiClient';

export const postEmployeeSalary = async (salaryData) => {
    try {
        const response = await apiClient.post(`/employee-salary-management/save`, salaryData);
        return response.data;
    } catch (error) {
        console.error('Error saving employee salary:', error);
        throw error;
    }
};

export const fetchAllEmployeeSalaries = async () => {
    try {
        const response = await apiClient.get(`/employee-salary-management/all`); 
        return response.data;
    } catch (error) {
        console.error('Error fetching employee salaries:', error);
        throw error;
    }
};

export const fetchEmployeeSalariesByEmployeeId = async (employeeId) => {
    try {
        const response = await apiClient.get(`/employee-salary-management/employee/${employeeId}`); 
        return response.data;
    } catch (error) {
        console.error(`Error fetching salaries for employee ${employeeId}:`, error);
        throw error;
    }
};

export const fetchEmployeeSalaryById = async (id) => {
    try {
        const response = await apiClient.get(`/employee-salary-management/id/${id}`); 
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary record ${id}:`, error);
        throw error;
    }
};
export const updateEmployeeSalary = async (id, updatedData) => {
    try {
        const response = await apiClient.put(`/employee-salary-management/update/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating salary record ${id}:`, error);
        throw error;
    }
};
export const deleteEmployeeSalary = async (id) => {
    try {
        const response = await apiClient.delete(`/employee-salary-management/delete/${id}`); 
        return response.data;
    } catch (error) {
        console.error(`Error deleting salary record ${id}:`, error);
        throw error;
    }
};
export const filterEmployeeSalaries = async (employeeId, year, month) => {
    try {
        const response = await apiClient.get(`/employee-salary-management/filter`, {
            params: { employeeId, year, month }
        });
        return response.data;
    } catch (error) {
        console.error(`Error filtering salary records:`, error);
        throw error;
    }
};
export const fetchPaginatedSalaries = async (employeeId, page, size) => {
    try {
        const response = await apiClient.get(`/employee-salary-management/pagination`, {
            params: { employeeId, page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching paginated salary records:`, error);
        throw error;
    }
};
export const fetchEmployeeSalarySummary = async (employeeId) => {
    try {
        const response = await apiClient.get(`/employee-salary-management/summary`, {
            params: { employeeId }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary summary:`, error);
        throw error;
    }
};
export const fetchEmployeeSalaryDashboard = async (employeeId, page, size) => {
    try {
        const response = await apiClient.get(`/employee-salary-management/dashboard`, {
            params: { employeeId, page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary dashboard:`, error);
        throw error;
    }
};
