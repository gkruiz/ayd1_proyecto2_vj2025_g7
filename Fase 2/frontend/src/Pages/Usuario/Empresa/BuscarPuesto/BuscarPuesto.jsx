import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style-buscar-puesto.css';
const API_URL = "http://34.152.27.187:5000";
const BuscarPuesto = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [fechaText, setFechaText] = useState('');
    const [jornadaText, setJornadaText] = useState('');
    const [modalidadText, setModalidadText] = useState('');

    const [jornadasDisponibles, setJornadasDisponibles] = useState([]);
    const [modalidadesDisponibles, setModalidadesDisponibles] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const cargarOpciones = async () => {
            try {
                const response = await fetch(`${API_URL}/api/company/job/active`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setJornadasDisponibles([...new Set(data.map(job => job.jornada_laboral).filter(Boolean))]);
                    setModalidadesDisponibles([...new Set(data.map(job => job.modalidad_trabajo).filter(Boolean))]);
                }
            } catch (err) {
            }
        };
        cargarOpciones();
    }, []);

    useEffect(() => {
        if (!fechaText) return;
        setLoading(true);
        setError(null);
        fetch(`${API_URL}/api/company/job/date`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ fecha_creacion: fechaText }),
        })
            .then(res => res.json())
            .then(data => setJobs(data))
            .catch(() => setError('Error al buscar por fecha'))
            .finally(() => setLoading(false));
    }, [fechaText]);

    useEffect(() => {
        if (!jornadaText) return;
        setLoading(true);
        setError(null);
        fetch(`${API_URL}/api/company/job/jornada`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ jornada_laboral: jornadaText }),
        })
            .then(res => res.json())
            .then(data => setJobs(data))
            .catch(() => setError('Error al buscar por jornada'))
            .finally(() => setLoading(false));
    }, [jornadaText]);

    useEffect(() => {
        if (!modalidadText) return;
        setLoading(true);
        setError(null);
        fetch(`${API_URL}/api/company/job/modalidad`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ modalidad_trabajo: modalidadText }),
        })
            .then(res => res.json())
            .then(data => setJobs(data))
            .catch(() => setError('Error al buscar por modalidad'))
            .finally(() => setLoading(false));
    }, [modalidadText]);

    useEffect(() => {
        if (!fechaText && !jornadaText && !modalidadText) {
            setLoading(true);
            setError(null);
            fetch(`${API_URL}/api/company/job/active`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => setJobs(data))
                .catch(() => setError('Error al cargar puestos'))
                .finally(() => setLoading(false));
        }
    }, [fechaText, jornadaText, modalidadText]);

    return (
        <div className="container">
            <h1 className="title">Buscar Puestos de Mi Empresa</h1>
            <div className="user-card">
                <div className="header"><h2>Filtrar Puestos</h2></div>
                <div className="filters">
                    <div className="filter-group-horizontal">
                        <div>
                            <label>Fecha creación</label>
                            <input
                                type="date"
                                value={fechaText}
                                onChange={e => {
                                    setFechaText(e.target.value);
                                    setJornadaText('');
                                    setModalidadText('');
                                }}
                            />
                        </div>
                        <div>
                            <label>Jornada</label>
                            <select
                                value={jornadaText}
                                onChange={e => {
                                    setJornadaText(e.target.value);
                                    setFechaText('');
                                    setModalidadText('');
                                }}
                            >
                                <option value="">Seleccione jornada</option>
                                {jornadasDisponibles.map((j, i) => (
                                    <option key={i} value={j}>{j}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Modalidad</label>
                            <select
                                value={modalidadText}
                                onChange={e => {
                                    setModalidadText(e.target.value);
                                    setFechaText('');
                                    setJornadaText('');
                                }}
                            >
                                <option value="">Seleccione modalidad</option>
                                {modalidadesDisponibles.map((m, i) => (
                                    <option key={i} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="button-group">
                    <button type="button" onClick={() => navigate('/Menu-Empresa')}>Regresar al menú principal</button>
                </div>
                {loading && <p><span className="spinner" /></p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="tabla-scroll">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Ubicación</th>
                                <th>Sueldo</th>
                                <th>Modalidad</th>
                                <th>Jornada</th>
                                <th>Fecha Publicación</th>
                                <th>Área</th>
                                <th>Rango .</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>
                                        No hay puestos disponibles
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job, index) => (
                                    <tr key={index}>
                                        <td>{job.id}</td>
                                        <td>{job.nombre_puesto}</td>
                                        <td>{job.ubicacion_fisica}</td>
                                        <td>Q. {job.sueldo_mensual}</td>
                                        <td>{job.modalidad_trabajo}</td>
                                        <td>{job.jornada_laboral}</td>
                                        <td>{job.fecha_creacion}</td>
                                        <td>{job.area}</td>
                                        <td>{job.rango_edad}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BuscarPuesto;