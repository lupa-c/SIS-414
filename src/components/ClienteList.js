import React, { useEffect, useState } from "react";
//duis
function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const apiUrl = "http://localhost:8080/clientes";
  const token = localStorage.getItem("token"); // Ajusta según tu método de token

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
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cliente = { nombres, apellidos, ci, telefono };
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

      setNombres("");
      setApellidos("");
      setCi("");
      setTelefono("");
      setEditandoId(null);
      fetchClientes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar cliente?")) return;

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al eliminar el cliente");
      fetchClientes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (cliente) => {
    setNombres(cliente.nombres);
    setApellidos(cliente.apellidos);
    setCi(cliente.ci);
    setTelefono(cliente.telefono);
    setEditandoId(cliente.id);
  };

  if (!token) {
    return <p>No autorizado</p>; // O redirige a login
  }

  const clientesFiltrados = clientes.filter((c) => {
    const busq = busqueda.toLowerCase();
    return (
      c.nombres.toLowerCase().includes(busq) ||
      c.apellidos.toLowerCase().includes(busq) ||
      c.ci.toLowerCase().includes(busq) ||
      c.telefono.toLowerCase().includes(busq)
    );
  });

  return (
    
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(135deg, #4b0082, #000000, #00008b)",
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Panel Lateral */}
      <div
        style={{
          width: "220px",
          backgroundColor: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <h3 style={{ marginBottom: "30px", color: "#ddd" }}>Menú</h3>

        {["Habitaciones", "Reservas", "Clientes"].map((texto) => (
          <button
            key={texto}
            style={{
              background:
                "linear-gradient(45deg, #6a0dad, #8a2be2, #4b0082)",
              color: "white",
              border: "none",
              padding: "12px 15px",
              marginBottom: "15px",
              cursor: "pointer",
              borderRadius: "15px",
              fontWeight: "600",
              fontSize: "16px",
              boxShadow:
                "0 4px 6px rgba(138, 43, 226, 0.6), 0 0 10px rgba(138, 43, 226, 0.8)",
              transition: "all 0.3s ease",
              textAlign: "center",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(45deg, #8a2be2, #d8bfd8, #7b3fbf)";
              e.currentTarget.style.boxShadow =
                "0 6px 10px rgba(216, 191, 216, 0.9), 0 0 15px rgba(216, 191, 216, 1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(45deg, #6a0dad, #8a2be2, #4b0082)";
              e.currentTarget.style.boxShadow =
                "0 4px 6px rgba(138, 43, 226, 0.6), 0 0 10px rgba(138, 43, 226, 0.8)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {texto}
          </button>
        ))}
      </div>

      {/* Contenido Principal */}
      <div
        style={{
          flexGrow: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "3rem",
            color: "#00ffff",
            fontWeight: "900",
            textShadow:
              "0 0 8px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff",
            animation: "glow 2.5s ease-in-out infinite alternate",
          }}
        >
          Lista de Clientes
        </h2>

        {error && (
          <p
            style={{
              color: "crimson",
              fontWeight: "700",
              fontSize: "1.3rem",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: "30px",
            marginTop: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <input
            type="text"
            placeholder="Nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required
            style={{
              padding: "12px",
              backgroundColor: "#2c2c2c",
              color: "white",
              border: "2px solid #00ffff",
              borderRadius: "15px",
              fontWeight: "700",
              fontSize: "1.1rem",
              boxShadow:
                "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
              flex: "1 1 200px",
              minWidth: "150px",
            }}
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
            style={{
              padding: "12px",
              backgroundColor: "#2c2c2c",
              color: "white",
              border: "2px solid #00ffff",
              borderRadius: "15px",
              fontWeight: "700",
              fontSize: "1.1rem",
              boxShadow:
                "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
              flex: "1 1 200px",
              minWidth: "150px",
            }}
          />
          <input
            type="text"
            placeholder="CI"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            required
            style={{
              padding: "12px",
              backgroundColor: "#2c2c2c",
              color: "white",
              border: "2px solid #00ffff",
              borderRadius: "15px",
              fontWeight: "700",
              fontSize: "1.1rem",
              boxShadow:
                "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
              flex: "1 1 150px",
              minWidth: "120px",
            }}
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            style={{
              padding: "12px",
              backgroundColor: "#2c2c2c",
              color: "white",
              border: "2px solid #00ffff",
              borderRadius: "15px",
              fontWeight: "700",
              fontSize: "1.1rem",
              boxShadow:
                "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
              flex: "1 1 180px",
              minWidth: "140px",
            }}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#00ffff",
                color: "black",
                border: "none",
                padding: "12px 20px",
                cursor: "pointer",
                borderRadius: "15px",
                fontWeight: "700",
                fontSize: "1.1rem",
                boxShadow:
                  "0 0 15px #00ffff, 0 0 30px #00ffff, 0 0 45px #00ffff",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {editandoId ? "Actualizar" : "Agregar"}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={() => setEditandoId(null)}
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  cursor: "pointer",
                  borderRadius: "15px",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  boxShadow:
                    "0 0 10px gray, 0 0 20px gray, 0 0 30px gray",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Buscador con lupa */}
        <div
          style={{
            position: "relative",
            width: "90%",
            maxWidth: "900px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              padding: "12px 45px 12px 15px",
              width: "100%",
              backgroundColor: "#2c2c2c",
              color: "white",
              border: "2px solid #00ffff",
              borderRadius: "15px",
              fontSize: "1.2rem",
              boxShadow:
                "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "22px",
              height: "22px",
              fill: "#00ffff",
              pointerEvents: "none",
            }}
            viewBox="0 0 24 24"
          >
            <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
          </svg>
        </div>

        {/* Tabla con scroll vertical */}
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            flexGrow: 1,
            overflowY: "auto",
            borderRadius: "15px",
            border: "2px solid #00ffff",
            backgroundColor: "#1e1e2e",
            boxShadow:
              "0 0 20px #00ffff, 0 0 40px #00ffff inset",
          }}
        >
          <table
            border="0"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 10px",
              color: "white",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#003333" }}>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "center",
                    width: "60px",
                    fontWeight: "700",
                    color: "white",
                    userSelect: "none",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "12px 10px",
                    width: "140px",
                    fontWeight: "700",
                    color: "white",
                    userSelect: "none",
                  }}
                >
                  Nombres
                </th>
                <th
                  style={{
                    padding: "12px 10px",
                    width: "140px",
                    fontWeight: "700",
                    color: "white",
                    userSelect: "none",
                  }}
                >
                  Apellidos
                </th>
                <th
                  style={{
                    padding: "12px 10px",
                    width: "110px",
                    fontWeight: "700",
                    color: "white",
                    userSelect: "none",
                  }}
                >
                  CI
                </th>
                <th
                  style={{
                    padding: "15px",
                    fontWeight: "700",
                    color: "white",
                    userSelect: "none",
                  }}
                >
                  Teléfono
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    fontWeight: "700",
                    color: "white",
                    userSelect: "none",
                  }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    style={{
                      backgroundColor: "#222244",
                      transition: "background-color 0.3s ease",
                      cursor: "default",
                      borderRadius: "10px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#005555")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#222244")
                    }
                  >
                    <td
                      style={{
                        padding: "12px 8px",
                        textAlign: "center",
                        width: "60px",
                      }}
                    >
                      {cliente.id}
                    </td>
                    <td style={{ padding: "12px 10px", width: "140px" }}>
                      {cliente.nombres}
                    </td>
                    <td style={{ padding: "12px 10px", width: "140px" }}>
                      {cliente.apellidos}
                    </td>
                    <td style={{ padding: "12px 10px", width: "110px" }}>
                      {cliente.ci}
                    </td>
                    <td style={{ padding: "15px" }}>{cliente.telefono}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => handleEditar(cliente)}
                        style={{
                          backgroundColor: "gold",
                          color: "black",
                          border: "none",
                          padding: "8px 15px",
                          marginRight: "10px",
                          cursor: "pointer",
                          borderRadius: "12px",
                          fontWeight: "700",
                          boxShadow: "0 0 10px gold",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(cliente.id)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          padding: "8px 15px",
                          cursor: "pointer",
                          borderRadius: "12px",
                          fontWeight: "700",
                          boxShadow: "0 0 8px red",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No hay clientes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes glow {
          from {
            text-shadow:
              0 0 8px #00ffff,
              0 0 20px #00ffff,
              0 0 30px #00ffff,
              0 0 40px #00ffff;
          }
          to {
            text-shadow:
              0 0 20px #00ffff,
              0 0 30px #00ffff,
              0 0 40px #00ffff,
              0 0 50px #00ffff;
          }
        }
      `}</style>
    </div>
  );
}

export default ClienteList;   