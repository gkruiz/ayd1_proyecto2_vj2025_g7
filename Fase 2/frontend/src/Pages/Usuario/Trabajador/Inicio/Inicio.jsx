import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './iniciousuario.css';
const API_URL = "http://34.152.27.187:5000";
const Inicio_Usuario = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [ubicacionText, setUbicacionText] = useState('');
  const [ubicacionSelect, setUbicacionSelect] = useState('');
  const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);

  const [fechaText, setFechaText] = useState('');
  const [fechaSelect] = useState('');

  const [jornadaText, setJornadaText] = useState('');
  const [jornadaSelect, setJornadaSelect] = useState('');
  const [jornadasDisponibles, setJornadasDisponibles] = useState([]);

  const [modalidadText, setModalidadText] = useState('');
  const [modalidadSelect, setModalidadSelect] = useState('');
  const [modalidadesDisponibles, setModalidadesDisponibles] = useState([]);

  const [areaText, setAreaText] = useState('');
  const [areaSelect, setAreaSelect] = useState('');
  const [areasDisponibles, setAreasDisponibles] = useState([]);

  const navigate = useNavigate();

  const fetchJobsPorFiltro = async (filtro, valor) => {
    if (!valor.trim()) return;

    setLoading(true);
    setError(null);

    let url = '';
    let body = {};

    switch (filtro) {
      case 'ubicacion':
        url = `${API_URL}/api/user/job/location`;
        body = { ubicacion_fisica: valor };
        break;
      case 'fechaCreacion':
        url = `${API_URL}/api/user/job/date`;
        body = { fecha_creacion: valor };
        break;
      case 'jornada':
        url = `${API_URL}/api/user/job/jornada`;
        body = { jornada_laboral: valor };
        break;
      case 'modalidad':
        url = `${API_URL}/api/user/job/modalidad`;
        body = { modalidad_trabajo: valor };
        break;
      case 'area':
        url = `${API_URL}/api/user/job/area`;
        body = { area: valor };
        break;
      default:
        return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        const err = await response.json();
        setError(err.message || 'Error al buscar trabajos');
      }
    } catch (err) {
      setError('Error de red. No se pudieron buscar trabajos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cargarOpcionesFiltros = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/job/active`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();

          const ubicaciones = [...new Set(data.map(job => job.ubicacion_fisica).filter(Boolean))];
          const jornadas = [...new Set(data.map(job => job.jornada_laboral).filter(Boolean))];
          const modalidades = [...new Set(data.map(job => job.modalidad_trabajo).filter(Boolean))];
          const areas = [...new Set(data.map(job => job.area).filter(Boolean))];

          setUbicacionesDisponibles(ubicaciones);
          setJornadasDisponibles(jornadas);
          setModalidadesDisponibles(modalidades);
          setAreasDisponibles(areas);
        }
      } catch (err) {
        console.error('Error al cargar opciones de filtros', err);
      }
    };

    cargarOpcionesFiltros();
  }, []);

  useEffect(() => {
    const valorFiltro = ubicacionText.trim() || ubicacionSelect;
    if (valorFiltro) fetchJobsPorFiltro('ubicacion', valorFiltro);
  }, [ubicacionText, ubicacionSelect]);

  useEffect(() => {
    const valorFiltro = fechaText.trim() || fechaSelect;
    if (valorFiltro) fetchJobsPorFiltro('fechaCreacion', valorFiltro);
  }, [fechaText, fechaSelect]);

  useEffect(() => {
    const valorFiltro = jornadaText.trim() || jornadaSelect;
    if (valorFiltro) fetchJobsPorFiltro('jornada', valorFiltro);
  }, [jornadaText, jornadaSelect]);

  useEffect(() => {
    const valorFiltro = modalidadText.trim() || modalidadSelect;
    if (valorFiltro) fetchJobsPorFiltro('modalidad', valorFiltro);
  }, [modalidadText, modalidadSelect]);

  useEffect(() => {
    const valorFiltro = areaText.trim() || areaSelect;
    if (valorFiltro) fetchJobsPorFiltro('area', valorFiltro);
  }, [areaText, areaSelect]);

  useEffect(() => {
    if (
      !ubicacionText.trim() && !ubicacionSelect &&
      !fechaText.trim() && !fechaSelect &&
      !jornadaText.trim() && !jornadaSelect &&
      !modalidadText.trim() && !modalidadSelect &&
      !areaText.trim() && !areaSelect
    ) {
      const fetchAllJobs = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${API_URL}/api/user/job/active`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
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
      fetchAllJobs();
    }
  }, [ubicacionText,
    ubicacionSelect,
    fechaText,
    fechaSelect,
    jornadaText,
    jornadaSelect,
    modalidadText,
    modalidadSelect,
    areaText,
    areaSelect
  ]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Sesión cerrada correctamente.');
        navigate('/');
      } else {
        alert('Error al cerrar sesión.');
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error en logout:', error);
      alert('Error al cerrar sesión.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Inicio Usuario</h1>

      <div className="user-card">
        <div className="header"><h2>¡Bienvenido!</h2></div>

        <p className="subtitle">Lista de empleos disponibles!</p>

        <div className="filters">

          <div className="filter-group-horizontal-iu">
            <div>
              <label>Ubicación</label>
              <input
                type="text"
                placeholder="Escribe ubicación"
                value={ubicacionText}
                onChange={(e) => setUbicacionText(e.target.value)}
              />
              <select
                value={ubicacionSelect}
                onChange={(e) => setUbicacionSelect(e.target.value)}
              >
                <option value="">Seleccione ubicación</option>
                {ubicacionesDisponibles.map((ubicacion, i) => (
                  <option key={i} value={ubicacion}>{ubicacion}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group-horizontal-iu">
            <div>
              <label>Fecha creación</label>
              <input
                type="date"
                value={fechaText}
                onChange={(e) => setFechaText(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group-horizontal-iu">
            <div>
              <label>Jornada</label>
              <input
                type="text"
                value={jornadaText}
                onChange={(e) => setJornadaText(e.target.value)}
              />
              <select
                value={jornadaSelect}
                onChange={(e) => setJornadaSelect(e.target.value)}
              >
                <option value="">Seleccione jornada</option>
                {jornadasDisponibles.map((j, i) => (
                  <option key={i} value={j}>{j}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group-horizontal-iu">
            <div>
              <label>Modalidad</label>
              <input
                type="text"
                value={modalidadText}
                onChange={(e) => setModalidadText(e.target.value)}
              />
              <select
                value={modalidadSelect}
                onChange={(e) => setModalidadSelect(e.target.value)}
              >
                <option value="">Seleccione modalidad</option>
                {modalidadesDisponibles.map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group-horizontal-iu">
            <div>
              <label>Área</label>
              <input
                type="text"
                value={areaText}
                onChange={(e) => setAreaText(e.target.value)}
              />
              <select
                value={areaSelect}
                onChange={(e) => setAreaSelect(e.target.value)}
              >
                <option value="">Seleccione área</option>
                {areasDisponibles.map((a, i) => (
                  <option key={i} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        <div className="button-group">
          <button type="button" onClick={() => navigate('/AplicacionUsuario')}>Aplicar Empleo</button>
          <button type="button" onClick={() => navigate('/update-user')}>Actualizar mi Información</button>
          <button type="button" onClick={() => navigate('/crear-resena')}>Crear Reseña</button>
          <button type="button" onClick={() => navigate('/ver-resena')}>Ver reseñas a empresas</button>
          <button type="button" onClick={() => navigate('/empresas-activas')}>Buscar Empresas</button>
          <button type="button" onClick={() => navigate('/aplicaciones')}>Ver aplicaciones realizadas</button>
          <button type="button" onClick={() => navigate('/report-company')}>Reportar empresa</button>

          <button type="button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>

        {loading && <p>
          <span className="spinner" />
        </p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="iu-tabla-scroll">
          <table className="iu-user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Ubicación</th>
                <th>Sueldo</th>
                <th>Modalidad</th>
                <th>Jornada</th>
                <th>Fecha Publicación</th>
                <th>Área</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && !loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>
                    No hay trabajos disponibles
                  </td>
                </tr>
              ) : (
                jobs.map((job, index) => (
                  <tr key={index}>
                    <td>{job.id}</td>
                    <td>{job.nombre_puesto}</td>
                    <td>{job.nombre_empresa}</td>
                    <td>{job.ubicacion_fisica}</td>
                    <td>Q. {job.sueldo}</td>
                    <td>{job.modalidad_trabajo}</td>
                    <td>{job.jornada_laboral}</td>
                    <td>{job.fecha_creacion}</td>
                    <td>{job.area}</td>
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

export default Inicio_Usuario;
