import React, { useState, useEffect } from 'react';
import './ActualizarOferta.css';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

const ActualizarOferta = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formValues, setFormValues] = useState({});
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/company/job/active`, {
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
      setError('Error de red. No se pudieron cargar los trabajos.');
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (job) => {
    setEditingOffer(job);
    setFormValues({
      nombre_puesto: job.nombre_puesto,
      nombre_empresa: job.nombre_empresa,
      ubicacion_fisica: job.ubicacion_fisica,
      sueldo: job.sueldo,
      area: job.area,
      modalidad_trabajo: job.modalidad_trabajo,
      jornada_laboral: job.jornada_laboral,
      descripcion: job.descripcion,
      idiomas: job.idiomas,
      rango_edad: job.rango_edad,
      educacion_minima: job.educacion_minima
    });
  };

  const actualizarOferta = async (id_puesto) => {
    try {
      const response = await fetch(`${API_URL}/api/company/job/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id_puesto,
          nombre_puesto: formValues.nombre_puesto,
          ubicacion_fisica: formValues.ubicacion_fisica,
          sueldo_mensual: formValues.sueldo,
          area: formValues.area,
          modalidad_trabajo: formValues.modalidad_trabajo,
          jornada_laboral: formValues.jornada_laboral,
          descripcion: formValues.descripcion,
          idiomas: formValues.idiomas,
          rango_edad: formValues.rango_edad,
          educacion_minima: formValues.educacion_minima
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Puesto actualizado correctamente');
        setEditingOffer(null);
        fetchJobs();
      } else {
        alert(data.message || 'Error al actualizar el puesto');
      }
    } catch (error) {
      alert('Error de red. Intenta nuevamente.');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="actualizar-oferta-bg">
      <div className="actualizar-oferta-container">
        <div className="user-card">
          <div className="header">
            <h2>¡Actualizar Ofertas de Trabajo!</h2>
          </div>
          <button
            onClick={() => navigate('/Menu-Empresa')}
            className="btn-regresar"
          >
            Regresar al Menú Principal
          </button>
          <p className="subtitle">Lista de empleos disponibles</p>

          {loading && (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p className="loading-text">Cargando empresa...</p>
            </div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          {!loading && editingOffer && (
            <div className="form-edicion">
              <h3>Editando Oferta ID: {editingOffer.id}</h3>
              <div className="form-grid">
                <label>
                  Nombre del Puesto:
                  <input
                    type="text"
                    value={formValues.nombre_puesto}
                    onChange={(e) => setFormValues({ ...formValues, nombre_puesto: e.target.value })}
                  />
                </label>
                <label>
                  Nombre de la Empresa:
                  <input
                    type="text"
                    value={formValues.nombre_empresa}
                    onChange={(e) => setFormValues({ ...formValues, nombre_empresa: e.target.value })}
                  />
                </label>
                <label>
                  Dirección:
                  <input
                    type="text"
                    value={formValues.ubicacion_fisica}
                    onChange={(e) => setFormValues({ ...formValues, ubicacion_fisica: e.target.value })}
                  />
                </label>
                <label>
                  Sueldo:
                  <input
                    type="text"
                    value={formValues.sueldo}
                    onChange={(e) => setFormValues({ ...formValues, sueldo: e.target.value })}
                  />
                </label>
                <label>
                  Área:
                  <input
                    type="text"
                    value={formValues.area}
                    onChange={(e) => setFormValues({ ...formValues, area: e.target.value })}
                  />
                </label>
                <label>
                  Modalidad de Trabajo:
                  <input
                    type="text"
                    value={formValues.modalidad_trabajo}
                    onChange={(e) => setFormValues({ ...formValues, modalidad_trabajo: e.target.value })}
                  />
                </label>
                <label>
                  Jornada Laboral:
                  <input
                    type="text"
                    value={formValues.jornada_laboral}
                    onChange={(e) => setFormValues({ ...formValues, jornada_laboral: e.target.value })}
                  />
                </label>
                <label>
                  Descripción:
                  <input
                    type="text"
                    value={formValues.descripcion}
                    onChange={(e) => setFormValues({ ...formValues, descripcion: e.target.value })}
                  />
                </label>
                <label>
                  Educación Mínima:
                  <input
                    type="text"
                    value={formValues.educacion_minima}
                    onChange={(e) => setFormValues({ ...formValues, educacion_minima: e.target.value })}
                  />
                </label>
                <label>
                  Idiomas:
                  <input
                    type="text"
                    value={formValues.idiomas}
                    onChange={(e) => setFormValues({ ...formValues, idiomas: e.target.value })}
                  />
                </label>
                <label>
                  Rango de Edad:
                  <input
                    type="text"
                    value={formValues.rango_edad}
                    onChange={(e) => setFormValues({ ...formValues, rango_edad: e.target.value })}
                  />
                </label>
              </div>
              <div className="form-buttons">
                <button onClick={() => actualizarOferta(editingOffer.id)} className="btn-guardar">
                  Guardar Cambios
                </button>
                <button onClick={() => setEditingOffer(null)} className="btn-cancelar">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {!loading && (
            <div className="tabla-scroll">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Empresa</th>
                    <th>Ubicación</th>
                    <th>Sueldo</th>
                    <th>Área</th>
                    <th>Modalidad</th>
                    <th>Jornada</th>
                    <th>Idioma</th>
                    <th>Educación</th>
                    <th>¿Editar?</th>

                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center' }}>No hay trabajos disponibles</td>
                    </tr>
                  ) : (
                    jobs.map((job, index) => (
                      <tr key={index}>
                        <td>{job.id}</td>
                        <td>{job.nombre_puesto}</td>
                        <td>{job.nombre_empresa}</td>
                        <td>{job.ubicacion_fisica}</td>
                        <td>Q. {job.sueldo}</td>
                        <td>{job.area}</td>
                        <td>{job.modalidad_trabajo}</td>
                        <td>{job.jornada_laboral}</td>
                        <td>{job.idiomas}</td>
                        <td>{job.educacion_minima}</td>

                        <td>
                          <button
                            onClick={() => iniciarEdicion(job)}
                            className="btn-editar"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActualizarOferta;