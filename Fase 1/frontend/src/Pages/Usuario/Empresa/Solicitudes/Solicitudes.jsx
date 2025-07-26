import { useEffect, useState } from 'react';
import './style.css';

export default function PostulacionesPendientes() {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [procesandoId, setProcesandoId] = useState(null);
  const [aprobandoId, setAprobandoId] = useState(null);

  const fetchPuestos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/company/job/attention', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPuestos(data);
      } else {
        const err = await response.json();
        setError(err.message || 'Error al obtener puestos.');
      }
    } catch (e) {
      setError('Error de red. No se pudo cargar la información.');
    } finally {
      setLoading(false);
    }
  };

  const actualizarACVISTO = async (id_aplicacion) => {
    setProcesandoId(id_aplicacion);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/company/job/cv`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_aplicacion }),
      });
      if (response.ok) {
        alert("Usted será rediriguido al CV del aspirante.");
        fetchPuestos();
      } else {
        const err = await response.json();
        alert(err.message || 'Error al abrir el CV');
      }
    } catch (error) {
      console.error('Error abriendo CV:', error);
      alert('Error de red. Intenta nuevamente.');
    } finally {
      setProcesandoId(null);
    }
  };

  const actualizarFinalista = async (id_aplicacion) => {
    setAprobandoId(id_aplicacion);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/company/job/update/finalist', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id_aplicacion }),
      });

      if (response.ok) {
        alert("El aspirante es finalista.");
        fetchPuestos();
      } else {
        const err = await response.json();
        alert(err.message || 'Error al cambiar de estado');
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error de red. Intenta nuevamente.');
    } finally {
      setAprobandoId(null);
    }
  };

  const actualizarProcesoFinalizado = async (id_aplicacion) => {
    setAprobandoId(id_aplicacion);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/company/job/update/process-finished', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id_aplicacion }),
      });

      if (response.ok) {
        alert("Se ha finalizado el proceso del postulante.");
        fetchPuestos();
      } else {
        const err = await response.json();
        alert(err.message || 'Error al finalizar el proceso');
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error de red. Intenta nuevamente.');
    } finally {
      setAprobandoId(null);
    }
  };



  useEffect(() => {
    fetchPuestos();
  }, []);

  return (
    <div className="container">
      <h2 className="title">Postulaciones Pendientes</h2>
      <a href="/Menu-Empresa" className="volver">Volver al inicio</a> 
      <div className="header" style={{ marginBottom: '20px' }}>
        <button
          className="search-button"
          onClick={fetchPuestos}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && puestos.length === 0 && (
        <p>No hay postulaciones pendientes.</p>
      )}

      {puestos.length > 0 && (
        <div className="user-card">
          <table className="user-table">
            <thead>
              <tr>
                <th>Nombre Aspirante</th>
                <th>Puesto</th>
                <th>Ubicación</th>
                <th>Contrato</th>
                <th>Jornada</th>
                <th>Modalidad</th>
                <th>Educación</th>
                <th>Experiencia</th>
                <th>Área</th>
                <th>CV</th>
                <th>Finalista</th>
                <th>Finalizado</th>
              </tr>
            </thead>
            <tbody>
              {puestos.map((p, index) => (
                <tr key={index}>
                  <td>{p.nombre_usuario}</td>
                  <td>{p.nombre_puesto}</td>
                  <td>{p.ubicacion_fisica}</td>
                  <td>{p.tipo_contrato}</td>
                  <td>{p.jornada_laboral}</td>
                  <td>{p.modalidad_trabajo}</td>
                  <td>{p.educacion_minima}</td>
                  <td>{p.anios_experiencia}</td>
                  <td>{p.area}</td>
                  <td>
                    <button
                      className="apply-btn"
                      disabled={procesandoId !== null}
                      onClick={async () => {
                        await actualizarACVISTO(p.id);
                        window.open(p.cv, '_blank');
                      }}
                    >
                      {aprobandoId === p.id ? 'Visualizando CV...' : 'CV'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="apply-btn"
                      disabled={procesandoId !== null}
                      onClick={() =>
                        actualizarFinalista(
                          p.id
                        )
                      }
                    >
                      {aprobandoId === p.id ? 'Asignando Finalista...' : 'Finalista'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="apply-btn"
                      disabled={procesandoId !== null}
                      onClick={() =>
                        actualizarProcesoFinalizado(
                          p.id
                        )
                      }
                    >
                      {aprobandoId === p.id ? 'Finalizando Solicitud...' : 'Finalizado'}
                    </button>
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
