import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
const API_URL = "http://34.152.27.187:5000";
const ReporteEmpresa = () => {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [desactivando, setDesactivando] = useState(null);

  const obtenerReportes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/user/company/report`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setReportes(data);
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError('Error al obtener reportes.');
    } finally {
      setLoading(false);
    }
  };

  const darDeBajaEmpresa = async (id_empresa) => {
    if (!window.confirm('¿Está seguro que desea dar de baja a esta empresa?')) return;
    setDesactivando(id_empresa);
    try {
      const response = await fetch(`${API_URL}/api/admin/company/desactivate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: id_empresa }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Empresa dada de baja exitosamente');
        obtenerReportes();
      } else {
        alert(data.message || 'Error al dar de baja la empresa');
      }
    } catch (e) {
      alert('Error de red al dar de baja la empresa');
    } finally {
      setDesactivando(null);
    }
  };

  useEffect(() => {
    obtenerReportes();
  }, []);

  return (
    <div className="container py-5">
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <button onClick={obtenerReportes} disabled={loading} style={{ marginRight: '10px', width: '200px' }}>
          {loading ? 'Cargando...' : 'Actualizar Lista'}
        </button>
        <button onClick={() => navigate('/admin_menu')} style={{ marginRight: '10px', width: '200px' }}>
          Regresar al menú
        </button>
      </div>
      <div className="card">
        <div className="card-header bg-white">
          <h3 className="mb-0">Reporte de Empresas</h3>
          <p className="text-muted mb-0">Gestione las denuncias realizadas por los usuarios</p>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Motivo</th>
                  <th>Empresa</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>Cargando...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" style={{ color: 'red', textAlign: 'center' }}>{error}</td>
                  </tr>
                ) : reportes.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No hay reportes registrados</td>
                  </tr>
                ) : (
                  reportes.map((reporte, idx) => (
                    <tr key={idx}>
                      <td>{reporte.categoria}</td>
                      <td>{reporte.motivo}</td>
                      <td>{reporte.nombre_empresa}</td>
                      <td>{reporte.nombre_usuario}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          disabled={desactivando === reporte.id_empresa}
                          onClick={() => darDeBajaEmpresa(reporte.id_empresa)}
                        >
                          {desactivando === reporte.id_empresa ? 'Procesando...' : 'Dar de baja a la empresa'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteEmpresa;