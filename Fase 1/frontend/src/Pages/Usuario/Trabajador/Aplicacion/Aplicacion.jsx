import React, { useState } from 'react';
import './style.css';

const Aplicacion_Usuario = () => {
  const [inputId, setInputId] = useState('');
  const [job, setJob] = useState(null);
  const [cv, setCv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const buscarPuesto = async () => {
    if (!inputId.trim()) {
      setError('Por favor, ingrese un ID válido');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setJob(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/user/job/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: parseInt(inputId) }),
      });

      if (response.ok) {
        const data = await response.json();
        setJob(data);
      } else {
        const err = await response.json();
        setError(err.message || 'Error al buscar el puesto.');
      }
    } catch (e) {
      console.error('Error en búsqueda:', e);
      setError('Error de red. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const aplicarTrabajo = async () => {
    if (!cv.trim()) {
      setError('Por favor, ingrese su CV antes de aplicar.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/user/job/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: parseInt(inputId),
          cv,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMsg(result.message);
      } else {
        setError(result.message || 'No se pudo enviar la solicitud.');
      }
    } catch (e) {
      console.error('Error al aplicar:', e);
      setError('Error de red. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="titulo">Consultar y Aplicar a un Puesto</h1>

      <div className="card">
        <div className="header">
          <a href="/InicioUsuario" className="volver">Volver al inicio</a>
          <span className="icono-salida">⎋</span>
        </div>

        <div className="formulario">
          <label htmlFor="input-id"><strong>ID del Puesto:</strong></label>
          <input
            id="input-id"
            type="number"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="search-input"
            placeholder="Ingrese el ID del puesto"
          />
          <button onClick={buscarPuesto} className="search-button">Buscar</button>
        </div>

        {loading && <p>Cargando datos del puesto...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

        {job && (
          <div className="formulario">
            <p><strong>Nombre del puesto:</strong> {job.nombre_puesto}</p>
            <p><strong>Ubicación de la empresa:</strong> {job.ubicacion_fisica}</p>
            <p><strong>Empresa que ofrece el puesto:</strong> {job.nombre_empresa}</p>
            <p><strong>Sueldo ofrecido mensualmente:</strong> Q. {job.sueldo_mensual}</p>
            <p><strong>Tipo de contrato:</strong> {job.tipo_contrato}</p>
            <p><strong>Jornada laboral requerida:</strong> {job.jornada_laboral}</p>
            <p><strong>Modalidad de trabajo:</strong> {job.modalidad_trabajo}</p>
            <p><strong>Descripción:</strong> {job.descripcion}</p>
            <p><strong>Educación mínima:</strong> {job.educacion_minima}</p>
            <p><strong>Años de experiencia:</strong> {job.anios_experiencia}</p>
            <p><strong>Idiomas solicitados:</strong> {job.idiomas}</p>
            <p><strong>Rango de edad:</strong> {job.rango_edad}</p>

            <label htmlFor="cv"><strong>CV:</strong></label>
            <textarea
              id="cv"
              cols = "30"
              className="search-input"
              placeholder="Ingrese el link de su CV (Debe estar subído a MEGA o Google Drive)"
              value={cv}
              onChange={(e) => setCv(e.target.value)}
            ></textarea>

            <button onClick={aplicarTrabajo} className="btn-aplicar">📤 Enviar CV</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Aplicacion_Usuario;
