import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://34.152.27.187:5000";
// Este directorio es para empresas que no han sido verificadas
export default function EmpresasPendientes() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [aprobandoId, setAprobandoId] = useState(null);

  const fetchEmpresas = async () => { // Aquí obtendremos la información de todas las empresas con el endpoint indicado
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/company/pending`, { // Verificar la ruta del endpoint y su tipo
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setEmpresas(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al obtener empresas');
      }
    } catch (error) {
      console.error('Error al cargar empresas:', error);
      setError('Error de red. No se pudieron cargar las empresas.');
    } finally {
      setIsLoading(false);
    }
  };

  const aprobarEmpresa = async (id) => { // Aquí se llama al endpoint para actualizar el estado de aprobación de la empresa
    setAprobandoId(id);
    try {
      const response = await fetch(`${API_URL}/api/company/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setEmpresas(prev => prev.filter(emp => emp.id !== id)); // Se borrará el registro dentro de la interfaz para dar a entender que la empresa ya fue aprobada
        alert("La empresa seleccionada ha sido aprobada exitosamente.");
      } else {
        const err = await response.json();
        alert(err.message || 'Error al aprobar la empresa');
      }
    } catch (error) {
      console.error('Error aprobando empresa:', error);
      alert('Error de red. Intenta nuevamente.');
    } finally {
      setAprobandoId(null);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  
  function transformarLinkDrive(link) {
  if (!link || typeof link !== 'string') return '';

  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  if (match && match[1]) {
    
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return '';
}


  return (
    <div>
      <h1>Empresas pendientes de ser aprobadas</h1>

      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <button onClick={fetchEmpresas} disabled={isLoading} style={{ marginRight: '10px' }}>
          {isLoading ? 'Cargando...' : 'Actualizar Lista'}
        </button>
        <button onClick={() => navigate('/admin_menu')}>
          Regresar al menú
        </button>
      </div>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {!isLoading && empresas.length === 0 && (
        <div style={{ marginTop: '10px' }}>No hay empresas pendientes.</div>
      )}

      {empresas.length > 0 && (
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={th}>ID</th>
              <th style={th}>Nombre</th>
              <th style={th}>NIT</th>
              <th style={th}>Dirección</th>
              <th style={th}>Teléfono</th>
              <th style={th}>Giro de Negocio</th>
              <th style={th}>Correo</th>
              <th style={th}>Imagen Edifício</th>
              <th style={th}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa, index) => (
              <tr key={empresa.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                <td style={td}>{empresa.id}</td>
                <td style={td}>{empresa.nombre_empresa}</td>
                <td style={td}>{empresa.nit}</td>
                <td style={td}>{empresa.direccion}</td>
                <td style={td}>{empresa.telefono}</td>
                <td style={td}>{empresa.giro_negocio}</td>
                <td style={td}>{empresa.correo}</td>
                <td style={td}>
                  {empresa.foto ? (
                    <a
                      href={transformarLinkDrive(empresa.foto)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver imagen
                    </a>
                  ) : (
                    'Sin imagen'
                  )}
                </td>
                <td style={td}>
                  <button
                    onClick={() => aprobarEmpresa(empresa.id)}
                    disabled={aprobandoId === empresa.id}
                    style={{ padding: '4px 8px' }}
                  >
                    {aprobandoId === empresa.id ? 'Aprobando...' : 'Aprobar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
  fontWeight: 'bold'
};

const td = {
  border: '1px solid #ddd',
  padding: '8px'
};
