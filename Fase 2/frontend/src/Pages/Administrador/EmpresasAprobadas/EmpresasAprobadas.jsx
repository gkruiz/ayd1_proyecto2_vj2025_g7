import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles-empresa.css'
const API_URL = "http://34.152.27.187:5000";
export default function EmpresasAprobadas() {
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [aprobandoId, setAprobandoId] = useState(null);
    const [editingEmpresa, setEditingEmpresa] = useState(null);
    const [formValues, setFormValues] = useState({});

    const fetchEmpresas = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/company/approved`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
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

    const darDebaja = async (id) => {
        setAprobandoId(id);
        try {
            const response = await fetch(`${API_URL}/api/admin/company/desactivate`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                alert("La empresa ha sido dada de baja.");
                fetchEmpresas();
            } else {
                const err = await response.json();
                alert(err.message || 'Error al dar de baja a la empresa');
            }
        } catch (error) {
            console.error('Error dando de baja a la empresa:', error);
            alert('Error de red. Intenta nuevamente.');
        } finally {
            setAprobandoId(null);
        }
    };

    const iniciarEdicion = (empresa) => {
        setEditingEmpresa(empresa);
        setFormValues({
            nombre_empresa: empresa.nombre_empresa,
            nit: empresa.nit,
            direccion: empresa.direccion,
            telefono: empresa.telefono,
            giro_negocio: empresa.giro_negocio,
            contrasena: '',
        });
    };

    const actualizarEmpresa = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/company/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id, ...formValues }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Empresa actualizada correctamente');
                setEditingEmpresa(null);
                fetchEmpresas();
            } else {
                alert(data.message || 'Error al actualizar empresa');
            }
        } catch (error) {
            console.error('Error al actualizar empresa:', error);
            alert('Error de red. Intenta nuevamente.');
        }
    };

    useEffect(() => {
        fetchEmpresas();
    }, []);

    return (
        <div className="empresas-container">
            <h1>Empresas Aprobadas</h1>

            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <button onClick={fetchEmpresas} disabled={isLoading} style={{ marginRight: '10px' }}>
                    {isLoading ? 'Cargando...' : 'Actualizar Lista'}
                </button>
                <button onClick={() => navigate('/admin_menu')}>Regresar al menú</button>
            </div>

            {editingEmpresa && (
                <div className="form-edicion">
                    <h3>Editando Empresa ID {editingEmpresa.id}</h3>
                    <label>Nombre:
                        <input type="text" value={formValues.nombre_empresa} onChange={(e) => setFormValues({ ...formValues, nombre_empresa: e.target.value })} />
                    </label><br />
                    <label>NIT:
                        <input type="text" value={formValues.nit} onChange={(e) => setFormValues({ ...formValues, nit: e.target.value })} />
                    </label><br />
                    <label>Dirección:
                        <input type="text" value={formValues.direccion} onChange={(e) => setFormValues({ ...formValues, direccion: e.target.value })} />
                    </label><br />
                    <label>Teléfono:
                        <input type="text" value={formValues.telefono} onChange={(e) => setFormValues({ ...formValues, telefono: e.target.value })} />
                    </label><br />
                    <label>Giro de Negocio:
                        <input type="text" value={formValues.giro_negocio} onChange={(e) => setFormValues({ ...formValues, giro_negocio: e.target.value })} />
                    </label><br />
                    <label>Contraseña:
                        <input type="password" value={formValues.contrasena} onChange={(e) => setFormValues({ ...formValues, contrasena: e.target.value })} />
                    </label><br />
                    <button onClick={() => actualizarEmpresa(editingEmpresa.id)}>Guardar Cambios</button>
                    <button onClick={() => setEditingEmpresa(null)} style={{ marginLeft: '10px' }}>Cancelar</button>
                </div>
            )}

            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

            {!isLoading && empresas.length === 0 && <div>No hay empresas pendientes.</div>}

            {empresas.length > 0 && (
                <table className="tabla-empresas">
                    <thead>
    <tr>
        <th style={th}>Nombre</th>
        <th style={th}>NIT</th>
        <th style={th}>Dirección</th>
        <th style={th}>Teléfono</th>
        <th style={th}>Giro de Negocio</th>
        <th style={th}>Correo</th>
        <th style={th}>Aprobado</th>
        <th style={th}>Estado</th>
        <th style={th}>¿Dar de Baja?</th>
        <th style={th}>Editar</th>
    </tr>
</thead>
<tbody>
    {empresas.map((empresa) => (
        <tr key={empresa.id}>
            <td style={td}>{empresa.nombre_empresa}</td>
            <td style={td}>{empresa.nit}</td>
            <td style={td}>{empresa.direccion}</td>
            <td style={td}>{empresa.telefono}</td>
            <td style={td}>{empresa.giro_negocio}</td>
            <td style={td}>{empresa.correo}</td>
            <td style={td}>{empresa.aprobado === '1' ? '✅' : empresa.aprobado}</td>
            <td style={td}>{empresa.activo}</td>
            <td style={td}>
                <button onClick={() => darDebaja(empresa.id)} disabled={aprobandoId === empresa.id}>
                    {aprobandoId === empresa.id ? 'Dando de baja...' : 'Si'}
                </button>
            </td>
            <td style={td}>
                <button onClick={() => iniciarEdicion(empresa)}>Editar</button>
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
