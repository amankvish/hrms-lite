import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupInterceptors = (showLoader, hideLoader, addPopup) => {
    api.interceptors.request.use(
        (config) => {
            showLoader();
            return config;
        },
        (error) => {
            hideLoader();
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => {
            hideLoader();
            return response;
        },
        (error) => {
            hideLoader();
            const msg = error.response?.data?.detail || 
                        error.response?.data?.non_field_errors?.[0] || 
                        error.message ||
                        "An unexpected error occurred";
            addPopup(msg, 'error');
            return Promise.reject(error);
        }
    );
};

export default api;
