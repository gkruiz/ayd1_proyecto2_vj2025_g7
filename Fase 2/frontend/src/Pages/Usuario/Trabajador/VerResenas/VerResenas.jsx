import React, { useState, useEffect } from 'react';
import './style-ver-resena.css';
const API_URL = "http://34.152.27.187:5000";

const Trabajos_Usuario = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const obtenerAplicaciones = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setApplications(data);
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError('Error al obtener aplicaciones.');
    } finally {
      setLoading(false);
    }
  };
  const renderEstrellas = (calificacion) => {
    return (
      <div className="estrellas-view">
        {[1, 2, 3, 4, 5].map((num) => (
          <span key={num} className={num <= calificacion ? 'estrella seleccionada' : 'estrella'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    obtenerAplicaciones();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Reseñas de Usuarios</h1>

      <div className="user-card">
        <div className="header">
          <a href="/InicioUsuario" className="volver">Volver al inicio</a>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre del Usuario</th>
              <th>Nombre de la empresa</th>
              <th>Calificación</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No hay reseñas registradas</td>
              </tr>
            ) : (
              applications.map((app,index) => (
                <tr key={index}>
                  <td>{app.nombre_usuario}</td>
                  <td>{app.nombre_empresa}</td>
                  <td>{renderEstrellas(app.calificacion)}</td>
                  <td>{app.comentario}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trabajos_Usuario;