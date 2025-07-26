import React, { useState, useEffect } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

const MenuEmpresa = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [area, setArea] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/company/job/application', {
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
            const response = await fetch('http://127.0.0.1:5000/logout', {
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

        <form className="search-form">
          <button onClick={() => navigate('/SolicitudesEmpresa')}>Atender Aplicación</button>
          <button onClick={() => navigate('/Registrar-Puesto')}>Publicar un puesto de trabajo</button>
          <button onClick={() => navigate('/TrabajosUsuario')}>Envío de correo a aplicante</button>
          <button onClick={() => navigate('/HistorialOfertas')}>Historial de puestos trabajo</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </form>

        {loading && <p>Cargando trabajos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

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
                <td colSpan="5" style={{ textAlign: 'center' }}>No hay trabajos disponibles</td>
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
  );
};

export default MenuEmpresa;
