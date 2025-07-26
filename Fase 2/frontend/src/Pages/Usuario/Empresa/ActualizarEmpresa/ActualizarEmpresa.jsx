import React, { useEffect, useState } from 'react';
import './style-actualizar-empresa.css';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://34.152.27.187:5000";

const ActualizarEmpresa = () => {
    const [empresa, setEmpresa] = useState(null);
    const [formData, setFormData] = useState({
        nombre_empresa: '',
        nit: '',
        direccion: '',
        telefono: '',
        giro_negocio: '',
        contrasena: '',
        aprobado: '',
        fecha_creacion: '',
        fecha_actualizado: '',
        activo: '',
        foto: ''
    });
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerInfo = async () => {
            try {
                const response = await fetch(`${API_URL}/api/company/info`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setEmpresa(data);
                    setFormData({
                        nombre_empresa: data.nombre_empresa || '',
                        nit: data.nit || '',
                        direccion: data.direccion || '',
                        telefono: data.telefono || '',
                        giro_negocio: data.giro_negocio || '',
                        contrasena: '',
                        aprobado: data.aprobado || '',
                        fecha_creacion: data.fecha_creacion || '',
                        fecha_actualizado: data.fecha_actualizado || '',
                        activo: data.activo || '',
                        foto: data.foto || ''
                    });
                } else {
                    const err = await response.json();
                    setError(err.message || 'Error al obtener la información.');
                }
            } catch (e) {
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
            const response = await fetch(`${API_URL}/api/company/update`, {
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
            setError('Error de red. Intente nuevamente.');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="spinner" />
                <p style={{ textAlign: 'center', marginTop: '10px' }}>Cargando información de la empresa...</p>
            </div>
        );
    }

    if (error && !empresa) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="container">
            <h1 className="titulo">Actualizar Información de la Empresa</h1>
            <div className="card">
                <form className="formulario" onSubmit={handleSubmit}>
                    <label>Nombre de la Empresa:</label>
                    <input type="text" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange} />
                    <label>NIT:</label>
                    <input type="text" name="nit" value={formData.nit} onChange={handleChange} />
                    <label>Dirección:</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
                    <label>Teléfono:</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                    <label>Giro de Negocio:</label>
                    <input type="text" name="giro_negocio" value={formData.giro_negocio} onChange={handleChange} />
                    <label>Contraseña:</label>
                    <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} />
                    <label>Fecha de Creación:</label>
                    <input type="text" name="fecha_creacion" value={formData.fecha_creacion} readOnly />
                    <label>Fecha Actualizado:</label>
                    <input type="text" name="fecha_actualizado" value={formData.fecha_actualizado} readOnly />
                    <label>Foto (URL):</label>
                    <input type="text" name="foto" value={formData.foto} onChange={handleChange} />
                    <button type="submit" className="btn-aplicar">Guardar Cambios</button>
                    <button type="button" onClick={() => navigate('/Menu-Empresa')}>Regresar al menú principal</button>
                </form>
                {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default ActualizarEmpresa;