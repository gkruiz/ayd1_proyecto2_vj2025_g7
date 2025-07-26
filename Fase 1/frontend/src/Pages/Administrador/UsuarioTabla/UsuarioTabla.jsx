    import { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    // Este directorio es para usuarios que no han sido verificadas
    export default function UsuariosTablas() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [aprobandoId, setAprobandoId] = useState(null);

    const fetchUsuarios = async () => { // Aquí obtendremos la información de todos los usuarios con el endpoint indicado
        setIsLoading(true);
        setError('');

        try {
        const response = await fetch('http://127.0.0.1:5000/api/admin/user', { // Verificar la ruta del endpoint y su tipo
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
        setError('Error de red. No se pudieron cargar las usuarios.');
        } finally {
        setIsLoading(false);
        }
    };

    const darDebaja = async (id) => { // Aquí se llama al endpoint para dar de baja a una usuarios
        setAprobandoId(id);
        try {
        const response = await fetch('http://127.0.0.1:5000/api/admin/user/desactivate', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id }),
        });

        if (response.ok) {
            alert("El usuario ha sido dado de baja."); // Si todo sale bien, entonces la indica que el usuario ha sido dada de baja
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
                <th style={th}>Acción</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.map((usuarios, index) => (
                <tr key={usuarios.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                    <td style={td}>{usuarios.id}</td>
                    <td style={td}>{usuarios.nombre}</td>
                    <td style={td}>{usuarios.apellidos}</td>
                    <td style={td}>{usuarios.genero === 'M' ? 'Masculino' : 'Femenino'}</td>
                    <td style={td}>{usuarios.cui}</td>
                    <td style={td}>{usuarios.direccion}</td>
                    <td style={td}>{usuarios.telefono}</td>
                    <td style={td}>{usuarios.fecha_nacimiento}</td>
                    <td style={td}>{usuarios.correo}</td>
                    <td style={td}>{usuarios.activo}</td>
                    <td style={td}>
                    <button
                        onClick={() => darDebaja(usuarios.id)}
                        disabled={aprobandoId === usuarios.id}
                        style={{ padding: '4px 8px' }}
                    >
                        {aprobandoId === usuarios.id ? 'Dando de baja...' : 'Dar de baja'}
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
