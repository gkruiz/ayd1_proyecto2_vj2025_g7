import React, { useEffect, useState } from "react";
import "./ReportsMenu.css";
import { useNavigate } from 'react-router-dom';

const ReportsMenu = () => {
  const [empresaSolicitudes, setEmpresaSolicitudes] = useState(null);
  const [empresaPublicaciones, setEmpresaPublicaciones] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/admin/report/empresa-top-solicitudes", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEmpresaSolicitudes(data.empresa);
        } else {
          setError("Error cargando empresa con más solicitudes.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Error de red al cargar solicitudes.");
      });

    fetch("http://127.0.0.1:5000/api/admin/report/empresa-top-publicaciones", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEmpresaPublicaciones(data.empresa);
        } else {
          setError("Error cargando empresa con más publicaciones.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Error de red al cargar publicaciones.");
      });
  }, []);

  return (
    <div className="reports-container">
      

      <h1 className="reports-title">Reportes Generales</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="report-section">
        <h2>Empresa con más solicitudes de empleo</h2>
        {empresaSolicitudes ? (
          <div className="report-card">
            <p><strong>ID:</strong> {empresaSolicitudes.id}</p>
            <p><strong>Nombre:</strong> {empresaSolicitudes.nombre_empresa}</p>
            <p><strong>Total de Solicitudes:</strong> {empresaSolicitudes.total_solicitudes}</p>
          </div>
        ) : (
          <p>No hay solicitudes registradas.</p>
        )}
      </div>

      <div className="report-section">
        <h2>Empresa con más publicaciones de puestos</h2>
        {empresaPublicaciones ? (
          <div className="report-card">
            <p><strong>ID:</strong> {empresaPublicaciones.id}</p>
            <p><strong>Nombre:</strong> {empresaPublicaciones.nombre_empresa}</p>
            <p><strong>Total de Publicaciones:</strong> {empresaPublicaciones.total_puestos_publicados}</p>
          </div>
        ) : (
          <p>No hay publicaciones registradas.</p>
        )}
      </div>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <button onClick={() => navigate('/admin_menu')}>
            Regresar al menú
            </button>
        </div>
    </div>
  );
};

export default ReportsMenu;
