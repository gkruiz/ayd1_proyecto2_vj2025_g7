import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CargarEnv.css";

const CargarENV = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
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

  const formData = new FormData();
  formData.append("archivo", file);

  try {
    const response = await fetch("http://127.0.0.1:5000/api/admin/verify-authfile", {
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
  }
};


  return (
    <div className="container">
      <h2>Verificación de Segundo Paso</h2>
      <input type="file" onChange={handleFileChange} accept=".ayd1" />
      <button onClick={handleUpload}>Subir</button>
      <p className="status">{status}</p>
    </div>
  );
};

export default CargarENV;
