import React, { useState, useEffect } from 'react';
import './style-reportar-usuario';
const API_URL = "http://34.152.27.187:5000";
const categoriasReporte = [
    "Comportamiento inapropiado",
    "Falsificación de documentos",
    "Falta de compromiso",
    "Conducta ofensiva",
    "Otro"
];
 
const ReportarUsuarioEmpresa = () => {
    const [usuariosFinalistas, setUsuariosFinalistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState('');
    const [categoria, setCategoria] = useState('');
    const [motivo, setMotivo] = useState('');

    const enviarReporte = async () => {
        if (!selectedUsuario || !categoria || !motivo) {
            setError('Debe seleccionar un usuario, una categoría y escribir el motivo');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const response = await fetch(`${API_URL}/api/company/report/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    nombre_usuario: selectedUsuario,
                    categoria: categoria,
                    motivo: motivo
                })
            });

            const result = await response.json();
            if (response.ok) {
                setSuccessMsg(result.message);
                setSelectedUsuario('');
                setCategoria('');
                setMotivo('');
            } else {
                setError(result.message);
            }
        } catch (e) {
            setError('Error al enviar reporte');
        } finally {
            setLoading(false);
        }
    };

    const obtenerUsuariosFinalistas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/empresa/aplicaciones-finalistas`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setUsuariosFinalistas(data.aplicaciones || []);
            } else {
                setError(data.message);
            }
        } catch (e) {
            setError('Error al obtener usuarios finalistas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerUsuariosFinalistas();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Reportar Usuario</h1>

            <div className="user-card">
                <div className="header">
                    <a href="/Menu-Empresa" className="volver">Volver al inicio</a>
                </div>

                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

                <div className="tabla-scroll-crear-reporte-empresa">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID Usuario</th>
                                <th>Nombre completo</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFinalistas.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center' }}>No hay usuarios finalistas</td>
                                </tr>
                            ) : (
                                usuariosFinalistas.map((u, index) => (
                                    <tr key={index}>
                                        <td>{u.id_usuario}</td>
                                        <td>{u.nombre_completo}</td>
                                        <td>{u.estado_proceso}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="formulario">
                    <h2>Reportar Usuario</h2>

                    <div className="form-group">
                        <label htmlFor="usuario"><strong>Usuario a reportar</strong></label>
                        <select
                            id="usuario"
                            className="search-input"
                            value={selectedUsuario}
                            onChange={(e) => setSelectedUsuario(e.target.value)}
                        >
                            <option value="">Seleccionar Usuario</option>
                            {usuariosFinalistas.map((u, i) => (
                                <option key={i} value={u.nombre_completo}>{u.nombre_completo}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoria"><strong>Categoría del reporte</strong></label>
                        <select
                            id="categoria"
                            className="search-input"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option value="">Seleccionar Categoría</option>
                            {categoriasReporte.map((cat, idx) => (
                                <option key={idx} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="motivo"><strong>Motivo del reporte:</strong></label>
                        <textarea
                            id="motivo"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            className="search-input"
                            rows={4}
                        ></textarea>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button className="btn-aplicar" onClick={enviarReporte}>Enviar Reporte</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportarUsuarioEmpresa;
