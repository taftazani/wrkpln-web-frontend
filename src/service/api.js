import axios from 'axios';

// Create an Axios instance with default configurations
const apiClient = axios.create({
    baseURL: 'https://backend.coffeelabs.id/api', // Default to localhost if not set
    // baseURL: 'https://backend.coffeelabs.id/api', // Default to localhost if not set
    // baseURL: 'http://192.168.1.18:8000/api', // Default to localhost if not set

    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include token if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors here (e.g., show a toast notification)
        return Promise.reject(error);
    }
);

export default apiClient;
