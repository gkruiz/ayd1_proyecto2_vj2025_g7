import React, { useState, useEffect } from 'react';
import './reportar-empresa-style.css';
const API_URL = "http://34.152.27.187:5000";

const categoriasReporte = [
    "Empresa Falsa",
    "Falta de pago",
    "Falta de compromiso",
    "Malas prácticas laborales",
    "Discriminación",
    "Violación de derechos laborales",
    "Incumplimiento de contrato",
    "Mal servicio al cliente",
    "Otro"
];

const ReportarEmpresaUsuario = () => {
    const [usuariosFinalistas, setUsuariosFinalistas] = useState([]);
    const [empresasUnicas, setEmpresasUnicas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [selectedEmpresa, setSelectedEmpresa] = useState('');
    const [categoria, setCategoria] = useState('');
    const [motivo, setMotivo] = useState('');

    const enviarReporte = async () => {
        if (!selectedEmpresa || !categoria || !motivo) {
            setError('Debe seleccionar una empresa, una categoría y escribir el motivo');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const response = await fetch(`${API_URL}/api/user/report-company`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    nombre_empresa: selectedEmpresa,
                    categoria: categoria,
                    motivo: motivo
                })
            });

            const result = await response.json();
            if (response.ok) {
                setSuccessMsg(result.message);
                setSelectedEmpresa('');
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

    const obtenerAplicaciones = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/user/job/status/final`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setUsuariosFinalistas(data);
                const nombresEmpresas = [...new Set(data.map(app => app.nombre_empresa))];
                setEmpresasUnicas(nombresEmpresas);
            } else {
                setError(data.message);
            }
        } catch (e) {
            setError('Error al obtener aplicaciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerAplicaciones();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Reportar Empresa</h1>

            <div className="user-card">
                <div className="header">
                    <a href="/InicioUsuario" className="volver">Volver al inicio</a>
                </div>

                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

                <div className="tabla-scroll-crear-reporte-empresa">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Puesto</th>
                                <th>Empresa</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFinalistas.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>No hay aplicaciones finalistas</td>
                                </tr>
                            ) : (
                                usuariosFinalistas.map((u) => (
                                    <tr key={u.id_aplicacion}>
                                        <td>{u.nombre_puesto}</td>
                                        <td>{u.nombre_empresa}</td>
                                        <td>{u.estado_proceso}</td>
                                        <td>{u.fecha_aplicacion}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="formulario">
                    <h2>Reportar Empresa</h2>

                    <div className="form-group">
                        <label htmlFor="empresa"><strong>Empresa a reportar</strong></label>
                        <select
                            id="empresa"
                            className="search-input"
                            value={selectedEmpresa}
                            onChange={(e) => setSelectedEmpresa(e.target.value)}
                        >
                            <option value="">Seleccionar Empresa</option>
                            {empresasUnicas.map((nombre, i) => (
                                <option key={i} value={nombre}>{nombre}</option>
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

export default ReportarEmpresaUsuario;
