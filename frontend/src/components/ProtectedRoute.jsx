import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";
import { clearTokens } from "../auth/tokenService";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const validate = async () => {
            try {
                await api.get("/validate");
                setAuthenticated(true);
            } catch (err) {
                clearTokens();
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        validate();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}