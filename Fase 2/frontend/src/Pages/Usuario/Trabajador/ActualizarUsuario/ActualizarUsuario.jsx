import React, { useEffect, useState } from 'react';
import './styleUpdate.css';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://34.152.27.187:5000";
const ActualizaUsuario = () => {
    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        genero: '',
        direccion: '',
        telefono: '',
        contrasena: '',
    });
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const obtenerInfo = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/info`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsuario(data);
                    setFormData({
                        nombre: data.nombre || '',
                        apellidos: data.apellidos || '',
                        genero: data.genero || '',
                        direccion: data.direccion || '',
                        telefono: data.telefono || '',
                        contrasena: '',
                    });
                } else {
                    const err = await response.json();
                    setError(err.message || 'Error al obtener la información.');
                }
            } catch (e) {
                console.error(e);
                setError('Error de red. Intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        obtenerInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                setMensaje(result.message);
            } else {
                setError(result.message || 'No se pudo actualizar la información.');
            }
        } catch (e) {
            console.error(e);
            setError('Error de red. Intente nuevamente.');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="spinner" />
                <p style={{ textAlign: 'center', marginTop: '10px' }}>Cargando información del usuario...</p>
            </div>
        );
    }

    if (error && !usuario) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="container">
            <h1 className="titulo">Actualizar Información del Usuario</h1>

            <div className="card">
                <form className="formulario" onSubmit={handleSubmit}>
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                    <label>Apellidos:</label>
                    <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} />
                    <label>Género (Usted no se puede cambiar el género):</label>
                    <input
                        type="text"
                        value={formData.genero === 'M' ? 'Masculino' : formData.genero === 'F' ? 'Femenino' : formData.genero}
                        readOnly
                    />
                    <label>Dirección:</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
                    <label>Teléfono:</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                    <label>Contraseña:</label>
                    <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} />
                    <button type="submit" className="btn-aplicar">Guardar Cambios</button>
                    <button onClick={() => navigate('/InicioUsuario')}>Regresar al menú principal</button>
                </form>

                {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default ActualizaUsuario;
