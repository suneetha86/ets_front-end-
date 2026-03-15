import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the token to headers
apiClient.interceptors.request.use(
    (config) => {
        // Don't add token to login or register requests
        if (config.url.includes('/login') || config.url.includes('/register')) {
            return config;
        }

        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            try {
                const { token } = JSON.parse(loggedInUser);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                console.error("Token parsing failed", e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle specialized errors (like 401/403)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest = error.config?.url?.includes('/login') || error.config?.url?.includes('/register');
        const errorMessage = error.response?.data?.message || error.response?.data || error.message;

        if (!isAuthRequest && error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn(`Authentication/Authorization error on protected route (${error.config.url}): ${errorMessage}`);
            // Optional: localStorage.removeItem('loggedInUser');
            // Optional: window.location.href = '/login';
        }

        // Attach the message to the error object so components can use it
        error.apiMessage = errorMessage;
        return Promise.reject(error);
    }
);

export default apiClient;
