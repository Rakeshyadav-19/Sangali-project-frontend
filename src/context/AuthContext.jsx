import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, user: null });

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // console.log("Decoded Token:", decoded); // Check if full_name exists
                setAuth({ user: decoded });
            } catch (err) {
                console.error("Invalid token", err);
            }
        }
    }, []);

    const login = (token) => {
        const user = jwtDecode(token);
        localStorage.setItem("auth_token", token);
        setAuth({ token, user });
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        setAuth({ token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
