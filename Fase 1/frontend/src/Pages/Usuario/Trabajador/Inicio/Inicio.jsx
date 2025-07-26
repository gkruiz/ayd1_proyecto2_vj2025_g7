import React, { useState, useEffect } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

const Inicio_Usuario = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [area, setArea] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/user/job/active', {
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!area.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/user/job/area', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ area }),
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        const err = await response.json();
        setError(err.message || 'Error al buscar trabajos por área');
      }
    } catch (err) {
      console.error('Error en búsqueda por área:', err);
      setError('Error de red. No se pudieron buscar trabajos.');
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
      <h1 className="title">Inicio Usuario</h1>

      <div className="user-card">
        <div className="header">
          <h2>¡Bienvenido!</h2>
        </div>

        <p className="subtitle">Lista de empleos disponibles!</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Ingrese el área de su interés"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <button type="submit" className="search-button">Buscar Puesto</button>
          <button onClick={() => navigate('/AplicacionUsuario')}>Aplicar Empleo</button>
          <button onClick={() => navigate('/TrabajosUsuario')}>Ver aplicaciones realizadas</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </form>

        {loading && <p>Cargando trabajos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Ubicación</th>
              <th>Sueldo</th>
              <th>Área</th>
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
                  <td>{job.id}</td>
                  <td>{job.nombre_puesto}</td>
                  <td>{job.nombre_empresa}</td>
                  <td>{job.ubicacion_fisica}</td>
                  <td>Q. {job.sueldo}</td>
                  <td>{job.area || area}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inicio_Usuario;
