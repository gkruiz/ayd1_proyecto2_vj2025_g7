import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CargarEnv.css";
const API_URL = "http://34.152.27.187:5000";
const CargarENV = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name === "auth.ayd1") {
      setFile(selected);
      setStatus("");
    } else {
      setFile(null);
      setStatus("Por favor selecciona un archivo llamado exactamente 'auth.ayd1'.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("No hay archivo para subir.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const response = await fetch(`${API_URL}/api/admin/verify-authfile`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (response.ok) {
          alert("Su autenticación ha sido aprobada.")
          navigate("/admin_menu");
        } else {
          setStatus(data.message || "Error al subir el archivo.");
        }
      } else {
        const html = await response.text();
        console.error("Respuesta inesperada del servidor:", html);
        setStatus("Error inesperado del servidor. Verifica la consola.");
      }

    } catch (error) {
      console.error("Error de red o del servidor:", error);
      setStatus("Error de red o del servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Verificación de Segundo Paso</h2>
      <input type="file" onChange={handleFileChange} accept=".ayd1" />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? (
          <span className="spinner" style={{ verticalAlign: "middle" }}></span>
        ) : (
          "Subir"
        )}
      </button>
      <p className="status">{status}</p>
    </div>
  );
};

export default CargarENV;