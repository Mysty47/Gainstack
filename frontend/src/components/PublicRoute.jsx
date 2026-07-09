import { Navigate } from "react-router-dom";
import { getAccessToken, getRefreshToken } from "../auth/tokenService";

export default function PublicRoute({ children }) {

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (accessToken || refreshToken) {
        return <Navigate to="/homepage" replace />;
    }

    return children;
}