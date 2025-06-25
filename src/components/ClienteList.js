// src/components/ClienteList.js
import React, { useEffect, useState } from "react";
import { getToken } from "../util/Auth";
import { Navigate } from "react-router-dom";


function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState("");
  const [ci, setCi] = useState("");
  const [correo, setCorreo] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const apiUrl = "http://localhost:8080/api/clientes";
  const token = getToken();
console.log("Token actual:", token);

  useEffect(() => {
    if (token) {
      fetchClientes();
    }
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar los clientes");
      }

      const data = await response.json();
      setClientes(data);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cliente = {
      nombre,
      ci,
      correoElectronico: correo,
    };

    const url = editandoId ? `${apiUrl}/${editandoId}` : apiUrl;
    const method = editandoId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) throw new Error("Error al guardar el cliente");

      setNombre("");
      setCi("");
      setCorreo("");
      setEditandoId(null);
      fetchClientes();
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar cliente?")) return;

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el cliente");

      fetchClientes();
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError(err.message);
    }
  };

  const handleEditar = (cliente) => {
    setNombre(cliente.nombre);
    setCi(cliente.ci);
    setCorreo(cliente.correoElectronico);
    setEditandoId(cliente.id);
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lista de Clientes</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="CI"
          value={ci}
          onChange={(e) => setCi(e.target.value)}
          required
        />
        <input
          type="ci"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <button type="submit">{editandoId ? "Actualizar" : "Agregar"}</button>
        {editandoId && (
          <button type="button" onClick={() => setEditandoId(null)}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>CI</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.ci}</td>
              <td>{cliente.correoElectronico}</td>
              <td>
                <button onClick={() => handleEditar(cliente)}>Editar</button>{" "}
                <button onClick={() => handleEliminar(cliente.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClienteList;
