import React, { useContext, useEffect } from "react";
import { LoginContext } from "../components/login/LoginContext";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
    const { authData } = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authData.isLoggedIn) {
            navigate("/login");
        }
    }, [authData, navigate]);

    if (!authData.isLoggedIn) {
        return null;
    }

    return (
        <div className="container mt-5">
            <h1>Bienvenid@ {authData.userName}</h1>
        </div>
    );
};

export default UserPage;
