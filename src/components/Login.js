// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, removeToken, isAuthenticated } from "../util/Auth";
import { LogIn, LogOut } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modoRegistro, setModoRegistro] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = modoRegistro ? "register" : "login";
    const url = `http://localhost:8080/auth/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      if (modoRegistro) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        setModoRegistro(false);
        return;
      }

      const token = await response.text();
      saveToken(token);
      navigate("/clientes");

    } catch (error) {
      alert("Credenciales incorrectas o error en el servidor");
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    removeToken();
    window.location.reload();
  };

  if (isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 bg-[length:200%_200%] animate-[background-pan_10s_linear_infinite]">
        <div className="bg-black bg-opacity-60 p-8 rounded-2xl border-4 border-cyan-400 shadow-2xl text-center w-full max-w-md">
          <h2 className="text-3xl font-bold mb-4 text-white">Sesión activa</h2>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 bg-[length:200%_200%] animate-[background-pan_10s_linear_infinite]">
      <div className="bg-black bg-opacity-60 p-10 rounded-3xl border-4 border-gray-500 hover:border-cyan-400 transition-colors duration-300 shadow-2xl w-full max-w-md flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-cyan-400 mb-8">
          {modoRegistro ? "REGÍSTRATE" : "LOGIN"}
        </h2>

        <form onSubmit={handleAuth} className="w-full space-y-6">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-0 transition-all duration-300 hover:border-cyan-400 focus:border-cyan-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-0 transition-all duration-300 hover:border-pink-500 focus:border-pink-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            {modoRegistro ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>
      </div>

      <div className="absolute bottom-10 text-center">
        <p className="text-white text-lg">
          {modoRegistro ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            onClick={() => setModoRegistro(!modoRegistro)}
            className="ml-2 text-yellow-300 underline hover:text-yellow-400 transition-colors"
          >
            {modoRegistro ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
