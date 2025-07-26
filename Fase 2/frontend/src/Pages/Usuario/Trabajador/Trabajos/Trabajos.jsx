import React, { useState, useEffect } from 'react';
import './style.css';
const API_URL = "http://34.152.27.187:5000";

const Trabajos_Usuario = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);

  const obtenerAplicaciones = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`${API_URL}/api/user/job/status`, {
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

  useEffect(() => {
    obtenerAplicaciones();
  }, []);

  const eliminarAplicacion = async () => {
    if (!deleteId.trim()) {
      setError('Ingrese el ID de la aplicación a eliminar');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`${API_URL}/api/user/job/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: parseInt(deleteId) }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMsg(result.message);
        obtenerAplicaciones();
      } else {
        setError(result.message);
      }
    } catch (e) {
      setError('Error al eliminar la aplicación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Mis Aplicaciones de Empleo</h1>

      <div className="user-card">
        <div className="header">
          <a href="/InicioUsuario" className="volver">Volver al inicio</a>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

        <div className="tabla-scroll">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID Aplicación</th>
                <th>Puesto</th>
                <th>Fecha de Aplicación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No hay aplicaciones registradas</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id_aplicacion}>
                    <td>{app.id_aplicacion}</td>
                    <td>{app.nombre_puesto}</td>
                    <td>{app.fecha_aplicacion}</td>
                    <td>{app.estado_proceso}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="formulario">
          <label><strong>ID de Aplicación a eliminar:</strong></label>
          <input
            type="number"
            className="search-input"
            placeholder="Ingrese el ID"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
          />
          <button onClick={eliminarAplicacion} className="btn-aplicar">🗑️ Eliminar Aplicación</button>
        </div>
      </div>
    </div>
  );
};

export default Trabajos_Usuario;