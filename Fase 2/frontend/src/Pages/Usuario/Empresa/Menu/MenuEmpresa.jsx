import React, { useState, useEffect } from 'react';
import './style-menu-empresa.css';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://34.152.27.187:5000";
const MenuEmpresa = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/company/job/application`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        const err = await response.json();
        setError(err.message || 'Error al obtener trabajos');
      }
    } catch (err) {
      console.error('Error al cargar trabajos:', err);
      setError('Error de red. No se pudieron cargar los trabajos.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Sesión cerrada correctamente.");
        navigate('/');
      } else {
        alert("Error al cerrar sesión.");
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error en logout:", error);
      alert("Error al cerrar sesión.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Menú Principal Empresa</h1>

      <div className="user-card">
        <div className="header">
          <h2>¡Bienvenido!</h2>
        </div>

        <div className="button-group">
          <button type="button" onClick={() => navigate('/SolicitudesEmpresa')}>Atender Aplicación</button>
          <button type="button" onClick={() => navigate('/Registrar-Puesto')}>Publicar un puesto de trabajo</button>
          <button type="button">Envío de correo a aplicante</button>
          <button type="button" onClick={() => navigate('/HistorialOfertas')}>Historial de puestos trabajo</button>
          <button type="button" onClick={() => navigate('/update-job')}>Actualizar Ofertas de trabajo</button>
          <button type="button" onClick={() => navigate('/update-company')}>Actualizar mi información</button>
          <button type="button" onClick={() => navigate('/find-job')}>Buscar mis Puestos</button>
          <button type="button" onClick={() => navigate('/report-user')}>Reportar Usuario</button>
          <button type="button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>


        {loading && <p>Cargando trabajos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="tabla-scroll-empresa-inicio">
          <table className="user-table">
            <thead>
              <tr>
                <th>Fecha Aplicación</th>
                <th>Nombre Completo</th>
                <th>Nombre Puesto</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && !loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No hay aplicantes disponibles</td>
                </tr>
              ) : (
                jobs.map((job, index) => (
                  <tr key={index}>
                    <td>{job.fecha_aplicacion}</td>
                    <td>{job.nombre_completo}</td>
                    <td>{job.nombre_puesto}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MenuEmpresa;
