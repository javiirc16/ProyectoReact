import React, { useContext, useState } from "react";
import { LoginContext } from "./LoginContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export const LoginForm = () => {
    const { updateLoginData } = useContext(LoginContext);
    const [formData, setFormData] = useState({ userName: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateLoginData(formData);
        console.log("Datos enviados:", formData);
        navigate("/user");
    };

    return (
        <div className="container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div className="input">
                    <input
                        type="text"
                        className="form-control"
                        id="userName"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="Ingresa tu nombre de usuario"
                        required
                    />
                </div>
                <div className="input">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>
                <button type="submit" className="button">Entrar</button>
            </form>
        </div>
    );
};