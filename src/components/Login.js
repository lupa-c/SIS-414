// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, removeToken, isAuthenticated } from "../util/Auth";
import { LogOut } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [modoRegistro, setModoRegistro] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    if (modoRegistro && password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const endpoint = modoRegistro ? "register" : "login";
    const url = `http://localhost:8080/auth/${endpoint}`;

    const payload = { username, password };
    if (modoRegistro) {
      payload.nombres = nombres;
      payload.apellidos = apellidos;
      payload.ci = ci;
      payload.telefono = telefono;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      if (modoRegistro) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        limpiarCampos();
        setModoRegistro(false);
        return;
      }

      const token = await response.text();
      saveToken(token);
      navigate("/Clientes");
    } catch (error) {
      alert("Credenciales incorrectas o error en el servidor");
      console.error("Error:", error);
    }
  };

  const limpiarCampos = () => {
    setNombres("");
    setApellidos("");
    setCi("");
    setTelefono("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  };

  const handleLogout = () => {
    removeToken();
    window.location.reload();
  };

  if (isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 animate-background-pan">
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 animate-background-pan px-4">
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
            className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-pink-500"
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? "👁‍🗨" : "👁"}
            </button>
          </div>

          {modoRegistro && (
            <>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-pink-500"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? "👁‍🗨" : "👁"}
                </button>
              </div>

              <input
                type="text"
                placeholder="Nombres"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="CI"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            {modoRegistro ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center">
        {modoRegistro ? (
          <p className="text-white text-lg">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => setModoRegistro(false)}
              className="ml-2 text-yellow-300 underline hover:text-yellow-400 transition-colors"
            >
              Inicia sesión
            </button>
          </p>
        ) : (
          <p className="text-white text-lg">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => setModoRegistro(true)}
              className="ml-2 text-yellow-300 underline hover:text-yellow-400 transition-colors"
            >
              Regístrate
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
