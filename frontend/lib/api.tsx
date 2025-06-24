import axios from 'axios';

const api = axios.create({
    baseURL: process.env.API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && error.config && !error.config.__isRetryRequest) {
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${process.env.API_URL}token/refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', response.data.access);
                error.config.__isRetryRequest = true;
                error.config.headers.Authorization = `Bearer ${response.data.access}`;
                return api(error.config);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError); // Debug
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;