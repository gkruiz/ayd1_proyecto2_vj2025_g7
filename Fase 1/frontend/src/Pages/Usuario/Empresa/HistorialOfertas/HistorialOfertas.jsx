import { useEffect, useState } from 'react';
import './style.css';

export default function HistorialPuestosEmpresa() {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistorial = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/company/job/record', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPuestos(data);
      } else {
        const err = await response.json();
        setError(err.message || 'Error al obtener historial de puestos.');
      }
    } catch (e) {
      setError('Error de red. No se pudo cargar el historial.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  return (
    <div className="container">
      <h2 className="title">Historial de Puestos</h2>
      <a href="/Menu-Empresa" className="volver">Volver al inicio</a> 
      <div className="header" style={{ marginBottom: '20px' }}>
        <button
          className="search-button"
          onClick={fetchHistorial}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && puestos.length === 0 && (
        <p>No hay historial de puestos disponibles.</p>
      )}

      {puestos.length > 0 && (
        <div className="user-card">
          <table className="user-table">
            <thead>
              <tr>
                <th>Puesto</th>
                <th>Ubicación</th>
                <th>Contrato</th>
                <th>Jornada</th>
                <th>Modalidad</th>
                <th>Educación</th>
                <th>Experiencia</th>
                <th>Idiomas</th>
                <th>Edad</th>
                <th>Área</th>
                <th>Fecha Creación</th>
                <th>Estado</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              {puestos.map((p, i) => (
                <tr key={i}>
                  <td>{p.nombre_puesto}</td>
                  <td>{p.ubicacion_fisica}</td>
                  <td>{p.tipo_contrato}</td>
                  <td>{p.jornada_laboral}</td>
                  <td>{p.modalidad_trabajo}</td>
                  <td>{p.educacion_minima}</td>
                  <td>{p.anios_experiencia}</td>
                  <td>{p.idiomas}</td>
                  <td>{p.rango_edad}</td>
                  <td>{p.area}</td>
                  <td>{new Date(p.fecha_creacion).toLocaleDateString()}</td>
                  <td>{p.estado_proceso || 'Sin aplicaciones'}</td>
                  <td style={{ color: p.activo === 1 ? 'green' : 'red' }}>
                    {p.activo === 1 ? 'Activo' : 'Inactivo'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
