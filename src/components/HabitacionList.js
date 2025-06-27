import React, { useEffect, useState } from "react";

export default function HabitacionList() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nuevaHabitacion, setNuevaHabitacion] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    tipo: "Simple", // Añadido tipo
  });

  // Tipos de habitación para seleccionar en el panel lateral
  const tiposHabitacion = ["Simple", "Doble", "Suite"];
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Simple");

  const fetchHabitaciones = async () => {
    try {
      const res = await fetch("http://localhost:8080/habitaciones");
      const data = await res.json();
      setHabitaciones(data);
    } catch (err) {
      setError("Error al cargar habitaciones");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHabitaciones();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/habitaciones/${id}`, {
        method: "DELETE",
      });
      setHabitaciones(habitaciones.filter((h) => h.id !== id));
    } catch {
      alert("Error al eliminar");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Añade el tipo seleccionado a la habitación nueva
      const habitacionAEnviar = { ...nuevaHabitacion, tipo: tipoSeleccionado };

      const res = await fetch("http://localhost:8080/habitaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitacionAEnviar),
      });
      const nueva = await res.json();
      setHabitaciones([...habitaciones, nueva]);
      setNuevaHabitacion({ nombre: "", descripcion: "", precio: 0, tipo: "Simple" });
      setTipoSeleccionado("Simple");
    } catch {
      alert("Error al crear");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#111" }}>
      {/* Panel lateral izquierdo para seleccionar tipo de habitación */}
      <div
        style={{
          width: "200px",
          backgroundColor: "#222",
          color: "#fff",
          padding: "20px",
          boxSizing: "border-box",
          borderRight: "2px solid #555",
        }}
      >
        <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Tipos de Habitación</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tiposHabitacion.map((tipo) => (
            <li
              key={tipo}
              onClick={() => {
                setTipoSeleccionado(tipo);
                setNuevaHabitacion((prev) => ({ ...prev, tipo }));
              }}
              style={{
                padding: "10px 15px",
                marginBottom: "10px",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: tipo === tipoSeleccionado ? "#00ffff" : "transparent",
                color: tipo === tipoSeleccionado ? "#000" : "#fff",
                fontWeight: tipo === tipoSeleccionado ? "700" : "400",
                transition: "background-color 0.3s ease",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (tipo !== tipoSeleccionado) e.currentTarget.style.backgroundColor = "#004d4d";
              }}
              onMouseLeave={(e) => {
                if (tipo !== tipoSeleccionado) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {tipo}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido principal */}
      <div
        style={{
          flexGrow: 1,
          padding: "20px",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Habitaciones - Tipo seleccionado: {tipoSeleccionado}</h2>

        <ul>
          {habitaciones
            .filter((h) => h.tipo === tipoSeleccionado) // Filtra por tipo seleccionado
            .map((h) => (
              <li key={h.id} style={{ marginBottom: "10px" }}>
                <strong>{h.nombre}</strong> - {h.descripcion} - ${h.precio}{" "}
                <button
                  onClick={() => handleDelete(h.id)}
                  style={{
                    marginLeft: "15px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          {habitaciones.filter((h) => h.tipo === tipoSeleccionado).length === 0 && (
            <p>No hay habitaciones de este tipo.</p>
          )}
        </ul>

        <h3>Crear nueva habitación</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Nombre"
            value={nuevaHabitacion.nombre}
            onChange={(e) => setNuevaHabitacion({ ...nuevaHabitacion, nombre: e.target.value })}
            required
            style={{ padding: "10px", borderRadius: "5px", border: "none" }}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevaHabitacion.descripcion}
            onChange={(e) => setNuevaHabitacion({ ...nuevaHabitacion, descripcion: e.target.value })}
            required
            style={{ padding: "10px", borderRadius: "5px", border: "none" }}
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevaHabitacion.precio}
            onChange={(e) => setNuevaHabitacion({ ...nuevaHabitacion, precio: Number(e.target.value) })}
            required
            style={{ padding: "10px", borderRadius: "5px", border: "none" }}
          />
          {/* Mostrar el tipo seleccionado para crear (solo info, no editable aquí) */}
          <input
            type="text"
            value={`Tipo: ${tipoSeleccionado}`}
            readOnly
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#222",
              color: "#00ffff",
              fontWeight: "700",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#00ffff",
              color: "#000",
              fontWeight: "700",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00bbbb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00ffff")}
          >
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}
