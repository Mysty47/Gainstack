import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;
 console.log("Raw token from storage:", token);

  if (!token) {
    console.warn("No access token found in localStorage.");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded.username,
      email: decoded.email,

    };
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getAccessToken = () =>
    localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () =>
    localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};