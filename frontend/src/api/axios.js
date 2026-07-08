import axios from "axios";
import { getAccessToken, setTokens, clearTokens } from "../auth/tokenService";
import API_URL from "../config/api";

// base instance
const api = axios.create({
    baseURL: API_URL,
});

// attach access token on every request
api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// refresh logic (IMPORTANT PART)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const res = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = res.data;

                setTokens(accessToken, newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (err) {
                clearTokens();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;