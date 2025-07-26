import React, { useEffect, useState } from 'react';
import './rating-company.css';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://34.152.27.187:5000";

const CalificacionEmpresa = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await fetch(`${API_URL}/api/user/company/ratings`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await res.json();
                if (res.ok) {
                    setRatings(data);
                } else {
                    setError(data.message || 'Error al obtener calificaciones');
                }
            } catch (e) {
                setError('Error de red');
            } finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Promedio de Calificaciones por Empresa</h1>
            <div className="button-group">
                <button onClick={() => navigate('/admin_menu')}>Regresar al menú</button>
            </div>
            {loading && <div className="spinner" />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <div className="tabla-scroll">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID Empresa</th>
                                <th>Nombre Empresa</th>
                                <th>Promedio Calificación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center' }}>No hay calificaciones registradas</td>
                                </tr>
                            ) : (
                                ratings.map((r, i) => (
                                    <tr key={i}>
                                        <td>{r.id_empresa}</td>
                                        <td>{r.nombre_empresa}</td>
                                        <td>{r.promedio_calificacion}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CalificacionEmpresa;