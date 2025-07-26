import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://34.152.27.187:5000";
export default function UsuariosTablas() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [aprobandoId, setAprobandoId] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [formValues, setFormValues] = useState({});

    const fetchUsuarios = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/admin/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al obtener los usuarios');
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setError('Error de red. No se pudieron cargar los usuarios.');
        } finally {
            setIsLoading(false);
        }
    };

    const darDebaja = async (id) => {
        setAprobandoId(id);
        try {
            const response = await fetch(`${API_URL}/api/admin/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                alert("El usuario ha sido dado de baja.");
                fetchUsuarios();
            } else {
                const err = await response.json();
                alert(err.message || 'Error al dar de baja al usuario');
            }
        } catch (error) {
            console.error('Error dando de baja al usuario:', error);
            alert('Error de red. Intenta nuevamente.');
        } finally {
            setAprobandoId(null);
        }
    };

    const iniciarEdicion = (usuario) => {
        setEditingUser(usuario);
        setFormValues({
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            genero: usuario.genero,
        });
    };

    const actualizarUsuario = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    id,
                    ...formValues,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Usuario actualizado correctamente');
                setEditingUser(null);
                fetchUsuarios();
            } else {
                alert(data.message || 'Error al actualizar usuario');
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert('Error de red. Intenta nuevamente.');
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <div>
            <h1>Usuarios registrados en el sistema</h1>

            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <button onClick={fetchUsuarios} disabled={isLoading} style={{ marginRight: '10px' }}>
                    {isLoading ? 'Cargando...' : 'Actualizar Lista'}
                </button>
                <button onClick={() => navigate('/admin_menu')}>
                    Regresar al menú
                </button>
            </div>

            {editingUser && (
                <div className="form-edicion">
                    <h3>Editando Usuario ID: {editingUser.id}</h3>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            value={formValues.nombre}
                            onChange={(e) => setFormValues({ ...formValues, nombre: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Apellidos:
                        <input
                            type="text"
                            value={formValues.apellidos}
                            onChange={(e) => setFormValues({ ...formValues, apellidos: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Dirección:
                        <input
                            type="text"
                            value={formValues.direccion}
                            onChange={(e) => setFormValues({ ...formValues, direccion: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            value={formValues.telefono}
                            onChange={(e) => setFormValues({ ...formValues, telefono: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Contraseña:
                        <input
                            type="password"
                            value={formValues.contrasena || ''}
                            onChange={(e) => setFormValues({ ...formValues, contrasena: e.target.value })}
                        />
                    </label>
                    <br />
                    <button onClick={() => actualizarUsuario(editingUser.id)} style={{ marginTop: '10px' }}>
                        Guardar Cambios
                    </button>
                    <button onClick={() => setEditingUser(null)} style={{ marginLeft: '10px', marginTop: '10px' }}>
                        Cancelar
                    </button>
                </div>
            )}


            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

            {!isLoading && usuarios.length === 0 && (
                <div style={{ marginTop: '10px' }}>No hay usuarios pendientes.</div>
            )}

            {usuarios.length > 0 && (
                <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={th}>ID</th>
                            <th style={th}>Nombre</th>
                            <th style={th}>Apellido</th>
                            <th style={th}>Genero</th>
                            <th style={th}>CUI</th>
                            <th style={th}>Dirección</th>
                            <th style={th}>Teléfono</th>
                            <th style={th}>Fecha de nacimiento</th>
                            <th style={th}>Correo</th>
                            <th style={th}>Estado</th>
                            <th style={th}>Dar de baja</th>
                            <th style={th}>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                                <td style={td}>{usuario.id}</td>
                                <td style={td}>{usuario.nombre}</td>
                                <td style={td}>{usuario.apellidos}</td>
                                <td style={td}>{usuario.genero === 'M' ? 'Masculino' : 'Femenino'}</td>
                                <td style={td}>{usuario.cui}</td>
                                <td style={td}>{usuario.direccion}</td>
                                <td style={td}>{usuario.telefono}</td>
                                <td style={td}>{usuario.fecha_nacimiento}</td>
                                <td style={td}>{usuario.correo}</td>
                                <td style={td}>{usuario.activo}</td>
                                <td style={td}>
                                    <button
                                        onClick={() => darDebaja(usuario.id)}
                                        disabled={aprobandoId === usuario.id}
                                        style={{ padding: '4px 8px' }}
                                    >
                                        {aprobandoId === usuario.id ? 'Dando de baja...' : 'Dar de baja'}
                                    </button>
                                </td>
                                <td style={td}>
                                    <button
                                        onClick={() => iniciarEdicion(usuario)}
                                        style={{ padding: '4px 8px' }}
                                    >
                                        Editar
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
    fontWeight: 'bold',
};

const td = {
    border: '1px solid #ddd',
    padding: '8px',
};
