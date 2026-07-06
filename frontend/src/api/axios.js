import axios from "axios";
import API_URL from "../config/api";
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
} from "../auth/tokenService";

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // If no response or not 401 → reject
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // Prevent infinite loop
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // If already refreshing → queue requests
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = "Bearer " + token;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            // CALL REFRESH ENDPOINT
            const { data } = await axios.post(
                `${API_URL}/auth/refresh`,
                { refreshToken }
            );

            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;

            // SAVE NEW TOKENS
            setTokens(newAccessToken, newRefreshToken);

            // UPDATE AUTH HEADER
            api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            processQueue(null, newAccessToken);

            return api(originalRequest);
        } catch (err) {
            processQueue(err, null);
            clearTokens();
            window.location.href = "/login";
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;