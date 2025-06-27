import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ClienteList from "./components/ClienteList";
import HabitacionList from "./components/HabitacionList"; // IMPORTANTE

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/clientes" element={<ClienteList />} />
      <Route path="/habitaciones" element={<HabitacionList />} /> {/* NUEVA RUTA */}
    </Routes>
  );
}

export default App;
