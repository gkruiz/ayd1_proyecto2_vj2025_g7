import React, { useState, useEffect } from 'react';
import './style-resena.css';
const API_URL = "http://34.152.27.187:5000";
const CrearResena = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [empresasUnicas, setEmpresasUnicas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [calificacion, setCalificacion] = useState('');
  const [comentario, setComentario] = useState('');

  const enviarResena = async () => {
    if (!selectedEmpresa || !calificacion) {
      setError('Debe seleccionar una empresa y una calificación');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`${API_URL}/api/user/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre_empresa: selectedEmpresa,
          calificacion: parseInt(calificacion),
          comentario: comentario
        })
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMsg(result.message);
        setSelectedEmpresa('');
        setCalificacion('');
        setComentario('');
      } else {
        setError(result.message);
      }
    } catch (e) {
      setError('Error al enviar reseña');
    } finally {
      setLoading(false);
    }
  };

  const obtenerAplicaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/user/job/status/final`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setApplications(data);

        const nombresEmpresas = [...new Set(data.map(app => app.nombre_empresa))];
        setEmpresasUnicas(nombresEmpresas);
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

  return (
    <div className="container">
      <h1 className="title">Crear Reseña a Empresa</h1>

      <div className="user-card">
        <div className="header">
          <a href="/InicioUsuario" className="volver">Volver al inicio</a>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

        <div className="tabla-scroll-crear-resena">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID Aplicación</th>
                <th>Empresa</th>
                <th>Puesto</th>
                <th>Estado</th>
                <th>Fecha de Aplicación</th>
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
                    <td>{app.nombre_empresa}</td>
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
          <h2>Crear Reseña</h2>

          <div className="form-group">
            <label htmlFor="empresa"><strong>Empresa a las que les puede enviar reseña</strong></label>
            <select
              id="empresa"
              className="search-input"
              value={selectedEmpresa}
              onChange={(e) => setSelectedEmpresa(e.target.value)}
            >
              <option value="">Seleccionar Empresa</option>
              {empresasUnicas.map((empresa, index) => (
                <option key={index} value={empresa}>{empresa}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="calificacion"><strong>Calificación (1 a 5):</strong></label>
            <div className="estrellas">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`estrella ${num <= calificacion ? 'seleccionada' : ''}`}
                  onClick={() => setCalificacion(num)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>


          <div className="form-group">
            <label htmlFor="comentario"><strong>Comentario:</strong></label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="search-input"
              rows={4}
            ></textarea>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="btn-aplicar" onClick={enviarResena}>Enviar Reseña</button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default CrearResena;