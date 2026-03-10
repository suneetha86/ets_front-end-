import apiClient from './apiClient';

export const createProfile = async (profileData) => {
    try {
        const response = await apiClient.post(`/profiles/create`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
};

export const fetchEmployeeProfile = async () => {
    try {
        const response = await apiClient.get(`/profiles/employee`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile from compound API:', error);
        throw error;
    }
};

export const updateProfile = async (id, profileData) => {
    try {
        const response = await apiClient.put(`/profiles/${id}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const uploadProfileImage = async (file, employeeId) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('employeeId', employeeId);

        const response = await apiClient.post(
            `/profiles/upload-image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

export const getEmployeeProfile = async (employeeId) => {
    try {
        const response = await apiClient.get(`/profiles/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
export const createEmployee = async (employeeData) => {
    try {
        const response = await apiClient.post(`/employees`, employeeData);
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};
export const fetchAllEmployees = async () => {
    try {
        const response = await apiClient.get(`/employees`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all employees:', error);
        throw error;
    }
};
export const fetchAdminEmployees = async () => {
    try {
        const response = await apiClient.get(`/admin/employees`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin employees:', error);
        throw error;
    }
};

export const fetchAdminEmployeeById = async (id) => {
    try {
        const response = await apiClient.get(`/admin/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching admin employee with ID ${id}:`, error);
        throw error;
    }
};

export const createAdminEmployee = async (employeeData) => {
    try {
        const response = await apiClient.post(`/admin/employees`, employeeData);
        return response.data;
    } catch (error) {
        console.error('Error creating admin employee:', error);
        throw error;
    }
};

export const deactivateEmployee = async (id) => {
    try {
        const response = await apiClient.put(`/admin/employees/${id}/deactivate`);
        return response.data;
    } catch (error) {
        console.error(`Error deactivating employee with ID ${id}:`, error);
        throw error;
    }
};

export const fetchActiveEmployeeCount = async () => {
    try {
        const response = await apiClient.get(`/admin/employees/active/count`);
        return response.data;
    } catch (error) {
        console.error('Error fetching active employee count:', error);
        throw error;
    }
};

export const adminLogin = async (credentials) => {
    try {
        const response = await apiClient.post(`/admin/login`, credentials);
        return response.data;
    } catch (error) {
        console.error('Error logging in admin:', error);
        throw error;
    }
}

export const adminForgotPassword = async (emailData) => {
    try {
        const response = await apiClient.post(`/admin/forgot-password`, emailData);
        return response.data;
    } catch (error) {
        console.error('Error sending reset link:', error);
        throw error;
    }
}

export const adminResetPassword = async (resetData) => {
    try {
        const response = await apiClient.post(`/admin/reset-password`, resetData);
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}

export const registerEmployee = async (employeeData) => {
    try {
        const response = await apiClient.post(`/employee/register`, employeeData);
        return response.data;
    } catch (error) {
        console.error('Error registering employee:', error);
        throw error;
    }
}

export const employeeLogin = async (credentials) => {
    try {
        const response = await apiClient.post(`/employee/login`, credentials);
        return response.data;
    } catch (error) {
        console.error('Error logging in employee:', error);
        throw error;
    }
}

export const employeeForgotPassword = async (emailData) => {
    try {
        const response = await apiClient.post(`/employee/forgot-password`, emailData);
        return response.data;
    } catch (error) {
        console.error('Error verifying email:', error);
        throw error;
    }
}

export const employeeResetPassword = async (resetData) => {
    try {
        const response = await apiClient.post(`/employee/reset-password`, resetData);
        return response.data;
    } catch (error) {
        console.error('Error resetting employee password:', error);
        throw error;
    }
}
