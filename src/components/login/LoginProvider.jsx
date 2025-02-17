import { LoginContext } from "./LoginContext";
import { useState } from "react";

export const LoginProvider = ({ children }) => {
    const [authData, setAuthData] = useState({ 
        userName: "",
        password: "",
        isLoggedIn: false,
    });

    const updateLoginData = (data) => {
        setAuthData({ ...data, isLoggedIn: true });
    };

    const logout = () => {
        setAuthData({ userName: "", password: "", isLoggedIn: false });
    };

    return (
        <LoginContext.Provider value={{ authData, updateLoginData, logout }}>
            {children}
        </LoginContext.Provider>
    );
}